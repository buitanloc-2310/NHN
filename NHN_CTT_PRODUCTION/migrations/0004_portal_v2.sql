PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  audience TEXT NOT NULL DEFAULT 'public',
  link TEXT,
  starts_at TEXT,
  ends_at TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(enabled, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS portal_shortcuts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  href TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'public',
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_portal_shortcuts_sort ON portal_shortcuts(enabled, audience, sort_order);

CREATE TABLE IF NOT EXISTS service_incidents (
  id TEXT PRIMARY KEY,
  service_key TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'investigating',
  impact TEXT NOT NULL DEFAULT 'minor',
  message TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT,
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_service_incidents_status ON service_incidents(status, started_at);

CREATE TABLE IF NOT EXISTS api_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  allowed_origins_json TEXT NOT NULL DEFAULT '[]',
  scopes_json TEXT NOT NULL DEFAULT '[]',
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO modules(key,name,category,enabled,sort_order,description)
VALUES('portal_ops','Trung tâm vận hành Cổng thông tin','Hệ thống',1,5,'Tổng quan vận hành, thông báo, trạng thái dịch vụ và tìm kiếm hợp nhất.');

INSERT OR IGNORE INTO settings(key,value_json) VALUES('portal_version','"2.0"');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('public_search_enabled','true');
INSERT OR IGNORE INTO settings(key,value_json) VALUES('public_status_enabled','true');

INSERT OR IGNORE INTO portal_shortcuts(id,title,description,icon,href,audience,sort_order,enabled) VALUES
('shortcut-lookup','Tra cứu GCN/GXN','Xác thực giấy chứng nhận, giấy xác nhận do Nhà Hán Ngữ phát hành.','✓','#lookup','public',10,1),
('shortcut-record','Tra cứu hồ sơ','Theo dõi trạng thái hồ sơ đã gửi bằng mã hồ sơ và email.','⌕','#lookup','public',20,1),
('shortcut-events','Hoạt động & Sự kiện','Theo dõi các hoạt động, sự kiện và chương trình cộng đồng.','◫','#activities','public',30,1),
('shortcut-join','Tham gia Nhà Hán Ngữ','Mở các biểu mẫu đăng ký thành viên, cộng tác viên và hỗ trợ.','＋','#participate','public',40,1);

INSERT OR IGNORE INTO meta(key,value) VALUES('portal_version','NHN-CTT-2.0');
UPDATE meta SET value='NHN-CTT-2.0' WHERE key='portal_version';
