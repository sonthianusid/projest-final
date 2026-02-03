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
    const [step, setStep] = useState<'select' | 'process'>('select');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setSelectedMethod(null);
            setStep('select');
            setTimeLeft(600);
            setPhoneNumber('');
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset'; // Unlock scroll
        }
        return () => {
            document.body.style.overflow = 'unset'; // Cleanup
        };
    }, [isOpen]);

    // Timer Logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen && step === 'process' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isOpen, step, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (selectedMethod) {
            setStep('process');
        }
    };

    const handleConfirmPayment = () => {
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
            description: `คงเหลือ: ฿${userBalance.toLocaleString()}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            color: 'from-blue-500 to-cyan-500',
            iconColor: 'text-blue-400',
            bgSelected: 'bg-blue-500/10',
            borderSelected: 'border-blue-500/50',
            disabled: !isBalanceSufficient,
            disabledReason: 'ยอดเงินไม่พอ'
        },
        {
            id: 'truemoney' as PaymentMethod,
            name: 'TrueMoney Wallet',
            description: 'ระบบเติมเงินอัตโนมัติ',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm2-4h-2V7h2v6z" />
                </svg>
            ),
            color: 'from-orange-500 to-red-500',
            iconColor: 'text-orange-400',
            bgSelected: 'bg-orange-500/10',
            borderSelected: 'border-orange-500/50',
        },
        {
            id: 'promptpay' as PaymentMethod,
            name: 'QR PromptPay',
            description: 'สแกน QR Code',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            color: 'from-indigo-500 to-purple-500',
            iconColor: 'text-indigo-400',
            bgSelected: 'bg-indigo-500/10',
            borderSelected: 'border-indigo-500/50',
        },
        {
            id: 'cod' as PaymentMethod,
            name: 'เก็บเงินปลายทาง',
            description: 'จ่ายเมื่อรับของ',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'from-emerald-500 to-green-500',
            iconColor: 'text-emerald-400',
            bgSelected: 'bg-emerald-500/10',
            borderSelected: 'border-emerald-500/50',
        }
    ];

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div
                className="absolute inset-0 backdrop-blur-sm bg-black/70 transition-opacity duration-300"
                onClick={onClose}
            ></div>

            <div className={`relative bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden w-full max-w-[420px] shadow-2xl shadow-black/50 transform transition-all duration-300 flex flex-col max-h-[85vh] ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Header */}
                <div className="relative p-8 pb-4 shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            {step === 'process' && (
                                <button onClick={() => setStep('select')} className="group flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">
                                    {step === 'select' ? 'เลือกช่องทางชำระเงิน' : 'ยืนยันรายการ'}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">{step === 'select' ? 'ขั้นตอนที่ 1 จาก 2' : 'ขั้นตอนที่ 2 จาก 2'}</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {step === 'select' && (
                        <div className="text-center mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">ยอดรวมทั้งหมด</span>
                            <div className="text-4xl font-bold text-white tracking-tight mt-1">
                                ฿{totalAmount.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 pt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {step === 'select' ? (
                        <>
                            <div className="space-y-3 mb-8">
                                {paymentMethods.map((method) => {
                                    const isSelected = selectedMethod === method.id;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => !method.disabled && setSelectedMethod(method.id)}
                                            disabled={method.disabled}
                                            className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 text-left group
                                                ${isSelected
                                                    ? `bg-white/[0.03] ${method.borderSelected} shadow-lg shadow-black/20`
                                                    : method.disabled
                                                        ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                                                        : 'bg-transparent border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                                                }
                                            `}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                                                ${isSelected
                                                    ? `${method.color.replace('from-', 'bg-').split(' ')[0]} text-white shadow-lg` // Simplified active bg logic
                                                    : `bg-white/5 ${method.disabled ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-200'} `
                                                }
                                            `}>
                                                {method.icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-bold text-sm tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-gray-300'} ${method.disabled ? 'text-gray-500' : ''}`}>
                                                        {method.name}
                                                    </span>
                                                    {method.disabled && (
                                                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-xs font-medium">
                                                            {method.disabledReason}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-xs mt-0.5 truncate transition-colors ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {method.description}
                                                </p>
                                            </div>

                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 overflow-hidden
                                                ${isSelected ? `${method.borderSelected} ${method.color.replace('from-', 'bg-').split(' ')[0]}` : 'border-white/20 group-hover:border-white/40'}
                                            `}>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!selectedMethod}
                                className={`w-full h-11 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group shadow-md relative overflow-hidden
                                    ${selectedMethod
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                    }`}
                            >
                                <span className="relative z-10">ดำเนินการต่อ</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col h-full animate-fadeIn">
                            {selectedMethod === 'promptpay' ? (
                                <div className="flex flex-col items-center space-y-6">
                                    <div className="text-center space-y-2">
                                        <h4 className="text-white font-bold text-xl tracking-wide">QR PromptPay</h4>
                                        <p className="text-gray-400 text-sm font-medium">สแกน QR Code เพื่อชำระเงิน</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl shadow-lg shadow-white/5">
                                        <img
                                            src={`https://promptpay.io/0812345678/${totalAmount}.png`}
                                            alt="PromptPay QR"
                                            className="w-48 h-48 object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">สแกน QR Code เพื่อชำระเงิน</p>
                                        <div className="text-2xl font-bold text-white">฿{totalAmount.toLocaleString()}</div>
                                    </div>

                                    <div className="flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20">
                                        <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                            ) : selectedMethod === 'truemoney' ? (
                                <div className="flex flex-col items-center justify-center space-y-8 py-2">


                                    <div className="text-center space-y-2">
                                        <h4 className="text-white font-bold text-xl tracking-wide">TrueMoney Wallet</h4>
                                        <p className="text-gray-400 text-sm font-medium">สแกน QR Code เพื่อชำระเงิน</p>
                                    </div>

                                    <div className="p-4 bg-white rounded-xl shadow-lg shadow-orange-500/20 ring-1 ring-orange-500/20">
                                        <img src={`https://promptpay.io/0812345678/${totalAmount}.png`} alt="TrueMoney QR" className="w-48 h-48 mix-blend-multiply" />
                                    </div>

                                    <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20">
                                        <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                            ) : selectedMethod === 'store_credit' ? (
                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">เครดิตคงเหลือ</span>
                                            <span className="text-white font-medium">฿{userBalance.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">ยอดชำระ</span>
                                            <span className="text-red-400 font-medium">-฿{totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                                            <span className="text-gray-300 font-medium">คงเหลือสุทธิ</span>
                                            <div className="text-right">
                                                <div className="text-emerald-400 font-bold text-xl">฿{(userBalance - totalAmount).toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500">หลังหักยอดชำระ</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="relative inline-block mb-6">
                                        <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full opacity-50"></div>
                                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center relative shadow-2xl shadow-emerald-500/20 ring-1 ring-white/10">
                                            <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight">เก็บเงินปลายทาง (COD)</h4>
                                    <p className="text-sm text-gray-400 max-w-[280px] mx-auto leading-relaxed">พนักงานขนส่งจะติดต่อคุณเพื่อนัดหมายเวลาส่งสินค้า และเก็บเงินที่หน้างานครับ</p>
                                </div>
                            )}

                            <div className="mt-8">
                                <button
                                    onClick={handleConfirmPayment}
                                    className="w-full h-11 rounded-xl font-semibold text-sm tracking-wide bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                                >
                                    {selectedMethod === 'cod' ? 'ยืนยันสั่งซื้อ' : selectedMethod === 'store_credit' ? 'ชำระเงิน' : 'ดำเนินการเรียบร้อย'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export type { PaymentMethod };
