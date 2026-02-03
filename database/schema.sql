-- ===================================
-- SonthiShop Database Schema
-- ===================================

-- Create Database
CREATE DATABASE IF NOT EXISTS sonthishop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sonthishop;

-- ===================================
-- Table: users
-- ===================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: products
-- ===================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: orders
-- ===================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: order_items
-- ===================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: cart
-- ===================================
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Table: notifications
-- ===================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- Insert Sample Data
-- ===================================

-- Insert Admin User (password: admin123)
INSERT INTO users (username, password, name, email, role) VALUES
('admin', '$2a$10$XQKYhQr7lFJWxnJZGVvU7eqKHd5C7KqA5F9w8gMxJ5K2yHUvZJ8zm', 'ผู้ดูแลระบบ', 'admin@sonthishop.com', 'admin');

-- Insert Sample User (password: user123)
INSERT INTO users (username, password, name, email, phone, address, role) VALUES
('user01', '$2a$10$kQCXF8pQlX3KpYgH5J5J5eXQKYhQr7lFJWxnJZGVvU7eqKHd5C7Kq', 'ผู้ใช้ทดสอบ', 'user@example.com', '0812345678', '123 ถนนทดสอบ กรุงเทพฯ 10110', 'user');

-- Insert Sample Products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('MacBook Pro 14"', 'MacBook Pro 14 นิ้ว ชิป M3 Pro RAM 18GB SSD 512GB', 89900.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'Laptop', 15),
('iPhone 15 Pro Max', 'iPhone 15 Pro Max 256GB Natural Titanium', 48900.00, 'https://images.unsplash.com/photo-1592286927505-8b3d1a7a9d05?w=500', 'Smartphone', 25),
('iPad Air', 'iPad Air 11 นิ้ว Wi-Fi 128GB', 23900.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Tablet', 20),
('AirPods Pro', 'AirPods Pro (รุ่นที่ 2) พร้อม USB-C', 8990.00, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500', 'Audio', 50),
('Apple Watch Series 9', 'Apple Watch Series 9 GPS 41mm', 13900.00, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500', 'Wearable', 30),
('Magic Keyboard', 'Magic Keyboard สำหรับ iPad Pro 12.9"', 12900.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 'Accessory', 10),
('HomePod mini', 'HomePod mini ลำโพงอัจฉริยะ', 3990.00, 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500', 'Audio', 40),
('AirTag 4 Pack', 'AirTag แพ็ค 4 ชิ้น', 3890.00, 'https://images.unsplash.com/photo-1621959900490-1f56e8239e8d?w=500', 'Accessory', 60);

-- Insert Sample Orders
INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address) VALUES
(2, 'ORD-2026-0001', 89900.00, 'delivered', 'credit_card', '123 ถนนทดสอบ กรุงเทพฯ 10110'),
(2, 'ORD-2026-0002', 57880.00, 'processing', 'bank_transfer', '123 ถนนทดสอบ กรุงเทพฯ 10110');

-- Insert Sample Order Items
INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES
(1, 1, 'MacBook Pro 14"', 1, 89900.00, 89900.00),
(2, 2, 'iPhone 15 Pro Max', 1, 48900.00, 48900.00),
(2, 4, 'AirPods Pro', 1, 8990.00, 8990.00);

-- ===================================
-- Views for Analytics
-- ===================================

-- Total Sales View
CREATE OR REPLACE VIEW sales_summary AS
SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE status != 'cancelled';

-- Product Sales View
CREATE OR REPLACE VIEW product_sales AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    p.stock,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.subtotal), 0) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
GROUP BY p.id, p.name, p.category, p.price, p.stock;

-- ===================================
-- Stored Procedures
-- ===================================

DELIMITER //

-- Procedure to create new order
CREATE PROCEDURE create_order(
    IN p_user_id INT,
    IN p_order_number VARCHAR(50),
    IN p_total_amount DECIMAL(10,2),
    IN p_payment_method VARCHAR(50),
    IN p_shipping_address TEXT
)
BEGIN
    INSERT INTO orders (user_id, order_number, total_amount, payment_method, shipping_address)
    VALUES (p_user_id, p_order_number, p_total_amount, p_payment_method, p_shipping_address);
    SELECT LAST_INSERT_ID() as order_id;
END//

-- Procedure to update product stock
CREATE PROCEDURE update_product_stock(
    IN p_product_id INT,
    IN p_quantity INT
)
BEGIN
    UPDATE products 
    SET stock = stock - p_quantity
    WHERE id = p_product_id AND stock >= p_quantity;
    
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock or product not found';
    END IF;
END//

DELIMITER ;

-- ===================================
-- Grants (if needed)
-- ===================================
-- GRANT ALL PRIVILEGES ON sonthishop.* TO 'your_user'@'localhost';
-- FLUSH PRIVILEGES;
