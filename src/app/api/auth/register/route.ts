import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { username, password, name, email, phone, address } = await request.json();

        if (!username || !password || !name || !address) {
            return NextResponse.json(
                { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน (รวมถึงที่อยู่)' },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return NextResponse.json(
                { success: false, message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await query(
            'INSERT INTO users (username, password, name, email, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, name, email || null, phone || null, address || null, 'user']
        );

        return NextResponse.json({
            success: true,
            message: 'สมัครสมาชิกสำเร็จ',
        });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
            { status: 500 }
        );
    }
}
