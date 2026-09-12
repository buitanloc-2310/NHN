# NHÀ HÁN NGỮ — cấu hình Cloudflare chuẩn

Giữ nguyên cấu hình Dashboard:
- Build command: None
- Deploy command: `npx wrangler deploy`
- Version command: `npx wrangler versions upload`
- Root directory: `NHN_CTT_PRODUCTION_UI_FIX/NHN_CTT_PRODUCTION`

## Cấu trúc GitHub bắt buộc
Repo root phải nhìn thấy thư mục `NHN_CTT_PRODUCTION_UI_FIX`, bên trong là `NHN_CTT_PRODUCTION`.
Trong `NHN_CTT_PRODUCTION` có trực tiếp: `wrangler.jsonc`, `package.json`, `src/`, `public/`, `migrations/`.
Không thêm tầng `NHN-main`, `NHN-main-fixed` hay tên ZIP vào GitHub.

## Static assets
`wrangler.jsonc` đã khai báo `assets.directory = "./public"` và binding `ASSETS`, vì vậy `npx wrangler deploy` tự deploy thư mục public; không cần Build command.

## Khởi tạo lại Super Admin
`npx wrangler deploy` KHÔNG tự chạy D1 migrations. Nếu CSDL hiện vẫn có user cũ, giao diện sẽ đúng khi tiếp tục hiện Đăng nhập.
Chỉ khi migration reset đã được áp dụng và CSDL không còn user/root admin, `/api/auth/setup-status` mới trả `needs_setup=true` và UI hiện “Khởi tạo tài khoản quản trị đầu tiên”.

Migration reset là `migrations/0003_reset_auth_bootstrap.sql`. Đây là thao tác phá hủy tài khoản/phiên/phân quyền hiện có, nên phải chạy có chủ đích và sao lưu D1 trước. Không nhúng reset tự động vào mỗi lần deploy.
