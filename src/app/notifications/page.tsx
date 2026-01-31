'use client';

import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
    const router = useRouter();

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
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">การแจ้งเตือน</h1>
                        <p className="text-sm text-gray-400 mt-1">อัปเดตสถานะคำสั่งซื้อและข่าวสารต่างๆ</p>
                    </div>
                </div>

                {/* Notifications List (Empty State for now) */}
                <div className="space-y-4">
                    {/* Example Notification Item (Commented out or real dummy) */}
                    {/* 
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-4 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-xl bg-[#667eea]/20 flex items-center justify-center text-[#667eea] group-hover:scale-110 transition-transform">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                             </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold mb-1">คำสั่งซื้อสำเร็จ</h4>
                            <p className="text-gray-400 text-sm">ขอบคุณสำหรับการสั่งซื้อ ORD-2024001 สินค้ากำลังจัดเตรียมจัดส่งครับ</p>
                            <span className="text-[10px] text-gray-500 mt-2 block">2 นาทีที่แล้ว</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#667eea]"></div>
                    </div>
                    */}

                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">ไม่มีการแจ้งเตือนใหม่</h3>
                        <p className="text-gray-400">คุณยังไม่มีการแจ้งเตือนใดๆ ในขณะนี้</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
