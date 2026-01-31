
-- 1. Create table
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 2. Clean up old/duplicate images for Panda
DELETE FROM product_images 
WHERE product_id IN (SELECT id FROM products WHERE name LIKE '%Panda%');

-- 3. Insert images for Panda using Subquery to get ID
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT id, '/images/panda-left.png', 'Side View (Left)', 1 
FROM products WHERE name LIKE '%Panda%';

INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT id, '/images/panda-right.png', 'Side View (Right)', 2 
FROM products WHERE name LIKE '%Panda%';

-- Add image for Adidas Forum Low (ID: 11)
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
VALUES (11, '/images/adidas-forum-low-detail.png', 'Detail View', 1);

-- Add image for Adidas Forum Low (ID: 11)
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
VALUES (11, '/images/adidas-forum-low-detail.png', 'Detail View', 1);

-- Add image for Adidas Forum Low (ID: 11)
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
VALUES (11, '/images/adidas-forum-low-detail.png', 'Detail View', 1);

-- Add image for Adidas Forum Low (ID: 11)
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
VALUES (11, '/images/adidas-forum-low-detail.png', 'Detail View', 1);

-- For debugging
SELECT * FROM product_images;
