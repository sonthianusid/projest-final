import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const products = await query(
            'SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC'
        );

        return NextResponse.json({
            success: true,
            products
        });

    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, description, price, image_url, category, stock, brand, original_price, is_new, sizes } = await request.json();

        if (!name || !price) {
            return NextResponse.json(
                { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        // Calculate total stock from sizes if provided
        let totalStock = stock || 0;
        if (sizes && Array.isArray(sizes)) {
            totalStock = sizes.reduce((sum: number, s: { size: string; stock: number }) => sum + (Number(s.stock) || 0), 0);
        }

        const result: any = await query(
            'INSERT INTO products (name, description, price, image_url, category, stock, brand, original_price, is_new) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description || null, price, image_url || null, category || null, totalStock, brand || null, original_price || null, is_new ?? true]
        );

        const productId = result.insertId;

        // Insert sizes if provided
        if (sizes && Array.isArray(sizes) && sizes.length > 0) {
            for (const sizeItem of sizes) {
                if (sizeItem.size && Number(sizeItem.stock) > 0) {
                    await query(
                        'INSERT INTO product_sizes (product_id, size_name, stock) VALUES (?, ?, ?)',
                        [productId, sizeItem.size, Number(sizeItem.stock) || 0]
                    );
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'เพิ่มสินค้าสำเร็จ',
            productId
        });

    } catch (error: any) {
        console.error('Add product error:', error);
        return NextResponse.json(
            {
                success: false,
                message: `เกิดข้อผิดพลาดในการเพิ่มสินค้า: ${error.message || 'Unknown error'}`,
                code: error.code
            },
            { status: 500 }
        );
    }
}

