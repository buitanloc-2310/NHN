# TRIỂN KHAI NHÀ HÁN NGỮ LÊN CLOUDFLARE — 2026

## Cấu hình chính xác cho repository hiện tại

- Worker name: `nhn`
- Root directory trên GitHub: `NHN_CTT_PRODUCTION_UI_FIX/NHN_CTT_PRODUCTION`
- Build command: `npm run build`
- Deploy command: `npm run deploy:cloudflare`
- Version command: để trống

`npm run build` chạy bộ kiểm tra source. `npm run deploy:cloudflare` áp dụng **các D1 migration chưa từng chạy** rồi mới deploy Worker. Wrangler D1 chỉ áp dụng migration còn pending; migration đã ghi nhận sẽ không chạy lại ở các lần deploy sau.

## Vì sao cần deploy command này ở bản reset tài khoản

Migration `0003_reset_auth_bootstrap.sql` là migration chuyển đổi một lần: xóa dữ liệu đăng nhập/quyền cũ và trạng thái Super Admin gốc để website cho phép khởi tạo lại tài khoản quản trị đầu tiên. Sau khi migration này đã được D1 ghi nhận là applied, deploy sau không chạy lại migration đó.

## Khởi tạo Super Admin

Sau khi deploy thành công, mở website → Đăng nhập. Nếu D1 chưa có Super Admin gốc và không còn user cũ, giao diện phải hiện **Khởi tạo tài khoản quản trị đầu tiên**. Tự nhập Họ tên, Email và mật khẩu tối thiểu 10 ký tự. Không có email hoặc mật khẩu mặc định trong source.

Nếu endpoint kiểm tra trạng thái D1 lỗi, giao diện mới sẽ báo **Chưa thể kiểm tra trạng thái tài khoản** thay vì âm thầm hiện form đăng nhập.

## Tài nguyên Cloudflare hiện dùng

- D1 binding: `DB`, database name `nhn`
- R2 binding: `FILES`, bucket `nhn-app-files`
- APP_URL: `https://ctt.nhahanngu.io.vn`

## Sau deploy

Kiểm tra `/api/health`, sau đó kiểm tra màn hình khởi tạo/đăng nhập, tạo Super Admin, đăng xuất và đăng nhập lại.
