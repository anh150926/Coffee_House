package com.coffee.management.filter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate limiting filter for the login endpoint.
 * Allows maximum 10 login attempts per IP per minute.
 * Returns HTTP 429 Too Many Requests when exceeded.
 */
@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_ATTEMPTS = 10;
    private static final String LOGIN_PATH = "/api/v1/auth/login";

    // Cache: IP -> attempt count, auto-reset after 1 minute
    private final Cache<String, AtomicInteger> attemptCache = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.MINUTES)
            .maximumSize(5_000)
            .build();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        if (LOGIN_PATH.equals(request.getRequestURI())
                && "POST".equalsIgnoreCase(request.getMethod())) {

            String clientIp = getClientIp(request);
            AtomicInteger attempts = attemptCache.get(clientIp, k -> new AtomicInteger(0));

            if (attempts.incrementAndGet() > MAX_ATTEMPTS) {
                response.setStatus(429);  // Too Many Requests
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write(
                    "{\"success\":false,\"message\":\"Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.\",\"errorCode\":\"TOO_MANY_REQUESTS\"}"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Lấy địa chỉ IP thực của client (hỗ trợ cả proxy/load balancer)
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
