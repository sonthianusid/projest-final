import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const statusFilter = searchParams.get('status');
        const timeFilter = searchParams.get('filter');

        let sql = `SELECT 
                o.id,
                o.order_number,
                o.total_amount,
                o.status,
                o.created_at,
                u.name as customer_name,
                (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE 1=1`;

        const params: any[] = [];

        if (userId) {
            sql += ` AND o.user_id = ?`;
            params.push(userId);
        }

        if (statusFilter && statusFilter !== 'all') {
            sql += ` AND o.status = ?`;
            params.push(statusFilter);
        }

        if (timeFilter && timeFilter !== 'all') {
            switch (timeFilter) {
                case 'today':
                    sql += " AND DATE(o.created_at) = CURDATE()";
                    break;
                case 'week':
                    sql += " AND YEARWEEK(o.created_at, 1) = YEARWEEK(CURDATE(), 1)";
                    break;
                case 'month':
                    sql += " AND MONTH(o.created_at) = MONTH(CURDATE()) AND YEAR(o.created_at) = YEAR(CURDATE())";
                    break;
                case 'year':
                    sql += " AND YEAR(o.created_at) = YEAR(CURDATE())";
                    break;
            }
        }

        sql += ` ORDER BY o.created_at DESC`;

        const orders = await query(sql, params);

        return NextResponse.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, items, totalAmount, paymentMethod, address } = body;

        if (!userId || !items || items.length === 0 || !totalAmount || !address) {
            return NextResponse.json(
                { success: false, message: 'ข้อมูลไม่ครบถ้วน' },
                { status: 400 }
            );
        }

        // 1. If Store Credit, user verification & deduction
        if (paymentMethod === 'store_credit') {
            const userCheck: any = await query('SELECT credit_balance FROM users WHERE id = ?', [userId]);

            if (userCheck.length === 0) {
                return NextResponse.json({ success: false, message: 'ไม่พบผู้ใช้งาน' }, { status: 404 });
            }

            const currentBalance = Number(userCheck[0].credit_balance);
            if (currentBalance < totalAmount) {
                return NextResponse.json({ success: false, message: 'ยอดเงินในกระเป๋าไม่เพียงพอ' }, { status: 400 });
            }

            // Deduct Balance
            await query('UPDATE users SET credit_balance = credit_balance - ? WHERE id = ?', [totalAmount, userId]);
        }

        // 1.5 Check Product Stock (including size-specific stock)
        for (const item of items) {
            if (item.selectedSize) {
                // Check size-specific stock
                const sizeStock: any = await queryOne(
                    'SELECT stock FROM product_sizes WHERE product_id = ? AND size_name = ?',
                    [item.id, item.selectedSize]
                );
                if (!sizeStock || sizeStock.stock < item.quantity) {
                    return NextResponse.json(
                        { success: false, message: `ไซส์ ${item.selectedSize} ของ ${item.name} มีสต็อกไม่เพียงพอ` },
                        { status: 400 }
                    );
                }
            } else {
                // Fallback to total product stock
                const product: any = await queryOne('SELECT stock FROM products WHERE id = ?', [item.id]);
                if (!product || product.stock < item.quantity) {
                    return NextResponse.json(
                        { success: false, message: `สินค้า ${item.name} มีสต็อกไม่เพียงพอ` },
                        { status: 400 }
                    );
                }
            }
        }

        // 2. Create Order
        const orderNumber = `ORD-${Date.now()}`;
        const status = paymentMethod === 'store_credit' || paymentMethod === 'truemoney' ? 'processing' : 'pending';

        const orderResult: any = await query(
            'INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, shipping_address) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, orderNumber, totalAmount, status, paymentMethod, address]
        );

        const orderId = orderResult.insertId;

        // 3. Insert Order Items & Deduct Stock
        for (const item of items) {
            // Include selectedSize in order_items if available
            await query(
                'INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.id, item.selectedSize ? `${item.name} (${item.selectedSize})` : item.name, item.quantity, item.price, item.price * item.quantity]
            );

            // Deduct Stock from product_sizes if selectedSize is provided
            if (item.selectedSize) {
                await query(
                    'UPDATE product_sizes SET stock = stock - ? WHERE product_id = ? AND size_name = ?',
                    [item.quantity, item.id, item.selectedSize]
                );
            }

            // Always deduct from total products stock too
            await query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
        }

        // 3.5 Create Notification for User
        await query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, 'สั่งซื้อสำเร็จ!', `รายการ ${orderNumber} ได้รับการยืนยันแล้ว`, 'order']
        );

        // 4. Get Updated Balance (if applicable)
        let newBalance = 0;
        if (paymentMethod === 'store_credit') {
            const updatedUser: any = await query('SELECT credit_balance FROM users WHERE id = ?', [userId]);
            newBalance = Number(updatedUser[0].credit_balance);
        }

        return NextResponse.json({
            success: true,
            message: 'สั่งซื้อสำเร็จ',
            orderId,
            newBalance: paymentMethod === 'store_credit' ? newBalance : undefined
        });

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการสั่งซื้อ' },
            { status: 500 }
        );
    }
}
