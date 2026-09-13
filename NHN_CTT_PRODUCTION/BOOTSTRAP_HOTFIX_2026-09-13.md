# Bootstrap hotfix — 2026-09-13

- Giảm PBKDF2 khi bootstrap và đăng ký từ 210000 xuống 100000 vòng.
- Bootstrap có phân đoạn lỗi (`stage`) để chẩn đoán lỗi 500 rõ hơn.
- Nếu lỗi xảy ra sau khi đã tạo user, hệ thống cố gắng dọn user/role/settings/session tạo dở để có thể thử lại.
- Lỗi chi tiết được ghi vào Cloudflare Logs bằng `AUTH_BOOTSTRAP_FAILED`; API không trả stack trace ra trình duyệt.
