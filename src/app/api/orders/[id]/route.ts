import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const orderId = params.id;
        const isOrderNumber = orderId.startsWith('ORD-');

        // Fetch Order Details
        const orderResult: any = await query(
            `SELECT 
                o.id,
                o.order_number,
                o.total_amount,
                o.status,
                o.payment_method,
                o.shipping_address,
                o.created_at,
                u.name as customer_name,
                u.email as customer_email,
                u.phone as customer_phone
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             WHERE ${isOrderNumber ? 'o.order_number = ?' : 'o.id = ?'}`,
            [orderId]
        );

        if (orderResult.length === 0) {
            return NextResponse.json({ success: false, message: 'ไม่พบคำสั่งซื้อ' }, { status: 404 });
        }

        const order = orderResult[0];

        // Fetch Order Items
        const itemsResult: any = await query(
            `SELECT 
                oi.id,
                oi.product_name,
                oi.quantity,
                oi.price,
                oi.subtotal,
                p.image_url
             FROM order_items oi
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
        );

        return NextResponse.json({
            success: true,
            order: {
                ...order,
                items: itemsResult
            }
        });

    } catch (error) {
        console.error('Get order details error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' },
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
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json(
                { success: false, message: 'กรุณาระบุสถานะ' },
                { status: 400 }
            );
        }

        // Get user_id before update to send notification
        const orderData: any = await query('SELECT user_id, order_number FROM orders WHERE id = ?', [id]);

        await query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        if (orderData.length > 0) {
            const { user_id, order_number } = orderData[0];
            let notifTitle = 'อัปเดตสถานะคำสั่งซื้อ';

            const statusMap: Record<string, string> = {
                'pending': 'รอดำเนินการ',
                'processing': 'กำลังจัดเตรียม',
                'shipped': 'จัดส่งแล้ว',
                'delivered': 'จัดส่งสำเร็จ',
                'cancelled': 'ยกเลิกแล้ว'
            };

            const thaiStatus = statusMap[status?.toLowerCase()] || status;
            let notifMessage = `คำสั่งซื้อ ${order_number} ของคุณเปลี่ยนเป็นสถานะ: ${thaiStatus}`;

            if (status === 'delivered') {
                notifTitle = 'สินค้าจัดส่งสำเร็จ';
                notifMessage = `คำสั่งซื้อ ${order_number} จัดส่งสำเร็จแล้ว ขอบคุณที่ใช้บริการ SonthiShop ครับ`;
            }

            await query(
                'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
                [user_id, notifTitle, notifMessage, 'order']
            );
        }

        return NextResponse.json({
            success: true,
            message: 'อัพเดทสถานะสำเร็จ'
        });

    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ' },
            { status: 500 }
        );
    }
}
