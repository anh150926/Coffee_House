package com.coffee.management.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * In-memory blacklist for revoked JWT tokens (e.g. after logout).
 * Tokens are automatically evicted after 1 hour (= access token lifetime).
 */
@Service
public class TokenBlacklistService {

    // Tự xóa sau 1 tiếng = thời gian sống của access token
    private final Cache<String, Boolean> blacklist = Caffeine.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .maximumSize(10_000)    // Tối đa 10.000 token bị blacklist đồng thời
            .build();

    /**
     * Thêm token vào blacklist (khi user logout)
     */
    public void blacklist(String token) {
        blacklist.put(token, Boolean.TRUE);
    }

    /**
     * Kiểm tra token có bị blacklist không
     */
    public boolean isBlacklisted(String token) {
        return blacklist.getIfPresent(token) != null;
    }
}
