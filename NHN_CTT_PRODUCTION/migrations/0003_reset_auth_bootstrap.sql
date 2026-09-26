-- 2026-09: Reset cơ chế tài khoản quản trị để khởi tạo lại từ giao diện.
-- Theo yêu cầu triển khai: xóa phiên, token, phân quyền và tài khoản hiện có.
PRAGMA foreign_keys = ON;
DELETE FROM sessions;
DELETE FROM auth_tokens;
DELETE FROM user_roles;
UPDATE people SET user_id=NULL WHERE user_id IS NOT NULL;
UPDATE submissions SET user_id=NULL WHERE user_id IS NOT NULL;
UPDATE submissions SET assigned_to=NULL WHERE assigned_to IS NOT NULL;
DELETE FROM users;
DELETE FROM settings WHERE key IN ('super_admin_user_id','super_admin_email');
INSERT OR REPLACE INTO meta(key,value) VALUES('auth_bootstrap_version','2');
