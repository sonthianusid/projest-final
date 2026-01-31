
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually load .env.local
try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.resolve(__dirname, '../.env.local');

    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.warn('Failed to load .env.local manually:', e);
}

import { query, closePool } from '../src/lib/db';

async function listProducts() {
    try {
        const products = await query('SELECT id, name FROM products');
        console.log(JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await closePool();
    }
}

listProducts();
