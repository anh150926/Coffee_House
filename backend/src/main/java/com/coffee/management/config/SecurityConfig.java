package com.coffee.management.config;

import com.coffee.management.filter.LoginRateLimitFilter;
import com.coffee.management.security.CustomUserDetailsService;
import com.coffee.management.security.JwtAuthenticationEntryPoint;
import com.coffee.management.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

/**
 * Spring Security Configuration
 * Includes: JWT stateless auth, HTTP security headers, BCrypt(12), role-based access
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private LoginRateLimitFilter loginRateLimitFilter;

    /**
     * BCrypt with strength 12 — more resistant to brute-force than default (10)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // --- Security Headers ---
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())           // Chống Clickjacking (X-Frame-Options: DENY)
                .contentTypeOptions(Customizer.withDefaults()) // Chống MIME sniffing (X-Content-Type-Options)
                .referrerPolicy(ref -> ref.policy(
                    ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000))                // HSTS: bắt buộc HTTPS 1 năm
            )
            // --- CSRF disabled vì dùng JWT stateless ---
            .csrf(csrf -> csrf.disable())
            // --- Exception handling ---
            .exceptionHandling(exception -> exception
                    .authenticationEntryPoint(unauthorizedHandler))
            // --- Stateless session (JWT) ---
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // --- Authorization rules ---
            .authorizeHttpRequests(auth -> auth
                    // Public endpoints
                    .requestMatchers("/api/v1/auth/**").permitAll()
                    .requestMatchers("/health").permitAll()             // Health check endpoint
                    // Swagger/OpenAPI — chỉ cho phép local dev (bị tắt trên prod qua yml)
                    .requestMatchers("/api-docs/**", "/v3/api-docs/**",
                                     "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    // Pre-flight OPTIONS requests
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // Tất cả endpoints còn lại cần auth
                    .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(loginRateLimitFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
