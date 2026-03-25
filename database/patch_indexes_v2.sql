-- ============================================================
-- Coffee House — Database Index Patch for TiDB Cloud
-- Run this script in TiDB Cloud SQL Editor (one-time operation)
-- Created: 2026-03-25
-- ============================================================

USE coffee_management;

-- ──────────────────────────────────────────────────────────
-- GROUP 3.1: Performance Indexes
-- ──────────────────────────────────────────────────────────

-- Tìm nhân viên theo cơ sở + trạng thái (truy vấn hằng ngày)
CREATE INDEX IF NOT EXISTS idx_users_store_status
    ON users(store_id, status);

-- Tìm nhân viên chưa bị xóa
CREATE INDEX IF NOT EXISTS idx_users_not_deleted
    ON users(is_deleted);

-- Tìm ca theo cơ sở + thời gian
CREATE INDEX IF NOT EXISTS idx_shifts_store_start
    ON shifts(store_id, start_datetime);

-- Tìm nhiệm vụ theo người nhận + trạng thái
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status
    ON tasks(assigned_to, status);

-- Tìm bảng lương theo tháng
CREATE INDEX IF NOT EXISTS idx_payrolls_user_month
    ON payrolls(user_id, month);

-- Tìm thông báo chưa đọc
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
    ON notifications(user_id, is_read);

-- Tìm yêu cầu theo trạng thái + ngày
CREATE INDEX IF NOT EXISTS idx_requests_status_date
    ON requests(status, created_at);

-- ──────────────────────────────────────────────────────────
-- GROUP 3.2: Add needPasswordChange column
-- (Hibernate ddl-auto=update sẽ tự thêm, nhưng đây là backup manual)
-- ──────────────────────────────────────────────────────────
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS need_password_change TINYINT(1) NOT NULL DEFAULT 1
    COMMENT 'Yêu cầu đổi mật khẩu lần đầu (1=cần đổi, 0=đã đổi)';

-- ──────────────────────────────────────────────────────────
-- GROUP 3.3: Soft Delete columns
-- ──────────────────────────────────────────────────────────
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL;

-- ──────────────────────────────────────────────────────────
-- GROUP 3.4: Optimistic Locking (version column)
-- ──────────────────────────────────────────────────────────
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 0;

ALTER TABLE shifts
    ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 0;

-- ──────────────────────────────────────────────────────────
-- Verify: kiểm tra indexes đã được tạo chưa
-- ──────────────────────────────────────────────────────────
SHOW INDEX FROM users;
SHOW INDEX FROM shifts;
