# Liên thông Giấy chứng nhận Nhà Hán Ngữ → Sky First Network

- Nguồn dữ liệu gốc: D1 của Nhà Hán Ngữ, bảng `certificates`.
- Endpoint công khai: `GET /api/lookup/certificate?code=...`.
- Chỉ trả các bản ghi có trạng thái `issued` hoặc `revoked`.
- Cho phép CORS đọc từ `https://skyfirst.io.vn` và `https://www.skyfirst.io.vn`.
- Sau khi Nhà Hán Ngữ phát hành mã, trang tra cứu Sky First Network có thể đối chiếu trực tiếp mã đó mà không cần sao chép bản ghi sang Firestore.
- Bản ghi bị thu hồi vẫn được trả về với trạng thái thu hồi, không bị hiển thị như còn hiệu lực.
- Không dùng cache cho endpoint xác thực để giảm nguy cơ hiển thị trạng thái cũ.
