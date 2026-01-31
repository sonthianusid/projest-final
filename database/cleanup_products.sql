-- ===================================
-- ลบสินค้าที่ไม่ใช่รองเท้า
-- ===================================
-- รันไฟล์นี้ใน phpMyAdmin

USE sonthishop;

-- ลบสินค้าเก่า (id 1-8) ที่ไม่ใช่รองเท้า
DELETE FROM products WHERE id <= 8;

-- หรือลบตาม category
-- DELETE FROM products WHERE category IN ('Laptop', 'Smartphone', 'Tablet', 'Audio', 'Wearable', 'Accessory');

-- ตรวจสอบ: ควรเหลือแค่รองเท้า
SELECT id, name, brand, category, price FROM products ORDER BY id;
