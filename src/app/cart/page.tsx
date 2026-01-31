'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

import AlertModal from '@/components/AlertModal';
import LoadingModal from '@/components/LoadingModal';
import PaymentMethodModal, { PaymentMethod } from '@/components/PaymentMethodModal';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalAmount, cartCount, clearCart } = useCart();
    const { wallet, user, isAuthenticated } = useAuth();

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, title: '', message: '' });

    const handleCheckoutClick = () => {
        if (!isAuthenticated) {
            setErrorAlert({
                isOpen: true,
                title: 'กรุณาเข้าสู่ระบบ',
                message: 'คุณต้องเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า'
            });
            return;
        }

        if (!user?.address || user.address.trim() === '') {
            setErrorAlert({
                isOpen: true,
                title: 'ไม่พบที่อยู่จัดส่ง',
                message: 'กรุณาระบุที่อยู่จัดส่งของคุณก่อนทำการสั่งซื้อ \n(กรุณาสมัครสมาชิกใหม่หรือติดต่อผู้ดูแลระบบเพื่อเพิ่มที่อยู่)'
            });
            return;
        }

        setShowPaymentModal(true);
    };

    const handlePaymentSelect = async (method: PaymentMethod) => {
        setShowPaymentModal(false);
        setIsCheckingOut(true);

        // Allow UI to update first
        await new Promise(resolve => setTimeout(resolve, 500));

        if (method === 'store_credit') {
            const success = await wallet.deduct(totalAmount);
            if (!success) {
                setIsCheckingOut(false);
                alert('ยอดเงินไม่เพียงพอ'); // Fallback alert
                return;
            }
        }

        setIsCheckingOut(false);
        clearCart();
        setShowSuccess(true);
    };

    return (
        <div className="min-h-screen bg-[#050505] pb-32">
            {/* Spacer กัน navbar */}
            <div className="h-[var(--navbar-height)]"></div>

            <LoadingModal isOpen={isCheckingOut} />

            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirm={handlePaymentSelect}
                totalAmount={totalAmount}
                userBalance={wallet.balance}
            />

            <AlertModal
                isOpen={errorAlert.isOpen}
                onClose={() => setErrorAlert({ ...errorAlert, isOpen: false })}
                title={errorAlert.title}
                message={errorAlert.message}
                type="error"
            />

            <AlertModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="สั่งซื้อสำเร็จ!"
                message="ขอบคุณที่ช้อปกับเรา"
                type="success"
            />
            <br />
            <div className="container mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
                {/* LEFT */}
                <div className="lg:col-span-8 text-white">
                    <h1 className="text-3xl font-bold mb-6">
                        ตะกร้าของคุณ ({cartCount})
                    </h1>
                    <div className="space-y-4">
                        {cart.map((item, index) => (
                            <div
                                key={`${item.id}-${item.selectedSize}`}
                                className="group bg-[#12121a]/80 backdrop-blur-md hover:bg-[#16161f] border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:border-white/10 relative overflow-hidden"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <div className="flex gap-6 items-center">
                                    {/* Image */}
                                    <Link
                                        href={`/products/${item.id}`}
                                        className="block w-28 h-28 sm:w-36 sm:h-36 bg-[#0a0a0a] rounded-2xl overflow-hidden flex-shrink-0 relative border border-white/5"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
                                                    {item.brand}
                                                </p>
                                                <Link href={`/products/${item.id}`}>
                                                    <h3 className="text-white font-bold text-xl leading-snug hover:text-purple-400 transition-colors truncate">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Size:{" "}
                                                    <span className="text-gray-300 font-medium">
                                                        {item.selectedSize}
                                                    </span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all"
                                                title="ลบสินค้า"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            {/* Qty Control */}
                                            <div className="flex items-center bg-[#0a0a0a] rounded-full p-1 border border-white/10 shadow-inner">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="text-white text-sm font-bold w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white tracking-tight">
                                                    ฿{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT – SUMMARY */}

                <div className="hidden lg:block lg:col-span-4">
                    <br />
                    <div className="sticky top-[calc(var(--navbar-height)+24px)]">
                        <div className="bg-[#12121a]/90 border border-white/10 rounded-3xl p-10">
                            <h3 className="text-2xl font-bold text-white mb-8">
                                สรุปคำสั่งซื้อ
                            </h3>

                            <div className="space-y-6 px-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>ยอดรวม ({cartCount} ชิ้น)</span>
                                    <span className="text-white text-lg">
                                        ฿{totalAmount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-400">
                                    <span>ส่วนลด</span>
                                    <span className="text-white">฿0</span>
                                </div>

                                <div className="flex justify-between text-gray-400">
                                    <span>ค่าจัดส่ง</span>
                                    <span className="text-emerald-400 font-bold">ฟรี</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-white/20 mt-8 pt-6 px-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-300 text-lg">
                                        ยอดชำระทั้งหมด
                                    </span>
                                    <span className="text-3xl font-bold text-purple-400">
                                        ฿{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckoutClick}
                                className="btn-primary w-full mt-8 py-4 text-lg font-bold"
                            >
                                ชำระเงิน
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
