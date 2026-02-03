import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const favorites = await query(
            'SELECT product_id FROM user_favorites WHERE user_id = ?',
            [userId]
        );

        return NextResponse.json({
            success: true,
            favorites: favorites.map((f: any) => f.product_id)
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, productId } = await request.json();

        if (!userId || !productId) {
            return NextResponse.json({ success: false, message: 'Bad Request' }, { status: 400 });
        }

        await query(
            'INSERT IGNORE INTO user_favorites (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId, productId } = await request.json();

        if (!userId || !productId) {
            return NextResponse.json({ success: false, message: 'Bad Request' }, { status: 400 });
        }

        await query(
            'DELETE FROM user_favorites WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
