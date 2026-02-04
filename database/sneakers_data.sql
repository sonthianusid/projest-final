-- ===================================
-- Update Products to Sneakers
-- ===================================
USE sonthishop;

-- Clear existing products and related data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE cart;
TRUNCATE TABLE user_favorites;
TRUNCATE TABLE product_sizes;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1;

-- Add brand column if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(100) DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2) DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;

-- Insert Sneaker Products
INSERT INTO products (name, description, price, original_price, image_url, category, brand, stock, is_new, is_active) VALUES
-- Nike
('Nike Air Max 270', 'รองเท้าวิ่ง Nike Air Max 270 พร้อมเทคโนโลยี Air Max ขนาดใหญ่ที่สุด', 5990.00, 6500.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Running', 'Nike', 25, TRUE, TRUE),
('Nike Air Force 1 Low', 'รองเท้า Nike Air Force 1 รุ่นคลาสสิคตลอดกาล สีขาวล้วน', 3990.00, NULL, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500', 'Lifestyle', 'Nike', 40, FALSE, TRUE),
('Nike Dunk Low Retro', 'Nike Dunk Low สไตล์ย้อนยุค วัสดุหนังพรีเมียม', 4290.00, 4990.00, 'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?w=500', 'Lifestyle', 'Nike', 30, TRUE, TRUE),
('Nike Air Jordan 1 High', 'รองเท้า Air Jordan 1 ระดับตำนาน สำหรับคนรักสนีกเกอร์', 6590.00, 7500.00, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500', 'Basketball', 'Nike', 15, TRUE, TRUE),
('Nike Zoom Pegasus 40', 'รองเท้าวิ่งระดับมืออาชีพ พร้อมระบบรองรับแรงกระแทก', 4990.00, NULL, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', 'Running', 'Nike', 20, FALSE, TRUE),

-- Adidas
('Adidas Ultraboost 23', 'รองเท้าวิ่ง Adidas Ultraboost รุ่นล่าสุด พร้อม Boost Technology', 6990.00, 7990.00, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500', 'Running', 'Adidas', 18, TRUE, TRUE),
('Adidas Superstar', 'รองเท้า Adidas Superstar สีขาวคลาสสิค ปลายหอยเป็นเอกลักษณ์', 3590.00, NULL, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500', 'Lifestyle', 'Adidas', 35, FALSE, TRUE),
('Adidas Stan Smith', 'รองเท้า Adidas Stan Smith สไตล์เรียบหรู สีขาว-เขียว', 3290.00, 3990.00, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500', 'Lifestyle', 'Adidas', 45, FALSE, TRUE),
('Adidas NMD R1', 'รองเท้า Adidas NMD สไตล์สตรีท พร้อม Boost Technology', 5490.00, 6290.00, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500', 'Lifestyle', 'Adidas', 22, TRUE, TRUE),

-- New Balance
('New Balance 574', 'รองเท้า New Balance 574 คลาสสิค สวมใส่สบายตลอดวัน', 3490.00, NULL, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'Lifestyle', 'New Balance', 28, FALSE, TRUE),
('New Balance 990v6', 'รองเท้าพรีเมียม Made in USA คุณภาพระดับสูงสุด', 8990.00, 9990.00, 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=500', 'Running', 'New Balance', 10, TRUE, TRUE),
('New Balance 550', 'รองเท้าบาสเก็ตบอลย้อนยุค กลับมาฮิตอีกครั้ง', 4590.00, 5290.00, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500', 'Basketball', 'New Balance', 32, TRUE, TRUE),

-- Converse
('Converse Chuck Taylor All Star', 'รองเท้า Converse รุ่นคลาสสิค สีดำ High Top', 2290.00, NULL, 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500', 'Lifestyle', 'Converse', 50, FALSE, TRUE),
('Converse Chuck 70', 'รองเท้า Converse Chuck 70 วัสดุพรีเมียม พื้นหนากว่า', 3490.00, 3990.00, 'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=500', 'Lifestyle', 'Converse', 25, FALSE, TRUE),

-- Vans
('Vans Old Skool', 'รองเท้า Vans Old Skool ลายข้างคลาสสิค สีดำ-ขาว', 2790.00, NULL, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', 'Lifestyle', 'Vans', 55, FALSE, TRUE),
('Vans Sk8-Hi', 'รองเท้า Vans Sk8-Hi หุ้มข้อ สำหรับสายสเก็ตบอร์ด', 3290.00, 3790.00, 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=500', 'Skateboard', 'Vans', 38, TRUE, TRUE);

-- Insert Product Sizes
INSERT INTO product_sizes (product_id, size, stock) VALUES
-- Nike Air Max 270
(1, 'US 7', 3), (1, 'US 7.5', 4), (1, 'US 8', 5), (1, 'US 8.5', 4), (1, 'US 9', 3), (1, 'US 9.5', 3), (1, 'US 10', 2), (1, 'US 10.5', 1),
-- Nike Air Force 1
(2, 'US 7', 5), (2, 'US 7.5', 6), (2, 'US 8', 8), (2, 'US 8.5', 7), (2, 'US 9', 5), (2, 'US 9.5', 4), (2, 'US 10', 3), (2, 'US 10.5', 2),
-- Nike Dunk Low
(3, 'US 7', 4), (3, 'US 7.5', 5), (3, 'US 8', 6), (3, 'US 8.5', 5), (3, 'US 9', 4), (3, 'US 9.5', 3), (3, 'US 10', 2), (3, 'US 10.5', 1),
-- Nike Air Jordan 1
(4, 'US 7', 2), (4, 'US 7.5', 2), (4, 'US 8', 3), (4, 'US 8.5', 3), (4, 'US 9', 2), (4, 'US 9.5', 2), (4, 'US 10', 1),
-- Nike Zoom Pegasus
(5, 'US 7', 3), (5, 'US 7.5', 3), (5, 'US 8', 4), (5, 'US 8.5', 4), (5, 'US 9', 3), (5, 'US 9.5', 2), (5, 'US 10', 1),
-- Adidas Ultraboost
(6, 'US 7', 2), (6, 'US 7.5', 3), (6, 'US 8', 4), (6, 'US 8.5', 3), (6, 'US 9', 3), (6, 'US 9.5', 2), (6, 'US 10', 1),
-- Adidas Superstar
(7, 'US 7', 5), (7, 'US 7.5', 5), (7, 'US 8', 6), (7, 'US 8.5', 6), (7, 'US 9', 5), (7, 'US 9.5', 4), (7, 'US 10', 4),
-- Adidas Stan Smith
(8, 'US 7', 6), (8, 'US 7.5', 7), (8, 'US 8', 8), (8, 'US 8.5', 8), (8, 'US 9', 6), (8, 'US 9.5', 5), (8, 'US 10', 5),
-- Adidas NMD R1
(9, 'US 7', 3), (9, 'US 7.5', 3), (9, 'US 8', 4), (9, 'US 8.5', 4), (9, 'US 9', 3), (9, 'US 9.5', 3), (9, 'US 10', 2),
-- New Balance 574
(10, 'US 7', 4), (10, 'US 7.5', 4), (10, 'US 8', 5), (10, 'US 8.5', 5), (10, 'US 9', 4), (10, 'US 9.5', 3), (10, 'US 10', 3),
-- New Balance 990v6
(11, 'US 7', 1), (11, 'US 7.5', 2), (11, 'US 8', 2), (11, 'US 8.5', 2), (11, 'US 9', 1), (11, 'US 9.5', 1), (11, 'US 10', 1),
-- New Balance 550
(12, 'US 7', 4), (12, 'US 7.5', 5), (12, 'US 8', 6), (12, 'US 8.5', 6), (12, 'US 9', 5), (12, 'US 9.5', 3), (12, 'US 10', 3),
-- Converse Chuck Taylor
(13, 'US 7', 7), (13, 'US 7.5', 7), (13, 'US 8', 8), (13, 'US 8.5', 8), (13, 'US 9', 7), (13, 'US 9.5', 6), (13, 'US 10', 7),
-- Converse Chuck 70
(14, 'US 7', 3), (14, 'US 7.5', 4), (14, 'US 8', 5), (14, 'US 8.5', 4), (14, 'US 9', 4), (14, 'US 9.5', 3), (14, 'US 10', 2),
-- Vans Old Skool
(15, 'US 7', 7), (15, 'US 7.5', 8), (15, 'US 8', 10), (15, 'US 8.5', 10), (15, 'US 9', 8), (15, 'US 9.5', 6), (15, 'US 10', 6),
-- Vans Sk8-Hi
(16, 'US 7', 5), (16, 'US 7.5', 5), (16, 'US 8', 7), (16, 'US 8.5', 7), (16, 'US 9', 5), (16, 'US 9.5', 4), (16, 'US 10', 5);

-- Update orders with sneaker data
UPDATE orders SET status = 'pending' WHERE id = 1;
DELETE FROM order_items;

-- Verify
SELECT 'Products updated to sneakers!' AS message;
SELECT COUNT(*) AS total_products FROM products;
SELECT brand, COUNT(*) as count FROM products GROUP BY brand;
