'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminSales() {
    const { isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const [salesData, setSalesData] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        total: 0
    });

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        // Load orders and calculate sales
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekStart = todayStart - (7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        let today = 0, thisWeek = 0, thisMonth = 0, total = 0;

        orders.forEach((order: any) => {
            const orderDate = new Date(order.createdAt).getTime();
            const amount = order.total || 0;

            total += amount;
            if (orderDate >= todayStart) today += amount;
            if (orderDate >= weekStart) thisWeek += amount;
            if (orderDate >= monthStart) thisMonth += amount;
        });

        setSalesData({ today, thisWeek, thisMonth, total });
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    const statCards = [
        { label: 'ยอดขายวันนี้', value: salesData.today, color: 'from-emerald-500 to-teal-600', icon: '📈' },
        { label: 'ยอดขายสัปดาห์นี้', value: salesData.thisWeek, color: 'from-blue-500 to-indigo-600', icon: '📊' },
        { label: 'ยอดขายเดือนนี้', value: salesData.thisMonth, color: 'from-purple-500 to-violet-600', icon: '📆' },
        { label: 'ยอดขายทั้งหมด', value: salesData.total, color: 'from-amber-500 to-orange-600', icon: '💰' }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-white/5">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">ยอดขาย</h1>
                            <p className="text-gray-400 mt-1">ดูสถิติและรายงานยอดขาย</p>
                        </div>
                        <Link
                            href="/admin"
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                            ← กลับ
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl">{stat.icon}</span>
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`}></div>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold">฿{stat.value.toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                    <h2 className="text-xl font-bold mb-6">กราฟยอดขาย</h2>
                    <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-gray-400">กราฟแสดงยอดขายจะแสดงที่นี่</p>
                            <p className="text-gray-500 text-sm mt-1">เชื่อมต่อกับระบบวิเคราะห์ข้อมูลเพื่อดูกราฟ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
