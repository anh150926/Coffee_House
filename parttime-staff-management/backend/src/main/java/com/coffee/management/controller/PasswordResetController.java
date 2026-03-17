package com.coffee.management.controller;

import com.coffee.management.dto.ApiResponse;
import com.coffee.management.dto.auth.ApprovePasswordResetRequest;
import com.coffee.management.dto.auth.ForgotPasswordRequest;
import com.coffee.management.dto.auth.PasswordResetRequestResponse;
import com.coffee.management.entity.PasswordResetRequest;
import com.coffee.management.entity.PasswordResetStatus;
import com.coffee.management.entity.User;
import com.coffee.management.exception.ResourceNotFoundException;
import com.coffee.management.repository.PasswordResetRequestRepository;
import com.coffee.management.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Authentication and password reset endpoints")
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetRequestRepository passwordResetRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Check for existing pending request
        Optional<PasswordResetRequest> existingRequest = passwordResetRepository
                .findByUserIdAndStatus(user.getId(), PasswordResetStatus.PENDING);
        
        if (existingRequest.isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Một yêu cầu cấp lại mật khẩu đang chờ xử lý. Vui lòng liên hệ Chủ cửa hàng."));
        }

        PasswordResetRequest resetRequest = PasswordResetRequest.builder()
                .user(user)
                .status(PasswordResetStatus.PENDING)
                .build();
        
        passwordResetRepository.save(resetRequest);

        return ResponseEntity.status(201).body(ApiResponse.success("Yêu cầu cấp lại mật khẩu đã được gửi cho Chủ cửa hàng.", null));
    }

    @GetMapping("/password-reset-requests")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "List all password reset requests (Owner only)")
    public ResponseEntity<ApiResponse<List<PasswordResetRequestResponse>>> listRequests() {
        List<PasswordResetRequestResponse> requests = passwordResetRepository.findByStatusOrderByCreatedAtDesc(PasswordResetStatus.PENDING)
                .stream()
                .map(PasswordResetRequestResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @PostMapping("/password-reset-requests/{id}/approve")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Approve a password reset request (Owner only)")
    public ResponseEntity<ApiResponse<Void>> approveRequest(
            @PathVariable Long id,
            @Valid @RequestBody ApprovePasswordResetRequest requestBody) {
            
        PasswordResetRequest resetRequest = passwordResetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PasswordResetRequest", "id", id));
                
        if (resetRequest.getStatus() != PasswordResetStatus.PENDING) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Request is not pending."));
        }

        // Update user's password
        User user = resetRequest.getUser();
        user.setPasswordHash(passwordEncoder.encode(requestBody.getNewPassword()));
        userRepository.save(user);

        // Mark request as approved
        resetRequest.setStatus(PasswordResetStatus.APPROVED);
        passwordResetRepository.save(resetRequest);

        return ResponseEntity.ok(ApiResponse.success("Khôi phục mật khẩu thành công. Mật khẩu mới đã được cập nhật.", null));
    }

    @PostMapping("/password-reset-requests/{id}/reject")
    @PreAuthorize("hasRole('OWNER')")
    @Operation(summary = "Reject a password reset request (Owner only)")
    public ResponseEntity<ApiResponse<Void>> rejectRequest(@PathVariable Long id) {
        PasswordResetRequest resetRequest = passwordResetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PasswordResetRequest", "id", id));
                
        if (resetRequest.getStatus() != PasswordResetStatus.PENDING) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Request is not pending."));
        }

        resetRequest.setStatus(PasswordResetStatus.REJECTED);
        passwordResetRepository.save(resetRequest);

        return ResponseEntity.ok(ApiResponse.success("Đã từ chối yêu cầu cấp lại mật khẩu.", null));
    }
}
