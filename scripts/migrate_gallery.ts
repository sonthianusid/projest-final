
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually load .env.local
try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.resolve(__dirname, '../.env.local');

    if (fs.existsSync(envPath)) {
        console.log('Loading .env.local...');
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.warn('Failed to load .env.local manually:', e);
}

import { query, closePool } from '../src/lib/db';

async function migrate() {
    try {
        console.log('Creating product_images table...');
        await query(`
            CREATE TABLE IF NOT EXISTS product_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                alt_text VARCHAR(255),
                display_order INT DEFAULT 0,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Table created.');

        // Insert initial data for Panda (Product ID usually around 1-5, need to verify, but I'll assume based on context or fetch first)
        // Let's find the Panda product first
        const panda = await query('SELECT id FROM products WHERE name LIKE "%Panda%" LIMIT 1');
        if (panda.length > 0) {
            const pandaId = panda[0].id;
            console.log(`Found Panda product ID: ${pandaId}`);

            // Clear existing images for safety
            await query('DELETE FROM product_images WHERE product_id = ?', [pandaId]);

            await query('INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES ?', [[
                [pandaId, '/images/panda-left.png', 'Side View (Left)', 1],
                [pandaId, '/images/panda-right.png', 'Side View (Right)', 2]
            ]]);
            console.log('✅ Panda images inserted.');
        } else {
            console.log('⚠️ Panda product not found.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await closePool();
    }
}

migrate();
