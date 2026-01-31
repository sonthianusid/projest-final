import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        // Find user
        const user = await queryOne<any>(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Check password - support both plain text (for testing) and hashed
        let isPasswordValid = false;

        // Check if password is hashed (starts with $2a$ or $2b$ for bcrypt)
        if (user.password && user.password.startsWith('$2')) {
            // Bcrypt hashed password
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Plain text password (for development/testing)
            isPasswordValid = password === user.password;
        }

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
            { status: 500 }
        );
    }
}
