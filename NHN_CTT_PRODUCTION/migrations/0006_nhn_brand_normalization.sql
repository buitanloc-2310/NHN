-- NHN V4.1: normalize legacy brand defaults/data without dropping historical tables.
UPDATE forms SET recipient_email='nhahanngu.vn@gmail.com' WHERE lower(recipient_email)='sfec.englishclub@gmail.com';
UPDATE classes SET unit_code='NHN' WHERE unit_code='SFEC' AND EXISTS (SELECT 1 FROM units WHERE code='NHN');
UPDATE events SET unit_code='NHN' WHERE unit_code='SFEC' AND EXISTS (SELECT 1 FROM units WHERE code='NHN');
