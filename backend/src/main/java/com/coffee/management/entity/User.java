package com.coffee.management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a user in the system (Owner, Manager, or Staff).
 * Includes audit fields, soft delete, optimistic locking and password change tracking.
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_store_status", columnList = "store_id, status"),
    @Index(name = "idx_users_username", columnList = "username"),
    @Index(name = "idx_users_not_deleted", columnList = "is_deleted")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Lob
    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    private String avatarUrl;

    // ────────────────────────────────────────────────
    // Bảo mật: yêu cầu đổi mật khẩu lần đầu đăng nhập
    // ────────────────────────────────────────────────
    @Column(name = "need_password_change", nullable = false)
    @Builder.Default
    private Boolean needPasswordChange = true;  // true = nhân viên mới phải đổi mật khẩu

    // ────────────────────────────────────────────────
    // Soft Delete: không xóa cứng, chỉ đánh dấu đã xóa
    // ────────────────────────────────────────────────
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ────────────────────────────────────────────────
    // Optimistic Locking: chống ghi đè đồng thời
    // ────────────────────────────────────────────────
    @Version
    @Column(name = "version")
    private Integer version;

    // ────────────────────────────────────────────────
    // Audit columns
    // ────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
