import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: NextRequest) {
    try {
        const { id, name, email, phone, address } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ไม่พบข้อมูลผู้ใช้ (Missing ID)' },
                { status: 400 }
            );
        }

        // Optional: Check if user exists (omitted for brevity, update returns affectedRows)

        // Update user
        // Note: Not updating creditBalance here for security, mostly profile data
        const result: any = await query(
            'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
            [name, email, phone, address, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { success: false, message: 'ไม่พบผู้ใช้ที่ต้องการแก้ไข' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'อัปเดตข้อมูลสำเร็จ',
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
            { status: 500 }
        );
    }
}
