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

        // Check balance first
        const userCheck: any = await query(
            'SELECT credit_balance FROM users WHERE id = ?',
            [userId]
        );

        if (!userCheck || userCheck.length === 0) {
            return NextResponse.json({ success: false, message: 'ไม่พบผู้ใช้' }, { status: 404 });
        }

        if (userCheck[0].credit_balance < amount) {
            return NextResponse.json({ success: false, message: 'ยอดเงินไม่พอ' }, { status: 400 });
        }

        // Deduct
        await query(
            'UPDATE users SET credit_balance = credit_balance - ? WHERE id = ?',
            [amount, userId]
        );

        // Get updated balance
        const user: any = await query(
            'SELECT credit_balance FROM users WHERE id = ?',
            [userId]
        );

        return NextResponse.json({
            success: true,
            newBalance: Number(user[0].credit_balance)
        });

    } catch (error) {
        console.error('Deduct error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาด' },
            { status: 500 }
        );
    }
}
