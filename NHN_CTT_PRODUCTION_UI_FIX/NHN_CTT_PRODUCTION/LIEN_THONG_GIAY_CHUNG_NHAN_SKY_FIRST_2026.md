# Liên thông Giấy chứng nhận Nhà Hán Ngữ → Sky First Network

- Nguồn dữ liệu gốc: D1 của Nhà Hán Ngữ, bảng `certificates`.
- Endpoint công khai: `GET /api/lookup/certificate?code=...`.
- Chỉ trả các bản ghi có trạng thái `issued` hoặc `revoked`.
- Cho phép CORS đọc từ `https://skyfirst.io.vn` và `https://www.skyfirst.io.vn`.
- Sau khi Nhà Hán Ngữ phát hành mã, trang tra cứu Sky First Network có thể đối chiếu trực tiếp mã đó mà không cần sao chép bản ghi sang Firestore.
- Bản ghi bị thu hồi vẫn được trả về với trạng thái thu hồi, không bị hiển thị như còn hiệu lực.
- Không dùng cache cho endpoint xác thực để giảm nguy cơ hiển thị trạng thái cũ.


## Cam kết tương thích sau nâng cấp App

- Việc đổi cách gọi từ “Cổng Thông tin” sang “Ứng dụng Nhà Hán Ngữ” chỉ thay đổi nhận diện sản phẩm/giao diện; **không đổi endpoint liên thông**.
- Sky First Network tại `https://skyfirst.io.vn` và `https://www.skyfirst.io.vn` tiếp tục tra cứu trực tiếp qua `GET /api/lookup/certificate?code=...`.
- Không chuyển hoặc sao chép nguồn dữ liệu GCN/GXN sang hệ thống tổng hợp. D1 Nhà Hán Ngữ vẫn là nguồn dữ liệu gốc.
- API tiếp tục trả cả trạng thái `issued` và `revoked`, vì vậy trang tổng hợp Sky First có thể hiển thị chính xác chứng nhận còn hiệu lực hoặc đã thu hồi.
- Các migration nâng cấp mới chỉ thêm cấu hình/nội dung bằng `INSERT OR IGNORE`, không xóa dữ liệu cũ.
