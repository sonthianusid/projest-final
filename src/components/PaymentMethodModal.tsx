'use client';

import { useEffect, useState } from 'react';

type PaymentMethod = 'store_credit' | 'truemoney' | 'promptpay' | 'cod';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (method: PaymentMethod) => void;
    totalAmount: number;
    userBalance: number;
}

export default function PaymentMethodModal({ isOpen, onClose, onConfirm, totalAmount, userBalance }: PaymentMethodModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setSelectedMethod(null);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (selectedMethod) {
            onConfirm(selectedMethod);
            onClose();
        }
    };

    const isBalanceSufficient = userBalance >= totalAmount;

    const paymentMethods = [
        {
            id: 'store_credit' as PaymentMethod,
            name: 'Store Credit',
            description: `ยอดเงินคงเหลือ: ฿${userBalance.toLocaleString()}`,
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            textColor: 'text-blue-400',
            disabled: !isBalanceSufficient,
            disabledReason: 'ยอดเงินไม่เพียงพอ'
        },
        {
            id: 'truemoney' as PaymentMethod,
            name: 'TrueMoney Wallet',
            description: 'ชำระผ่าน TrueMoney',
            icon: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm2-4h-2V7h2v6z" />
                </svg>
            ),
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30',
            textColor: 'text-orange-400'
        },
        {
            id: 'promptpay' as PaymentMethod,
            name: 'QR PromptPay',
            description: 'สแกน QR Code ชำระเงิน',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-500/10',
            borderColor: 'border-indigo-500/30',
            textColor: 'text-indigo-400'
        },
        {
            id: 'cod' as PaymentMethod,
            name: 'เก็บเงินปลายทาง',
            description: 'ชำระเงินเมื่อได้รับสินค้า',
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'from-emerald-500 to-green-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/30',
            textColor: 'text-emerald-400'
        }
    ];

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div
                className="absolute inset-0 backdrop-blur-md bg-black/40 transition-opacity"
                onClick={onClose}
            ></div>

            <div className={`relative bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_0_60px_rgba(102,126,234,0.2)] w-full max-w-[500px] mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col w-full">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 relative text-[#667eea]">
                            <div className="absolute inset-0 rounded-full bg-[#667eea] opacity-30 blur-2xl"></div>
                            <div className="w-full h-full rounded-full border-4 border-[#667eea]/20 bg-[#667eea]/10 flex items-center justify-center relative z-10 shadow-xl">
                                <svg className="w-8 h-8 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">เลือกช่องทางชำระเงิน</h3>
                        <p className="text-gray-400 text-sm">ยอดชำระ <span className="text-purple-400 font-bold">฿{totalAmount.toLocaleString()}</span></p>
                    </div>

                    <div className="space-y-3 mb-6">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => !method.disabled && setSelectedMethod(method.id)}
                                disabled={method.disabled}
                                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group relative
                                    ${selectedMethod === method.id
                                        ? `${method.bgColor} ${method.borderColor} scale-[1.02]`
                                        : method.disabled
                                            ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
                                    ${selectedMethod === method.id
                                        ? `bg-gradient-to-br ${method.color} text-white shadow-lg`
                                        : 'bg-white/10 text-gray-400 group-hover:text-white'
                                    }`}
                                >
                                    {method.icon}
                                </div>

                                <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between">
                                        <p className={`font-bold transition-colors ${selectedMethod === method.id ? method.textColor : 'text-white'}`}>
                                            {method.name}
                                        </p>
                                        {method.disabled && (
                                            <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                                                {method.disabledReason}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{method.description}</p>
                                </div>

                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                    ${selectedMethod === method.id
                                        ? `${method.borderColor} ${method.bgColor}`
                                        : 'border-gray-600'
                                    }`}
                                >
                                    {selectedMethod === method.id && (
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${method.color}`}></div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="min-w-[120px] px-6 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:text-white transition-all active:scale-95 border border-white/5"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedMethod}
                            className={`min-w-[140px] px-6 py-3 rounded-xl font-bold transition-all active:scale-95
                                ${selectedMethod
                                    ? 'bg-[#667eea] text-white hover:bg-[#5a6fd6] shadow-lg shadow-purple-500/20'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            ยืนยันชำระเงิน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export type { PaymentMethod };
