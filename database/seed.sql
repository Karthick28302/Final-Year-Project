-- ============================================================
-- Smart Attendance System — Seed Data
-- Run AFTER schema.sql
-- ============================================================

USE attendance_system;

-- ------------------------------------------------------------
-- Default admin account
-- Username : admin
-- Password : admin123  (bcrypt hash below — change in production)
-- Generate a new hash with: python -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('admin123'))"
-- ------------------------------------------------------------
INSERT INTO admins (username, password) VALUES
('admin', '$2b$12$KIXn9J7Qz1e1lW9HmVqGXOeY6BpZjT3RkLnMwA8cDfUvS5xYpN2qi')
ON DUPLICATE KEY UPDATE username = username;

-- ------------------------------------------------------------
-- Sample employees (names must match face encoding keys — lowercase)
-- ------------------------------------------------------------
INSERT INTO users (name) VALUES
('karthick')
ON DUPLICATE KEY UPDATE name = name;

-- ------------------------------------------------------------
-- Sample attendance rows for testing the dashboard
-- ------------------------------------------------------------
INSERT INTO attendance (user_id, login_time, logout_time) VALUES
(1, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR),
(1, NOW() - INTERVAL 1 DAY + INTERVAL 9 HOUR, NOW() - INTERVAL 1 DAY + INTERVAL 17 HOUR);