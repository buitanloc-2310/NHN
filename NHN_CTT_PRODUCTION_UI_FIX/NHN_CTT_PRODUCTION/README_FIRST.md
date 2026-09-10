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

Super Admin không còn được cài sẵn trong mã nguồn.
Sau khi chạy migrations, mở website và bấm **Đăng nhập** để **Khởi tạo tài khoản quản trị đầu tiên** bằng họ tên, email và mật khẩu do bạn tự đặt.
Sau khi khởi tạo, các lần sau đăng nhập bằng Email + Mật khẩu như bình thường.
