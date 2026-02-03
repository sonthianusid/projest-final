import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );

        const unreadResult: any = await query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        const unreadCount = unreadResult[0]?.count || 0;

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, userId } = await request.json();

        if (id) {
            // Mark single as read
            await query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
        } else if (userId) {
            // Mark all as read
            await query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}
