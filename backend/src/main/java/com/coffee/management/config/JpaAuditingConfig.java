package com.coffee.management.config;

import com.coffee.management.security.UserPrincipal;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Enables Spring Data JPA Auditing.
 * Provides the current authenticated username to @CreatedBy and @LastModifiedBy fields.
 * Works with BaseEntity to auto-populate audit columns on all entities.
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()
                    || auth.getPrincipal() instanceof String) {
                return Optional.of("system");   // Fallback khi chưa đăng nhập (startup, test)
            }
            try {
                UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
                return Optional.of(principal.getUsername());
            } catch (ClassCastException e) {
                return Optional.of("system");
            }
        };
    }
}
