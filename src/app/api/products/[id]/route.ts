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

        // Fetch sizes
        let sizes: any[] = [];
        try {
            sizes = await query(
                'SELECT size_name, stock FROM product_sizes WHERE product_id = ? ORDER BY size_name ASC',
                [id]
            );
        } catch (e) {
            console.warn('Could not fetch product sizes (table might not exist yet):', e);
        }

        // Attach images and sizes to product object
        const productWithData = {
            ...product,
            images: images.length > 0 ? images.map(img => img.image_url) : [],
            sizes: sizes.map(s => ({ size: s.size_name, stock: s.stock }))
        };

        return NextResponse.json({
            success: true,
            product: productWithData
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
        const body = await request.json();
        const { name, description, price, image_url, category, stock, is_active, brand, original_price, is_new, sizes } = body;

        // Calculate total stock from sizes if provided
        let totalStock = stock ?? 0;
        if (sizes && Array.isArray(sizes)) {
            totalStock = sizes.reduce((sum: number, s: { size: string; stock: number }) => sum + (Number(s.stock) || 0), 0);
        }

        console.log('Update Product Payload:', {
            id, name, description, price, image_url, category, stock: totalStock, is_active, brand, original_price, is_new, sizes
        });

        await query(
            'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ?, stock = ?, is_active = ?, brand = ?, original_price = ?, is_new = ? WHERE id = ?',
            [
                name ?? null,
                description ?? '',
                price ?? 0,
                image_url ?? '',
                category ?? null,
                totalStock,
                is_active ?? true,
                brand ?? '',
                original_price ?? null,
                is_new ?? true,
                id
            ]
        );

        // Update sizes: delete old ones and insert new ones
        if (sizes && Array.isArray(sizes)) {
            // Delete existing sizes
            await query('DELETE FROM product_sizes WHERE product_id = ?', [id]);

            // Insert new sizes
            for (const sizeItem of sizes) {
                if (sizeItem.size && Number(sizeItem.stock) > 0) {
                    await query(
                        'INSERT INTO product_sizes (product_id, size_name, stock) VALUES (?, ?, ?)',
                        [id, sizeItem.size, Number(sizeItem.stock) || 0]
                    );
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'อัพเดทสินค้าสำเร็จ'
        });

    } catch (error: any) {
        console.error('Update product error details:', error);
        return NextResponse.json(
            {
                success: false,
                message: `เกิดข้อผิดพลาด: ${error.message || 'Unknown error'}`,
                code: error.code // Return SQL error code if available
            },
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
