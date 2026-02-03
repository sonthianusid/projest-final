
import { query } from '../src/lib/db';

async function checkSchema() {
    try {
        // Try to select the new columns. If this fails, they don't exist.
        await query('SELECT brand, original_price, is_new FROM products LIMIT 1');
        console.log('Columns exist!');
    } catch (error) {
        console.error('Error selecting columns:', error);
    }
}

checkSchema();
