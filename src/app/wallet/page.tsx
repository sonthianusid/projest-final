'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AlertModal from '@/components/AlertModal';
import LoadingModal from '@/components/LoadingModal';

export default function WalletPage() {
    const { user, wallet, isAuthenticated } = useAuth();
    const [amount, setAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState('');
    const [method, setMethod] = useState<'truemoney' | 'promptpay'>('truemoney');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const amounts = [100, 300, 500, 1000];

    const handleTopUp = () => {
        const topUpAmount = amount || Number(customAmount);
        if (topUpAmount <= 0) return;

        setIsLoading(true);
        // Simulate API call processing
        setTimeout(() => {
            wallet.topUp(topUpAmount);
            setIsLoading(false);
            setShowSuccess(true);
            setAmount(0);
            setCustomAmount('');
        }, 2000);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white text-center">
                    <p className="mb-4">กรุณาเข้าสู่ระบบเพื่อใช้งานกระเป๋าเงิน</p>
                    <a href="/login" className="btn-primary px-6 py-2 rounded-xl">เข้าสู่ระบบ</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pb-32">
            <div className="h-[var(--navbar-height)]"></div>

            <LoadingModal isOpen={isLoading} />
            <AlertModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="เติมเงินสำเร็จ"
                message="ยอดเงินได้ถูกเพิ่มเข้ากระเป๋าของคุณแล้ว"
                type="success"
            />

            <div className="container mx-auto px-6 py-10 max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">กระเป๋าเงินของฉัน</h1>
                    <p className="text-gray-400">บริหารจัดการเครดิตของคุณ</p>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-3xl p-8 mb-8 text-center shadow-lg shadow-purple-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <p className="text-white/80 font-medium mb-1">ยอดเงินคงเหลือ</p>
                        <h2 className="text-5xl font-bold text-white">฿{wallet.balance.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Top Up Section */}
                <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">เติมเงิน</h3>

                    {/* Amount Selection */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {amounts.map((v) => (
                            <button
                                key={v}
                                onClick={() => { setAmount(v); setCustomAmount(''); }}
                                className={`py-4 rounded-xl border transition-all font-bold ${amount === v
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                ฿{v}
                            </button>
                        ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="mb-8">
                        <label className="text-gray-400 text-sm mb-2 block">ระบุจำนวนเงินอื่น</label>
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setAmount(0);
                            }}
                            placeholder="0.00"
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Payment Simulation */}
                    <h3 className="text-xl font-bold text-white mb-4">ช่องทางชำระเงิน</h3>
                    <div className="space-y-3 mb-8">
                        <button
                            onClick={() => setMethod('truemoney')}
                            className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${method === 'truemoney'
                                ? 'bg-orange-500/10 border-orange-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'truemoney' ? 'bg-orange-500 text-white' : 'bg-white/10'}`}>T</div>
                            <span className="font-bold">TrueMoney Wallet</span>
                        </button>
                        <button
                            onClick={() => setMethod('promptpay')}
                            className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${method === 'promptpay'
                                ? 'bg-blue-500/10 border-blue-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'promptpay' ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>P</div>
                            <span className="font-bold">QR PromptPay</span>
                        </button>
                    </div>

                    <button
                        onClick={handleTopUp}
                        disabled={!amount && !Number(customAmount)}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${(amount || Number(customAmount)) > 0
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-600/30 active:scale-95'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        ยืนยันการเติมเงิน
                    </button>
                </div>
            </div>
        </div>
    );
}
