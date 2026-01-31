-- ===========================================
-- MySQL Quick Reference - SonthiShop
-- ===========================================

-- เข้าสู่ MySQL
-- mysql -u root -p

-- ===========================================
-- เลือกฐานข้อมูล
-- ===========================================
USE sonthishop;

-- ===========================================
-- ดูข้อมูลทั้งหมด
-- ===========================================

-- ดูผู้ใช้ทั้งหมด
SELECT * FROM users;

-- ดูสินค้าทั้งหมด
SELECT * FROM products;

-- ดูคำสั่งซื้อทั้งหมด
SELECT * FROM orders;

-- ดูรายการสินค้าในคำสั่งซื้อ
SELECT * FROM order_items;

-- ดูตะกร้าสินค้า
SELECT * FROM cart;

-- ===========================================
-- ดูข้อมูลแบบเฉพาะเจาะจง
-- ===========================================

-- ดูแค่ id, ชื่อ, ราคาสินค้า
SELECT id, name, price, stock FROM products;

-- ดูสินค้าที่ราคาต่ำกว่า 10,000 บาท
SELECT name, price FROM products WHERE price < 10000;

-- ดูสินค้าที่เป็น category 'Laptop'
SELECT * FROM products WHERE category = 'Laptop';

-- ดูสินค้าที่ stock น้อยกว่า 20
SELECT name, stock FROM products WHERE stock < 20;

-- ดู Admin users
SELECT * FROM users WHERE role = 'admin';

-- ===========================================
-- Join Tables (ดูข้อมูลจากหลายตาราง)
-- ===========================================

-- ดูคำสั่งซื้อพร้อมข้อมูลผู้ซื้อ
SELECT 
    o.id,
    o.order_number,
    u.name as customer_name,
    o.total_amount,
    o.status,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id;

-- ดูรายการสินค้าในแต่ละ order
SELECT 
    o.order_number,
    oi.product_name,
    oi.quantity,
    oi.price,
    oi.subtotal
FROM orders o
JOIN order_items oi ON o.id = oi.order_id;

-- ดูสินค้าในตะกร้าพร้อมข้อมูลผู้ใช้
SELECT 
    u.name as user_name,
    p.name as product_name,
    c.quantity,
    p.price,
    (c.quantity * p.price) as total
FROM cart c
JOIN users u ON c.user_id = u.id
JOIN products p ON c.product_id = p.id;

-- ===========================================
-- นับและสรุปข้อมูล
-- ===========================================

-- นับจำนวนผู้ใช้
SELECT COUNT(*) as total_users FROM users;

-- นับจำนวนสินค้า
SELECT COUNT(*) as total_products FROM products;

-- นับจำนวน orders แต่ละสถานะ
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;

-- ยอดขายรวมทั้งหมด
SELECT SUM(total_amount) as total_sales FROM orders;

-- ราคาสินค้าเฉลี่ย
SELECT AVG(price) as avg_price FROM products;

-- สินค้าที่ขายดีที่สุด
SELECT 
    product_name,
    SUM(quantity) as total_sold,
    SUM(subtotal) as total_revenue
FROM order_items
GROUP BY product_name
ORDER BY total_sold DESC;

-- ===========================================
-- เรียงลำดับและจำกัดจำนวน
-- ===========================================

-- สินค้า 5 อันดับแรกที่แพงที่สุด
SELECT name, price FROM products 
ORDER BY price DESC 
LIMIT 5;

-- สินค้า 5 อันดับแรกที่ถูกที่สุด
SELECT name, price FROM products 
ORDER BY price ASC 
LIMIT 5;

-- คำสั่งซื้อล่าสุด 10 รายการ
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- ===========================================
-- ค้นหาข้อมูล (LIKE)
-- ===========================================

-- ค้นหาสินค้าที่มีคำว่า "Pro"
SELECT * FROM products WHERE name LIKE '%Pro%';

-- ค้นหาผู้ใช้ที่มี email
SELECT * FROM users WHERE email IS NOT NULL;

-- ===========================================
-- อัพเดทข้อมูล (ระวัง! ใช้ในการทดสอบเท่านั้น)
-- ===========================================

-- เพิ่ม stock สินค้า
-- UPDATE products SET stock = stock + 10 WHERE id = 1;

-- เปลี่ยนสถานะ order
-- UPDATE orders SET status = 'delivered' WHERE id = 1;

-- ===========================================
-- ลบข้อมูล (ระวัง! อันตราย!)
-- ===========================================

-- ลบสินค้า (comment ไว้เพื่อป้องกันการลบโดยไม่ตั้งใจ)
-- DELETE FROM products WHERE id = 999;

-- ===========================================
-- ดูโครงสร้างตาราง
-- ===========================================

DESCRIBE users;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE cart;

-- หรือ
SHOW CREATE TABLE products;

-- ===========================================
-- ดูข้อมูล Metadata
-- ===========================================

-- ดูขนาดของแต่ละตาราง
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = 'sonthishop'
ORDER BY (data_length + index_length) DESC;

-- ===========================================
-- Backup Commands (รันใน Command Line)
-- ===========================================

-- Backup ฐานข้อมูล
-- mysqldump -u root -p sonthishop > backup.sql

-- Restore ฐานข้อมูล
-- mysql -u root -p sonthishop < backup.sql

-- ===========================================
-- ทดสอบ Performance
-- ===========================================

-- ดู Query Execution Plan
EXPLAIN SELECT * FROM products WHERE price > 10000;

-- แสดง Indexes
SHOW INDEX FROM products;
