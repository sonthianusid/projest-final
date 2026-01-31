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
        const { name, description, price, image_url, category, stock } = await request.json();

        if (!name || !price) {
            return NextResponse.json(
                { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        const result = await query(
            'INSERT INTO products (name, description, price, image_url, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description || null, price, image_url || null, category || null, stock || 0]
        );

        return NextResponse.json({
            success: true,
            message: 'เพิ่มสินค้าสำเร็จ',
        });

    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' },
            { status: 500 }
        );
    }
}
