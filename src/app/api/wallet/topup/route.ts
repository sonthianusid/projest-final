import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { userId, amount } = await request.json();

        if (!userId || !amount || amount <= 0) {
            return NextResponse.json(
                { success: false, message: 'ข้อมูลไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // Update balance
        const result: any = await query(
            'UPDATE users SET credit_balance = credit_balance + ? WHERE id = ?',
            [amount, userId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { success: false, message: 'ไม่พบผู้ใช้' },
                { status: 404 }
            );
        }

        // Get updated balance
        const user: any = await query(
            'SELECT credit_balance FROM users WHERE id = ?',
            [userId]
        );

        return NextResponse.json({
            success: true,
            message: 'เติมเงินสำเร็จ',
            newBalance: Number(user[0].credit_balance)
        });

    } catch (error) {
        console.error('Topup error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการเติมเงิน' },
            { status: 500 }
        );
    }
}
