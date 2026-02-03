import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'กรุณากรอกชื่อ อีเมล และข้อความ' },
                { status: 400 }
            );
        }

        await query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || 'No Subject', message]
        );

        return NextResponse.json({
            success: true,
            message: 'ส่งข้อความเรียบร้อยแล้ว ขอบคุณที่ติดต่อเรา!'
        });

    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการส่งข้อความ' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Basic protection (ideally check for admin role here)
    try {
        const messages = await query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        return NextResponse.json({ success: true, messages });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch messages' }, { status: 500 });
    }
}
