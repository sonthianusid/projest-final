-- ===================================
-- Update Products Table for Frontend
-- ===================================
-- รันไฟล์นี้ใน phpMyAdmin หรือ MySQL Console

USE sonthishop;

-- เพิ่ม columns ใหม่
ALTER TABLE products 
  MODIFY COLUMN image_url TEXT,
  ADD COLUMN IF NOT EXISTS brand VARCHAR(50) DEFAULT 'nike',
  ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2) NULL,
  ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;

-- อัพเดท original_price ให้เป็น price + 20%
UPDATE products SET original_price = price * 1.2 WHERE original_price IS NULL;

-- ลบข้อมูลสินค้าเก่า (optional - ถ้าต้องการเริ่มใหม่)
-- TRUNCATE TABLE products;

-- เพิ่มสินค้ารองเท้าใหม่ (รองเท้าจากไฟล์ hardcode)
INSERT INTO products (name, description, price, original_price, image_url, category, brand, stock, is_new, is_active) VALUES
('Nike Air Max 270', 'รองเท้า Nike Air Max 270 มอบความนุ่มสบายที่เหนือกว่าด้วยส่วน Max Air ขนาดใหญ่ที่สุดเท่าที่เคยมีมา', 5990.00, 7990.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'running', 'nike', 50, TRUE, TRUE),
('Nike Air Jordan 1 Retro', 'ตำนานที่ยังมีลมหายใจ Air Jordan 1 Retro นำเสนอสไตล์คลาสสิกที่ไม่มีวันตกยุค', 7990.00, 9990.00, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500', 'basketball', 'nike', 30, FALSE, TRUE),
('Nike Air Force 1 Low', 'ไอคอนแห่งวงการสตรีทแฟชั่น Nike Air Force 1 Low ยังคงความคลาสสิกด้วยดีไซน์ที่เรียบง่ายแต่โดดเด่น', 4290.00, 5290.00, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500', 'lifestyle', 'nike', 45, FALSE, TRUE),
('Nike Dunk Low Panda', 'รองเท้ายอดฮิตแห่งยุค Nike Dunk Low ในโทนสีขาวดำ "Panda" ที่แมตช์ได้กับทุกชุด', 5490.00, 6990.00, 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500', 'lifestyle', 'nike', 35, TRUE, TRUE),
('Nike ZoomX Vaporfly', 'รองเท้าวิ่งสายทำความเร็ว Nike ZoomX Vaporfly มาพร้อมโฟม ZoomX ที่ดีดตัวได้ดีที่สุด', 8990.00, 10990.00, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500', 'running', 'nike', 20, TRUE, TRUE),
('Adidas Ultraboost 22', 'สัมผัสประสบการณ์การวิ่งที่นุ่มนวลที่สุดกับ Adidas Ultraboost 22 ด้วยเทคโนโลยี Boost', 6490.00, 8490.00, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 'running', 'adidas', 40, FALSE, TRUE),
('Adidas NMD R1', 'การผสมผสานระหว่างสไตล์เรโทรและเทคโนโลยีสมัยใหม่ Adidas NMD R1', 5490.00, 6990.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', 'lifestyle', 'adidas', 35, FALSE, TRUE),
('Adidas Stan Smith', 'ความเรียบง่ายที่ครองใจคนทั่วโลกมากว่า 50 ปี Adidas Stan Smith คือรองเท้าเทนนิสสุดคลาสสิก', 3990.00, 4990.00, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500', 'lifestyle', 'adidas', 60, FALSE, TRUE),
('Adidas Yeezy Boost 350', 'ผลงานการออกแบบระดับไอคอน Adidas Yeezy Boost 350 นำเสนอดีไซน์ที่ล้ำสมัย', 12990.00, 15990.00, 'https://images.unsplash.com/photo-1491553895911-0055uj8hb0aa?w=500', 'lifestyle', 'adidas', 15, TRUE, TRUE),
('Adidas Superstar', 'ต้นกำเนิดจากสนามบาสเก็ตบอลสู่ตำนานฮิปฮอป Adidas Superstar โดดเด่นด้วยหัวรองเท้ารูปเปลือกหอย', 3490.00, 4490.00, 'https://images.unsplash.com/photo-1603787081207-362bcef7c144?w=500', 'lifestyle', 'adidas', 55, FALSE, TRUE),
('Adidas Forum Low', 'สไตล์บาสเก็ตบอลยุค 80 กลับมาอีกครั้ง Adidas Forum Low นำเสนอดีไซน์ข้อต่ำพร้อมสายรัดข้อเท้า', 4290.00, 5290.00, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500', 'basketball', 'adidas', 25, TRUE, TRUE),
('Nike Blazer Mid', 'รองเท้าบาสเก็ตบอลรุ่นบุกเบิกของ Nike Blazer Mid 77 Vintage ยังคงเสน่ห์ความคลาสสิก', 4790.00, 5790.00, 'https://images.unsplash.com/photo-1612902456551-e1e5e5c5c521?w=500', 'lifestyle', 'nike', 30, FALSE, TRUE)
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  original_price = VALUES(original_price),
  image_url = VALUES(image_url),
  category = VALUES(category),
  brand = VALUES(brand);

-- ตรวจสอบข้อมูล
SELECT id, name, brand, category, price, original_price, is_new FROM products;
