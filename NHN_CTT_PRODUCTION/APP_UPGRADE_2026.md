# Ứng dụng Nhà Hán Ngữ — Nâng cấp 2026

Bản này nâng cấp trực tiếp trên project gốc và không xóa dữ liệu nghiệp vụ cũ.

## Quan trọng
- Không chạy migration reset nếu đang có dữ liệu thật.
- Chỉ áp dụng `migrations/0004_app_upgrade_2026.sql` sau các migration nền tảng hiện có.
- API tra cứu GCN/GXN giữ nguyên: `GET /api/lookup/certificate?code=...`.
- CORS liên thông Sky First giữ `https://skyfirst.io.vn` và `https://www.skyfirst.io.vn`.
- Admin có mục **Cài đặt ứng dụng** và **Thư viện tệp**.
- Bảo trì: người dùng công khai thấy trang bảo trì; quản trị viên đã đăng nhập vẫn có thể vào ứng dụng.
- Facebook: https://www.facebook.com/nhahanngu.vn
- TikTok: https://www.tiktok.com/@nhahanngu
