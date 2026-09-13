PRAGMA foreign_keys = ON;
-- Đồng bộ domain production hiện hành. Migration này không xóa dữ liệu.
INSERT INTO settings(key,value_json,updated_at)
VALUES('app_url','"https://app.nhahanngu.io.vn"',CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET
  value_json=excluded.value_json,
  updated_at=CURRENT_TIMESTAMP;
INSERT OR REPLACE INTO meta(key,value) VALUES('production_domain','https://app.nhahanngu.io.vn');
