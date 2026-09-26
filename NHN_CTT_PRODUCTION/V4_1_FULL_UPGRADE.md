# NHN V4.1 FULL UPGRADE

- Thay toàn bộ nhận diện hiển thị bằng logo chính thức do chủ hệ thống cung cấp.
- Tạo favicon, Apple touch icon và PWA icon từ cùng nhận diện.
- Xóa asset SFEC cũ khỏi public assets.
- Đổi cookie phiên mới sang `nhn_session`, vẫn đọc cookie cũ trong giai đoạn chuyển tiếp.
- Đổi namespace IP hash từ SFEC sang NHN.
- Loại mục Lớp học khỏi Admin UI theo product spec hiện tại.
- Sửa default hero cover còn tham chiếu SFEC.
- Không hard reload khi đăng xuất; router cập nhật theo SPA.
- Nâng cache service worker để client nhận branding mới.
- Tăng tính app-like cho Admin: sticky nav/top, scroll riêng, responsive.
- Đồng bộ tài liệu MODULES với phạm vi sản phẩm hiện hành.
