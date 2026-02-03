-- ===================================
-- Cleanup Non-Shoe Products (with dependencies)
-- ===================================

USE sonthishop;

-- 1. Remove from Cart
DELETE FROM cart 
WHERE product_id IN (
    SELECT id FROM products 
    WHERE category NOT IN ('running', 'basketball', 'lifestyle')
);

-- 2. Remove from Order Items
DELETE FROM order_items 
WHERE product_id IN (
    SELECT id FROM products 
    WHERE category NOT IN ('running', 'basketball', 'lifestyle')
);

-- 3. Now safe to delete Products
DELETE FROM products 
WHERE category NOT IN ('running', 'basketball', 'lifestyle');

-- Verify remaining products
SELECT id, name, category FROM products;
