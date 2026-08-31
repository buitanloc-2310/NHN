# CỔNG THÔNG TIN NHÀ HÁN NGỮ — NHN V1 PRODUCTION

Domain: https://ctt.nhahanngu.io.vn
Worker: nhn
D1: nhn-app-db
R2: nhn-app-files

## Triển khai mới
1. Tạo D1 `nhn-app-db` và R2 `nhn-app-files`.
2. Điền UUID D1 vào `wrangler.jsonc` thay `REPLACE_WITH_NHN_D1_DATABASE_ID`.
3. Chạy `migrations/0001_schema.sql`, sau đó `migrations/0002_seed.sql` — mỗi file đúng 1 lần.
4. Push GitHub và deploy `npx wrangler deploy`.
5. Gắn Custom Domain `ctt.nhahanngu.io.vn`.

Không có lớp học. Các module lớp học/TNV dạy học/đơn vị trực thuộc bị tắt từ seed.

Super Admin: `nhahanngu.vn@gmail.com`
Mật khẩu tạm: `NHN@2026-Start!`
Hệ thống bắt đổi mật khẩu lần đầu. Không giữ mật khẩu tạm sau khi đăng nhập.
