import { query, closePool } from '../src/lib/db';

async function updateProductsSchema() {
    try {
        console.log('Updating products table schema...');

        // Add brand column
        try {
            await query(`ALTER TABLE products ADD COLUMN brand VARCHAR(100) AFTER name`);
            console.log('✅ Added column: brand');
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ Column brand already exists');
            else console.error('❌ Failed to add brand:', e);
        }

        // Add original_price column
        try {
            await query(`ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2) AFTER price`);
            console.log('✅ Added column: original_price');
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ Column original_price already exists');
            else console.error('❌ Failed to add original_price:', e);
        }

        // Add is_new column
        try {
            await query(`ALTER TABLE products ADD COLUMN is_new BOOLEAN DEFAULT TRUE AFTER stock`);
            console.log('✅ Added column: is_new');
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ Column is_new already exists');
            else console.error('❌ Failed to add is_new:', e);
        }

        console.log('🎉 Schema update completed!');
    } catch (error) {
        console.error('❌ Schema update failed:', error);
    } finally {
        await closePool();
    }
}

updateProductsSchema();
