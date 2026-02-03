'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import AlertModal from '@/components/AlertModal';
import AddressForm from '@/components/AddressForm';
import OrderDetailModal from '@/components/OrderDetailModal';
import LoadingModal from '@/components/LoadingModal';

export default function ProfilePage() {
    const { user, isAuthenticated, updateProfile } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // Modal State
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone || '',
                address: user.address || ''
            });
            fetchOrders();
        }
    }, [user, isAuthenticated, router]);

    // Handle deep linking from notifications
    useEffect(() => {
        const tab = searchParams.get('tab');
        const orderRef = searchParams.get('orderRef');

        if (tab === 'orders') {
            setActiveTab('orders');
        }

        if (orderRef && orders.length > 0) {
            const order = orders.find(o => o.order_number === orderRef);
            if (order) {
                handleViewOrder(order.id);
            }
        }
    }, [searchParams, orders]);

    const fetchOrders = async () => {
        if (!user?.id) return;
        setIsLoadingOrders(true);
        try {
            const res = await fetch(`/api/orders?userId=${user.id}`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            setAlertMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            setAlertType('error');
            setIsAlertOpen(true);
            return;
        }

        if (updateProfile) {
            setIsSaving(true);

            // Simulate minimum loading time for better UX
            const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
            const updatePromise = updateProfile(formData);

            Promise.all([updatePromise, minLoadTime]).then(([success]) => {
                setIsSaving(false);
                if (success) {
                    setAlertMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
                    setAlertType('success');
                    setIsAlertOpen(true);
                    setIsEditing(false);
                } else {
                    setAlertMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
                    setAlertType('error');
                    setIsAlertOpen(true);
                }
            }).catch(() => {
                setIsSaving(false);
                setAlertMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
                setAlertType('error');
                setIsAlertOpen(true);
            });
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone || '',
                address: user.address || ''
            });
        }
        setIsEditing(false);
    };

    const handleViewOrder = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsOrderModalOpen(true);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden font-sans">
            {/* Extended spacing for navbar */}
            <div className="h-32"></div>

            {/* Subtle Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto max-w-6xl px-4 pb-24 relative z-10">

                {/* Header Section */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                                บัญชีของ<span className="text-indigo-500">ฉัน</span>
                            </h1>
                            <p className="text-gray-400 font-light text-lg">จัดการข้อมูลส่วนตัวและตรวจสอบประวัติการสั่งซื้อของคุณ</p>
                            <br />
                        </div>

                        {/* Member Status Badge */}
                        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                            <div className={`w-2.5 h-2.5 rounded-full ${user.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'} shadow-[0_0_10px_currentColor]`}></div>
                            <span className="text-sm font-medium text-white tracking-wide">
                                {user.role === 'admin' ? 'Administrator' : 'Verified Member'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Sidebar - Profile Card & Nav */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden group">
                            {/* Decorative Top Gradient */}
                            <br />
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent transition-opacity duration-500 group-hover:opacity-100 opacity-70"></div>

                            <div className="relative mb-6 mt-4">
                                <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                                <div className="relative w-36 h-36 rounded-full bg-[#18181b] border-4 border-[#12121a] flex items-center justify-center overflow-hidden shadow-2xl">
                                    <span className="text-7xl font-bold text-gray-700 select-none group-hover:text-indigo-500/50 transition-colors duration-500">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#12121a] rounded-full flex items-center justify-center">
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#12121a]"></div>
                                </div>
                            </div>
                            <br />
                            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{user.name}</h2>
                            <p className="text-gray-500 text-sm font-medium mb-8">@{user.username}</p>
                            <br />
                            {/* Navigation Tabs */}
                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 border ${activeTab === 'profile'
                                        ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
                                        : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-semibold text-sm tracking-wide">ข้อมูลส่วนตัว</span>
                                    {activeTab === 'profile' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                                </button>

                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 border ${activeTab === 'orders'
                                        ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
                                        : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span className="font-semibold text-sm tracking-wide">ประวัติการสั่งซื้อ</span>
                                    {activeTab === 'orders' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                                </button>
                            </div>
                            <br />
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8">
                        <div className="relative">
                            <br />
                            {activeTab === 'profile' && (
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">แก้ไขข้อมูลส่วนตัว</h3>
                                        {isEditing && (
                                            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 uppercase tracking-wider animate-pulse">
                                                Editing
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Username */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ชื่อผู้ใช้</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={formData.username}
                                                        disabled
                                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-400 font-mono text-sm cursor-not-allowed rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Full Name */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ชื่อ - นามสกุล</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium rounded-xl ${!isEditing ? 'border-white/10 text-gray-400 cursor-not-allowed' : 'border-white/20 group-hover/input:border-white/40'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Email */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">อีเมล</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium rounded-xl ${!isEditing ? 'border-white/10 text-gray-400 cursor-not-allowed' : 'border-white/20 group-hover/input:border-white/40'}`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">เบอร์โทรศัพท์</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-3 bg-white/5 border text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium rounded-xl ${!isEditing ? 'border-white/10 text-gray-400 cursor-not-allowed' : 'border-white/20 group-hover/input:border-white/40'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ที่อยู่จัดส่ง</label>
                                            {isEditing ? (
                                                <div className="bg-transparent border-b border-white/20 pb-4 transition-all duration-300 focus-within:border-indigo-500">
                                                    <AddressForm
                                                        onAddressChange={(addr) => setFormData(prev => ({ ...prev, address: addr }))}
                                                        initialAddress={formData.address}
                                                    />
                                                </div>
                                            ) : (
                                                <textarea
                                                    value={formData.address}
                                                    disabled
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed resize-none text-sm leading-relaxed rounded-xl"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 justify-end mt-8">
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium tracking-wide transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95 flex items-center gap-2 border border-indigo-500/50"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                แก้ไขข้อมูล
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleCancel}
                                                    className="h-11 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium tracking-wide transition-all border border-white/10 hover:border-white/20"
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium tracking-wide transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-95 border border-emerald-500/50"
                                                >
                                                    บันทึกการเปลี่ยนแปลง
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">ประวัติการสั่งซื้อ</h3>
                                        {!isLoadingOrders && orders.length > 0 && (
                                            <span className="text-sm font-medium text-gray-500 py-1 border-b border-white/10">{orders.length} รายการ</span>
                                        )}
                                    </div>

                                    {isLoadingOrders ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-70">
                                            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">กำลังโหลดข้อมูล...</span>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                                                <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-2">ไม่มีรายการสั่งซื้อ</h4>
                                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">เริ่มช้อปปิ้งสินค้าที่คุณถูกใจได้เลย</p>
                                            <button
                                                onClick={() => router.push('/products')}
                                                className="h-11 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium tracking-wide transition-all active:scale-95 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 border border-indigo-500/50"
                                            >
                                                ไปที่ร้านค้า
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                                            {orders.map((order) => {
                                                const statusMap: Record<string, { label: string, color: string }> = {
                                                    'pending': { label: 'รอดำเนินการ', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
                                                    'processing': { label: 'กำลังดำเนินการ', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
                                                    'shipped': { label: 'ส่งสินค้าแล้ว', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
                                                    'delivered': { label: 'สำเร็จ', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
                                                    'cancelled': { label: 'ยกเลิก', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' }
                                                };
                                                const status = statusMap[order.status?.toLowerCase()] || { label: order.status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' };

                                                return (
                                                    <div key={order.id} className="group py-6 border-b border-white/5 last:border-0 transition-all duration-300 hover:bg-white/[0.02]">
                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-mono text-indigo-400 font-bold tracking-wide">#{order.order_number}</span>
                                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
                                                                        {status.label}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                    {new Date(order.created_at).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between w-full md:w-auto gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                                                <div className="text-right">
                                                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">ยอดรวมสุทธิ</p>
                                                                    <p className="text-lg font-bold text-white">฿{Number(order.total_amount).toLocaleString()}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleViewOrder(order.id)}
                                                                    className="h-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium transition-all active:scale-95 border border-white/10 rounded-xl"
                                                                >
                                                                    รายละเอียด
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <OrderDetailModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                orderId={selectedOrderId}
            />

            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={alertType === 'success' ? 'สำเร็จ' : 'เกิดข้อผิดพลาด'}
                message={alertMessage}
                type={alertType}
            />

            <LoadingModal
                isOpen={isSaving}
                message="กำลังบันทึกข้อมูล..."
            />
        </div>
    );
}
