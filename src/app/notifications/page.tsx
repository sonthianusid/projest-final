'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import OrderDetailModal from '@/components/OrderDetailModal';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState<any>(null); // Accepts string or number
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.id) {
            fetchNotifications();
        }
    }, [user, isAuthenticated, loading, router]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/notifications?userId=${user?.id}`);
            const data = await res.json();
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id?: number) => {
        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, userId: user?.id })
            });

            if (id) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.is_read) {
            markAsRead(notif.id);
        }

        if (notif.type === 'order') {
            // Extract Order Number (ORD-xxxxxxxxxxxxx)
            const match = notif.message.match(/(ORD-\d+)/) || notif.title.match(/(ORD-\d+)/);
            if (match) {
                // Open Modal directly on this page
                setSelectedOrderId(match[1]);
                setIsOrderModalOpen(true);
            } else {
                // Fallback if no order number found (shouldn't happen with correct data)
                router.push('/profile?tab=orders');
            }
        } else if (notif.type === 'wallet') {
            router.push('/wallet');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f17] to-[#0a0a0a] relative overflow-hidden">
            <div className="h-[68px]"></div>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">การแจ้งเตือน</h1>
                            <p className="text-xs text-gray-500 mt-1">อัปเดตสถานะและข่าวสารต่างๆ</p>
                        </div>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <button
                            onClick={() => markAsRead()}
                            className="px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold transition-all border border-indigo-500/20"
                        >
                            อ่านทั้งหมด
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                            <div className="w-10 h-10 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
                            <p>กำลังโหลด...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">ไม่มีการแจ้งเตือนใหม่</h3>
                            <p className="text-gray-400">คุณยังไม่มีการแจ้งเตือนใดๆ ในขณะนี้</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`group py-6 border-b border-white/5 last:border-0 flex gap-5 hover:bg-white/[0.02] transition-all cursor-pointer px-4 -mx-4 rounded-xl ${!notif.is_read ? 'bg-white/[0.01]' : 'opacity-60'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10
                                    ${notif.type === 'order' ? 'bg-indigo-500/10 text-indigo-400' :
                                        notif.type === 'wallet' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}
                                >
                                    {notif.type === 'order' ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    ) : notif.type === 'wallet' ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-medium ${!notif.is_read ? 'text-white' : 'text-gray-400'}`}>{notif.title}</h4>
                                        <span className="text-[10px] text-gray-500 ml-2 whitespace-nowrap">
                                            {new Date(notif.created_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        {(() => {
                                            let msg = notif.message;
                                            const statusMap: Record<string, string> = {
                                                'pending': 'รอดำเนินการ',
                                                'processing': 'กำลังจัดเตรียม',
                                                'shipped': 'จัดส่งแล้ว',
                                                'delivered': 'จัดส่งสำเร็จ',
                                                'cancelled': 'ยกเลิกแล้ว'
                                            };
                                            Object.entries(statusMap).forEach(([en, th]) => {
                                                msg = msg.replace(new RegExp(en, 'gi'), th);
                                            });
                                            return msg;
                                        })()}
                                    </p>
                                </div>
                                {!notif.is_read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 self-center"></div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <OrderDetailModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                orderId={selectedOrderId}
            />
        </div>
    );
}
