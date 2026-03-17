package com.coffee.management.repository;

import com.coffee.management.entity.PasswordResetRequest;
import com.coffee.management.entity.PasswordResetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, Long> {
    List<PasswordResetRequest> findByStatusOrderByCreatedAtDesc(PasswordResetStatus status);
    Optional<PasswordResetRequest> findByUserIdAndStatus(Long userId, PasswordResetStatus status);
}
