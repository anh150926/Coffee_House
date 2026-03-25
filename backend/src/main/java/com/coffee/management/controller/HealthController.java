package com.coffee.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Health check endpoint — used by monitoring services (cron-job.org)
 * and deployment platforms to verify application availability.
 * Accessible without authentication.
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        status.put("application", "Coffee House Management");

        // Kiểm tra kết nối database
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(3)) {
                status.put("database", "UP");
            } else {
                status.put("database", "DEGRADED");
                status.put("status", "DEGRADED");
            }
        } catch (Exception e) {
            status.put("database", "DOWN");
            status.put("status", "DOWN");
        }

        return ResponseEntity.ok(status);
    }
}
