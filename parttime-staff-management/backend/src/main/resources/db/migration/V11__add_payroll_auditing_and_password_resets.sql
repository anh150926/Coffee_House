-- Add missing columns to payrolls for auditing
ALTER TABLE payrolls 
    ADD COLUMN submitted_at DATETIME,
    ADD COLUMN submitted_by BIGINT,
    ADD COLUMN approved_at DATETIME,
    ADD COLUMN approved_by BIGINT;

-- Create table password_reset_requests
CREATE TABLE password_reset_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prr_user FOREIGN KEY (user_id) REFERENCES users(id)
);
