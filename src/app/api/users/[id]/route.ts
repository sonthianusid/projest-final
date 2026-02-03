import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const users: any = await query(
            'SELECT id, username, name, email, phone, role, address, credit_balance, created_at FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { success: false, message: 'ไม่พบผู้ใช้งาน' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
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

        // Prevent deleting self or admin if needed logic here, mostly handled by WHERE id = ? AND role != 'admin' ideally
        // But for this simple app we trust the admin.

        await query('DELETE FROM users WHERE id = ?', [id]);

        return NextResponse.json({
            success: true,
            message: 'ลบผู้ใช้สำเร็จ'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการลบผู้ใช้' },
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

        const updateFields = [];
        const updateValues = [];

        if (body.name) {
            updateFields.push('name = ?');
            updateValues.push(body.name);
        }
        if (body.email) {
            updateFields.push('email = ?');
            updateValues.push(body.email);
        }
        if (body.phone) {
            updateFields.push('phone = ?');
            updateValues.push(body.phone);
        }
        if (body.username) {
            updateFields.push('username = ?');
            updateValues.push(body.username);
        }
        if (body.role) {
            updateFields.push('role = ?');
            updateValues.push(body.role);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { success: false, message: 'ไม่มีข้อมูลให้อัพเดท' },
                { status: 400 }
            );
        }

        updateValues.push(id);

        await query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        return NextResponse.json({
            success: true,
            message: 'แก้ไขข้อมูลผู้ใช้สำเร็จ'
        });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการแก้ไขผู้ใช้' },
            { status: 500 }
        );
    }
}
