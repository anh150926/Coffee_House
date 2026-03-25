package com.coffee.management.dto.user;

/**
 * DTO Projection for user list views.
 * Only selects the columns needed — avoids fetching avatarUrl (LONGTEXT) and passwordHash.
 * Used by list endpoints to cut database load significantly.
 */
public interface UserSummary {
    Long getId();
    String getUsername();
    String getFullName();
    String getEmail();
    String getPhone();
    String getRole();
    String getStatus();
    String getStoreName();           // Từ JOIN với bảng stores
    Boolean getNeedPasswordChange();
}
