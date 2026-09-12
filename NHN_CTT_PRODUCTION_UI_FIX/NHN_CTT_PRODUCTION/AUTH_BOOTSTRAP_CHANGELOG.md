# Đồng bộ cơ chế tài khoản — 2026

- Bỏ tài khoản/mật khẩu Super Admin cài sẵn trong seed.
- Thêm `/api/auth/setup-status` và `/api/auth/bootstrap`.
- Khi CSDL chưa có người dùng, nút Đăng nhập mở màn hình khởi tạo Super Admin đầu tiên.
- Sau khởi tạo, hệ thống quay về đăng nhập Email + Mật khẩu hiện có.
- Root Super Admin được nhận diện bằng `settings.super_admin_user_id`, không còn khóa cứng theo email.
- Migration `0003_reset_auth_bootstrap.sql` xóa dữ liệu xác thực/tài khoản cũ để triển khai có thể khởi tạo lại tài khoản và mật khẩu từ đầu.
- Không thay đổi dữ liệu nghiệp vụ khác; các khóa ngoại người dùng trong hồ sơ/nhân sự được đưa về NULL trước khi xóa tài khoản.
