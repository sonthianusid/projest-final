import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all';

        let dateCondition = "";

        switch (filter) {
            case 'today':
                dateCondition = "AND DATE(created_at) = CURDATE()";
                break;
            case 'week':
                dateCondition = "AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)";
                break;
            case 'month':
                dateCondition = "AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
                break;
            case 'year':
                dateCondition = "AND YEAR(created_at) = YEAR(CURDATE())";
                break;
            case 'all':
            default:
                dateCondition = "";
                break;
        }

        // Query counts for statistics
        // total_sales: Only sum 'delivered' orders
        // order_count: Count all non-cancelled orders
        const salesStats = await queryOne<{ total_sales: number, order_count: number }>(
            `SELECT 
                COALESCE(SUM(CASE WHEN status IN ('delivered', 'processing', 'shipped') THEN total_amount ELSE 0 END), 0) as total_sales, 
                COUNT(*) as order_count 
             FROM orders 
             WHERE status != 'cancelled' ${dateCondition}`
        );

        const productStats = await queryOne<{ product_count: number }>(
            "SELECT COUNT(*) as product_count FROM products"
        );

        const userStats = await queryOne<{ user_count: number }>(
            "SELECT COUNT(*) as user_count FROM users WHERE role = 'user'"
        );

        const pendingOrderStats = await queryOne<{ pending_count: number }>(
            "SELECT COUNT(*) as pending_count FROM orders WHERE status = 'pending'"
        );

        const lowStockStats = await queryOne<{ low_stock_count: number }>(
            "SELECT COUNT(*) as low_stock_count FROM products WHERE stock < 5"
        );

        const creditStats = await queryOne<{ total_credit: number }>(
            "SELECT COALESCE(SUM(credit_balance), 0) as total_credit FROM users"
        );

        const categoryStats = await queryOne<{ category_count: number }>(
            "SELECT COUNT(DISTINCT category) as category_count FROM products"
        );

        const newUserStats = await queryOne<{ new_user_count: number }>(
            "SELECT COUNT(*) as new_user_count FROM users WHERE role = 'user' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
        );

        let chartQuery = "";
        let chartLabelFormat = "";
        let groupBy = "";
        let orderBy = "";

        // Define chart query based on filter
        switch (filter) {
            case 'today':
                // Hourly stats for today
                chartQuery = `SELECT DATE_FORMAT(created_at, '%H:00') as date, COALESCE(SUM(CASE WHEN status IN ('delivered', 'processing', 'shipped') THEN total_amount ELSE 0 END), 0) as total 
                              FROM orders 
                              WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'
                              GROUP BY HOUR(created_at) 
                              ORDER BY created_at ASC`;
                break;
            case 'week':
                // Daily stats for current week (or last 7 days)
                chartQuery = `SELECT DATE_FORMAT(created_at, '%a') as date, COALESCE(SUM(CASE WHEN status IN ('delivered', 'processing', 'shipped') THEN total_amount ELSE 0 END), 0) as total 
                              FROM orders 
                              WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) AND status != 'cancelled'
                              GROUP BY DATE(created_at) 
                              ORDER BY created_at ASC`;
                break;
            case 'month':
                // Daily stats for current month
                chartQuery = `SELECT DATE_FORMAT(created_at, '%d %b') as date, COALESCE(SUM(CASE WHEN status IN ('delivered', 'processing', 'shipped') THEN total_amount ELSE 0 END), 0) as total 
                              FROM orders 
                              WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND status != 'cancelled'
                              GROUP BY DATE(created_at) 
                              ORDER BY created_at ASC`;
                break;
            case 'year':
                // Monthly stats for current year
                chartQuery = `SELECT DATE_FORMAT(created_at, '%b') as date, COALESCE(SUM(CASE WHEN status IN ('delivered', 'processing', 'shipped') THEN total_amount ELSE 0 END), 0) as total 
                              FROM orders 
                              WHERE YEAR(created_at) = YEAR(CURDATE()) AND status != 'cancelled'
                              GROUP BY MONTH(created_at) 
                              ORDER BY created_at ASC`;
                break;
            case 'all':
            default:
                // Default last 7 days
                chartQuery = `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COALESCE(SUM(CASE WHEN status IN ('delivered', 'processing', 'shipped') THEN total_amount ELSE 0 END), 0) as total 
                              FROM orders 
                              WHERE status != 'cancelled' 
                              GROUP BY DATE(created_at) 
                              ORDER BY created_at DESC LIMIT 7`;
                break;
        }

        const dailySales: any = await query(chartQuery);

        // If default/all, we need to reverse since we ordered by DESC to get last 7 days
        const finalSalesHistory = filter === 'all' ? dailySales.reverse() : dailySales;

        return NextResponse.json({
            success: true,
            stats: {
                totalSales: Number(salesStats?.total_sales || 0),
                totalOrders: Number(salesStats?.order_count || 0),
                totalProducts: Number(productStats?.product_count || 0),
                totalUsers: Number(userStats?.user_count || 0),
                pendingOrders: Number(pendingOrderStats?.pending_count || 0),
                lowStockProducts: Number(lowStockStats?.low_stock_count || 0),
                totalCredit: Number(creditStats?.total_credit || 0),
                totalCategories: Number(categoryStats?.category_count || 0),
                newUsers: Number(newUserStats?.new_user_count || 0),
                salesHistory: dailySales.reverse()
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ' },
            { status: 500 }
        );
    }
}
