import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const users = await query(
            "SELECT id, username, name, email, phone, role, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC"
        );

        return NextResponse.json({
            success: true,
            users
        });

    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
            { status: 500 }
        );
    }
}
export async function POST(request: NextRequest) {
    try {
        const { username, name, email, phone, role, password } = await request.json();

        // Check if username or email already exists
        const existing: any = await query(
            "SELECT id FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { success: false, message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' },
                { status: 400 }
            );
        }

        // Simple hash (In a real app, use bcrypt)
        const passwordHash = password; // Should be hashed in production

        await query(
            "INSERT INTO users (username, name, email, phone, role, password, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            [username, name, email, phone, role, passwordHash]
        );

        return NextResponse.json({
            success: true,
            message: 'เพิ่มผู้ใช้งานสำเร็จ'
        });

    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน' },
            { status: 500 }
        );
    }
}
