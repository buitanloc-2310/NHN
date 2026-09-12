PRAGMA foreign_keys = ON;

-- NHN APP UPGRADE 2026
-- Additive only: does not delete, replace or overwrite existing operational data.
-- Existing users, sessions, submissions, certificates, news, events, files and settings are preserved.

INSERT OR IGNORE INTO settings(key,value_json) VALUES('product_name','"Ứng dụng Nhà Hán Ngữ"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('product_eyebrow','"ỨNG DỤNG NHÀ HÁN NGỮ"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_intro_title','"Một không gian số thống nhất cho cộng đồng Nhà Hán Ngữ"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_intro_text','"Ứng dụng Nhà Hán Ngữ kết nối hoạt động, thông báo, hồ sơ đăng ký, tài nguyên nội bộ và hệ thống xác thực Giấy chứng nhận/Giấy xác nhận trên cùng một nền tảng. Dữ liệu nghiệp vụ được quản lý tập trung để người dùng tra cứu thuận tiện và đội ngũ vận hành xử lý nhất quán."');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_feature_cards','[{"title":"Hoạt động & Sự kiện","text":"Theo dõi chương trình, lịch hoạt động và các đợt đăng ký đang mở.","href":"#activities"},{"title":"Tra cứu GCN/GXN","text":"Đối chiếu mã phát hành trực tiếp với dữ liệu gốc của Nhà Hán Ngữ.","href":"#lookup"},{"title":"Bảng tin","text":"Cập nhật thông báo, hoạt động cộng đồng và nội dung vận hành mới nhất.","href":"#news"},{"title":"Tham gia Nhà Hán Ngữ","text":"Gửi hồ sơ tham gia, cộng tác hoặc đăng ký chương trình trực tuyến.","href":"#participate"}]');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_about_title','"Nhà Hán Ngữ trong hệ sinh thái Sky First"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_about_text','"Nhà Hán Ngữ là đơn vị hoạt động theo định hướng Hán ngữ, học tập, chia sẻ tri thức và phát triển cộng đồng trong hệ sinh thái Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First. Ứng dụng này phục vụ quản lý hoạt động, hồ sơ, nội dung, xác thực chứng nhận và các quy trình hỗ trợ cộng đồng của Nhà Hán Ngữ."');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_services_title','"Dịch vụ và tiện ích"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_service_cards','[{"title":"Tra cứu hồ sơ","text":"Kiểm tra trạng thái hồ sơ bằng mã hồ sơ và email đã đăng ký.","href":"#lookup"},{"title":"Xác thực Giấy chứng nhận","text":"Tra cứu trạng thái còn hiệu lực hoặc đã thu hồi của GCN/GXN.","href":"#lookup"},{"title":"Đăng ký trực tuyến","text":"Tiếp cận các biểu mẫu đang mở mà không cần tạo tài khoản công khai.","href":"#participate"},{"title":"Hỗ trợ & phản hồi","text":"Gửi yêu cầu hỗ trợ, góp ý hoặc báo lỗi tới đội ngũ Nhà Hán Ngữ.","href":"#participate"}]');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_join_title','"Cùng học, cùng chia sẻ, cùng phát triển"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('home_join_text','"Nhà Hán Ngữ hướng đến một cộng đồng cởi mở, nơi người học không chỉ tiếp nhận kiến thức mà còn có thể chia sẻ kinh nghiệm, tham gia hoạt động và đóng góp giá trị cho những người học khác."');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('nav_items','[{"label":"Trang chủ","href":"#home"},{"label":"Hoạt động","href":"#activities"},{"label":"Bảng tin","href":"#news"},{"label":"Tra cứu Giấy chứng nhận","href":"#lookup"},{"label":"Tham gia","href":"#participate"}]');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('footer_about_title','"Ứng dụng Nhà Hán Ngữ"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('footer_about_text','"Không gian số phục vụ hoạt động, hồ sơ, thông báo, hỗ trợ cộng đồng và xác thực Giấy chứng nhận/Giấy xác nhận của Nhà Hán Ngữ."');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('footer_parent_text','"Đơn vị chủ quản: Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First (SFN)."');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('footer_quick_links','[{"label":"Trang chủ","href":"#home"},{"label":"Hoạt động","href":"#activities"},{"label":"Bảng tin","href":"#news"},{"label":"Tra cứu GCN/GXN","href":"#lookup"},{"label":"Tham gia","href":"#participate"},{"label":"Website Nhà Hán Ngữ","href":"https://nhahanngu.io.vn"},{"label":"Sky First Network","href":"https://skyfirst.io.vn"}]');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('footer_transparency_title','"Xác thực & liên thông"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('footer_transparency_text','"Dữ liệu GCN/GXN được đối chiếu từ cơ sở dữ liệu gốc của Nhà Hán Ngữ. Hệ thống tra cứu tổng hợp của Sky First Network có thể xác thực trực tiếp qua API công khai của Nhà Hán Ngữ mà không cần sao chép bản ghi."');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('footer_legal_text','"Thông tin trên ứng dụng phục vụ hoạt động và xác thực nội bộ/cộng đồng của Nhà Hán Ngữ. Trạng thái thu hồi của GCN/GXN luôn được hiển thị khi tra cứu."');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('sfn_lookup_enabled','true');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('sfn_lookup_origins','["https://skyfirst.io.vn","https://www.skyfirst.io.vn"]');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('certificate_api_path','"/api/lookup/certificate?code="');

-- Ready-to-use public content. Existing NEWS-WELCOME remains untouched.
INSERT OR IGNORE INTO news(id,title,slug,body,status,published_at) VALUES(
  'NEWS-APP-2026',
  'Ứng dụng Nhà Hán Ngữ – không gian số thống nhất cho cộng đồng',
  'ung-dung-nha-han-ngu-2026',
  'Nhà Hán Ngữ vận hành ứng dụng như một điểm truy cập thống nhất cho hoạt động, bảng tin, hồ sơ đăng ký, hỗ trợ và xác thực Giấy chứng nhận/Giấy xác nhận. Hệ thống được thiết kế để dữ liệu nghiệp vụ được quản lý tập trung, dễ theo dõi và có thể mở rộng theo nhu cầu thực tế.',
  'published',CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO news(id,title,slug,body,status,published_at) VALUES(
  'NEWS-CERT-LINK-2026',
  'Tra cứu GCN/GXN và liên thông xác thực với Sky First Network',
  'tra-cuu-gcn-gxn-lien-thong-sky-first',
  'GCN/GXN do Nhà Hán Ngữ phát hành có thể được xác thực trực tiếp trên ứng dụng. Đồng thời, hệ thống tổng hợp của Sky First Network tại skyfirst.io.vn có thể đối chiếu mã thông qua API công khai của Nhà Hán Ngữ. Bản ghi bị thu hồi vẫn được trả về đúng trạng thái để bảo đảm tính minh bạch khi xác thực.',
  'published',CURRENT_TIMESTAMP
);
