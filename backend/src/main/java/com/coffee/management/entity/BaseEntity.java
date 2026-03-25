package com.coffee.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Base entity providing standardized audit columns for all entities.
 * All entities should extend this to ensure consistent audit trail.
 *
 * Requires @EnableJpaAuditing on the main application class.
 *
 * Provides: created_at, updated_at, created_by, updated_by
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class BaseEntity {

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Username của người tạo record.
     * Tự động điền bởi Spring Data Auditing (cần AuditorAware bean).
     */
    @CreatedBy
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    /**
     * Username của người sửa record lần cuối.
     */
    @LastModifiedBy
    @Column(name = "updated_by", length = 100)
    private String updatedBy;
}
