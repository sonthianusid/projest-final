'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Order {
    id: string;
    customerName: string;
    items: any[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    createdAt: string;
}

export default function AdminOrders() {
    const { isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        // Load orders from localStorage or use mock data
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            // Mock orders
            const mockOrders: Order[] = [
                {
                    id: 'ORD-001',
                    customerName: 'สมชาย ใจดี',
                    items: [{ name: 'Nike Air Max', quantity: 1 }],
                    total: 4500,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'ORD-002',
                    customerName: 'มานี รักเรียน',
                    items: [{ name: 'Adidas Superstar', quantity: 2 }],
                    total: 7800,
                    status: 'processing',
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 'ORD-003',
                    customerName: 'วิภา สวยงาม',
                    items: [{ name: 'New Balance 574', quantity: 1 }],
                    total: 3200,
                    status: 'shipped',
                    createdAt: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            setOrders(mockOrders);
            localStorage.setItem('orders', JSON.stringify(mockOrders));
        }
    }, [isAuthenticated, isAdmin, router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'processing': return 'bg-blue-500/20 text-blue-400';
            case 'shipped': return 'bg-purple-500/20 text-purple-400';
            case 'delivered': return 'bg-emerald-500/20 text-emerald-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'รอดำเนินการ';
            case 'processing': return 'กำลังจัดเตรียม';
            case 'shipped': return 'จัดส่งแล้ว';
            case 'delivered': return 'ส่งถึงแล้ว';
            default: return status;
        }
    };

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-b border-white/5">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">คำสั่งซื้อ</h1>
                            <p className="text-gray-400 mt-1">ดูและจัดการคำสั่งซื้อทั้งหมด</p>
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
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500">ยังไม่มีคำสั่งซื้อ</p>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-sm rounded-none border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">รหัสคำสั่งซื้อ</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">ลูกค้า</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">ยอดรวม</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">สถานะ</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">วันที่</th>
                                        <th className="text-right px-6 py-4 text-gray-400 font-medium">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                                            <td className="px-6 py-4">{order.customerName}</td>
                                            <td className="px-6 py-4 font-medium">฿{order.total.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors">
                                                        ดูรายละเอียด
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
}
