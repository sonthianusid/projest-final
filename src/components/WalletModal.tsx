'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AlertModal from '@/components/AlertModal';
import LoadingModal from '@/components/LoadingModal';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { wallet } = useAuth();
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
        setTimeout(() => {
            wallet.topUp(topUpAmount);
            setIsLoading(false);
            setAmount(0);
            setCustomAmount('');
            onClose();
            setTimeout(() => setShowSuccess(true), 100);
        }, 1500);
    };

    if (!isOpen && !showSuccess) return null;

    return (
        <>
            {/* Loading Modal - ใช้ component เดิม */}
            <LoadingModal isOpen={isLoading} />

            {/* Success Alert */}
            <AlertModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="เติมเงินสำเร็จ"
                message="ยอดเงินได้ถูกเพิ่มเข้ากระเป๋าของคุณแล้ว"
                type="success"
            />

            {/* Wallet Modal */}
            {isOpen && !isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 backdrop-blur-md bg-black/40"
                        onClick={onClose}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-[#0f0f17] border border-white/10 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-[#0f0f17] border-b border-white/10 p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">เติมเงิน</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {/* Balance Display */}
                            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl p-5 text-center mb-5">
                                <p className="text-white/80 text-sm mb-1">ยอดเงินคงเหลือ</p>
                                <h3 className="text-3xl font-bold text-white">฿{wallet.balance.toLocaleString()}</h3>
                            </div>

                            {/* Amount Selection */}
                            <p className="text-white font-medium mb-3">เลือกจำนวนเงิน</p>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {amounts.map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => { setAmount(v); setCustomAmount(''); }}
                                        className={`py-3 rounded-lg border text-sm font-bold transition-all ${amount === v
                                            ? 'bg-purple-600/20 border-purple-500 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        ฿{v}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Amount */}
                            <div className="mb-5">
                                <label className="text-gray-500 text-xs mb-2 block">หรือระบุจำนวนเงินเอง</label>
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setCustomAmount(e.target.value);
                                        setAmount(0);
                                    }}
                                    placeholder="0.00"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/10 mb-5"></div>

                            {/* Payment Method */}
                            <p className="text-white font-medium mb-3">ช่องทางชำระเงิน</p>
                            <div className="space-y-2 mb-5">
                                <button
                                    onClick={() => setMethod('truemoney')}
                                    className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-all ${method === 'truemoney'
                                        ? 'bg-orange-500/10 border-orange-500 text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${method === 'truemoney' ? 'bg-orange-500 text-white' : 'bg-white/10'}`}>T</div>
                                    <span className="font-medium text-sm">TrueMoney Wallet</span>
                                    {method === 'truemoney' && (
                                        <svg className="w-4 h-4 ml-auto text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => setMethod('promptpay')}
                                    className={`w-full p-3 rounded-lg border flex items-center gap-3 transition-all ${method === 'promptpay'
                                        ? 'bg-blue-500/10 border-blue-500 text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${method === 'promptpay' ? 'bg-blue-500 text-white' : 'bg-white/10'}`}>P</div>
                                    <span className="font-medium text-sm">QR PromptPay</span>
                                    {method === 'promptpay' && (
                                        <svg className="w-4 h-4 ml-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleTopUp}
                                disabled={!amount && !Number(customAmount)}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${(amount || Number(customAmount)) > 0
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 active:scale-[0.98]'
                                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                ยืนยันการเติมเงิน{(amount || Number(customAmount)) > 0 ? ` ฿${(amount || Number(customAmount)).toLocaleString()}` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
