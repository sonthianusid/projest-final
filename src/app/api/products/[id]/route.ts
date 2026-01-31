import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await queryOne(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (!product) {
            return NextResponse.json(
                { success: false, message: 'ไม่พบสินค้า' },
                { status: 404 }
            );
        }



        // Fetch additional images if the table exists
        let images: any[] = [];
        try {
            images = await query(
                'SELECT image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
                [id]
            );
        } catch (e) {
            console.warn('Could not fetch product images (table might not exist yet):', e);
        }

        // Attach images to product object
        const productWithImages = {
            ...product,
            images: images.length > 0 ? images.map(img => img.image_url) : []
        };

        return NextResponse.json({
            success: true,
            product: productWithImages
        });

    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { name, description, price, image_url, category, stock, is_active } = await request.json();

        await query(
            'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ?, stock = ?, is_active = ? WHERE id = ?',
            [name, description, price, image_url, category, stock, is_active ?? true, id]
        );

        return NextResponse.json({
            success: true,
            message: 'อัพเดทสินค้าสำเร็จ'
        });

    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการอัพเดทสินค้า' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await query(
            'DELETE FROM products WHERE id = ?',
            [id]
        );

        return NextResponse.json({
            success: true,
            message: 'ลบสินค้าสำเร็จ'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการลบสินค้า' },
            { status: 500 }
        );
    }
}
