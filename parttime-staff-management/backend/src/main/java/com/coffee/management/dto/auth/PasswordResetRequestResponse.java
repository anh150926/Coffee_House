package com.coffee.management.dto.auth;

import com.coffee.management.entity.PasswordResetRequest;
import com.coffee.management.entity.PasswordResetStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequestResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private PasswordResetStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String storeName;
    private String userRole;

    public static PasswordResetRequestResponse fromEntity(PasswordResetRequest request) {
        return PasswordResetRequestResponse.builder()
                .id(request.getId())
                .userId(request.getUser().getId())
                .userName(request.getUser().getFullName())
                .userEmail(request.getUser().getEmail())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .storeName(request.getUser().getStore() != null ? request.getUser().getStore().getName() : null)
                .userRole(request.getUser().getRole().name())
                .build();
    }
}
