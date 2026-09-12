# Ứng dụng Nhà Hán Ngữ — Nâng cấp 2026

Bản này được nâng cấp trực tiếp từ project CTT gốc nhưng đổi cách gọi sản phẩm thành **Ứng dụng Nhà Hán Ngữ**.

## Nguyên tắc dữ liệu
- Không xóa hoặc reset dữ liệu cũ.
- Migration `0004_app_upgrade.sql` chỉ dùng `INSERT OR IGNORE`.
- Giữ nguyên bảng, D1 binding `DB`, R2 binding `FILES`, endpoint GCN/GXN và cơ chế liên thông Sky First.

## Nội dung có sẵn
Trang chủ có sẵn Hero, giới thiệu, nhóm tiện ích, phần Nhà Hán Ngữ trong hệ sinh thái Sky First, bảng tin, CTA cộng đồng và footer nhiều cột.

## Chỉnh sửa trong Admin
Vào **Quản trị → Nội dung & giao diện** để sửa nội dung trang chủ, menu, footer, thông tin liên hệ và đường dẫn API. Bản tin, sự kiện, biểu mẫu, GCN/GXN và các dữ liệu nghiệp vụ vẫn quản lý ở module cũ.

## API GCN/GXN
Giữ nguyên: `GET /api/lookup/certificate?code=...`

Origin Sky First tiếp tục được phép đọc: `https://skyfirst.io.vn` và `https://www.skyfirst.io.vn`.
