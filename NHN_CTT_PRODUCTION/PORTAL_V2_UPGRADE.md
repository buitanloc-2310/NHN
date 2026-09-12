# NHN CTT 2.0 — Nâng cấp Cổng thông tin

Bản nâng cấp này **giữ nguyên toàn bộ chức năng hiện có** và bổ sung lớp vận hành Cổng thông tin theo hướng production.

## Bổ sung chính

- Dashboard công khai tổng hợp số liệu hoạt động.
- Dịch vụ nhanh có thể quản lý bằng D1.
- Thông báo toàn cổng có thời gian hiệu lực và mức độ cảnh báo.
- Tìm kiếm hợp nhất: bảng tin, hoạt động, văn bản công khai.
- Trang trạng thái hệ thống theo thời gian thực.
- Trung tâm vận hành dành cho Admin với số liệu người dùng, hồ sơ, GCN, file, ticket và audit gần nhất.
- Hạ tầng sự cố dịch vụ (`service_incidents`) để công khai trạng thái minh bạch.
- Nền tảng API client (`api_clients`) cho tích hợp có kiểm soát trong các bản tiếp theo.

## Triển khai

Chạy migration mới sau các migration cũ:

```bash
npx wrangler d1 migrations apply DB --remote
```

Sau đó deploy Worker như hiện tại.

## Endpoint mới

- `GET /api/public/portal`
- `GET /api/public/search?q=...`
- `GET /api/status`
- `GET /api/admin/portal/overview`
- `GET|POST /api/admin/portal/announcements`
- `PATCH|DELETE /api/admin/portal/announcements/:id`

## Nguyên tắc tương thích

Không đổi tên bảng cũ, không xóa route cũ, không đổi D1/R2 binding, không sửa luồng tra cứu GCN hiện hữu. Migration 0004 chỉ thêm bảng/index/setting/module mới.
