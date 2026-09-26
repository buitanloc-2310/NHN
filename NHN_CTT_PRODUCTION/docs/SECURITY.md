# BẢO MẬT

- Password được PBKDF2-SHA256 với salt riêng, 150.000 vòng; D1 không lưu mật khẩu chữ thường.
- Session token ngẫu nhiên chỉ lưu hash trong database; cookie HttpOnly + Secure + SameSite=Strict.
- 2FA TOTP có sẵn.
- Super Admin gốc được bảo vệ khỏi khóa/gỡ quyền bởi Admin khác.
- State-changing API kiểm tra same-origin.
- Rate limit áp dụng cho đăng nhập và gửi biểu mẫu.
- Turnstile có thể bật bằng secret/site key.
- File R2 private mặc định; Worker kiểm tra owner/permission trước khi trả file.
- Security headers/CSP/HSTS được thêm tại Worker.
- Secret không đặt trong source/wrangler; dùng `wrangler secret put`.
- Audit Log ghi thao tác nghiệp vụ và quản trị.
- Backup lưu private trong R2.

## Lưu ý

Không còn tệp hoặc mật khẩu Super Admin mặc định. Super Admin gốc được tạo trực tiếp ở bước khởi tạo đầu tiên sau khi migrations hoàn tất. Không đưa mật khẩu khởi tạo vào mã nguồn, tài liệu hoặc biến công khai.
