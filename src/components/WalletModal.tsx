'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AlertModal from './AlertModal';
import LoadingModal from './LoadingModal';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type PaymentMethod = 'truemoney' | 'promptpay';

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { user, wallet } = useAuth();
    const [step, setStep] = useState<'amount' | 'method' | 'confirm'>('amount');
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep('amount');
            setAmount('');
            setSelectedMethod(null);
            setPhoneNumber('');
            setTimeLeft(600);
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            document.body.style.overflow = 'unset'; // Unlock scroll
        }
        return () => {
            document.body.style.overflow = 'unset'; // Cleanup
        };
    }, [isOpen]);

    // Timer Logic for Confirmation Page
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen && step === 'confirm' && timeLeft > 0) {
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

    const handleNextStep = () => {
        if (step === 'amount') {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount) || numAmount <= 0) {
                setAlert({ show: true, message: 'กรุณากรอกจำนวนเงินให้ถูกต้อง', type: 'error' });
                return;
            }
            setStep('method');
        } else if (step === 'method') {
            if (!selectedMethod) return;
            setStep('confirm');
        }
    };

    const handleBackStep = () => {
        if (step === 'method') setStep('amount');
        if (step === 'confirm') setStep('method');
    };

    const handleTopUp = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        // if (selectedMethod === 'truemoney' && !phoneNumber) {
        //     setAlert({ show: true, message: 'กรุณากรอกเบอร์โทรศัพท์', type: 'error' });
        //     return;
        // }

        setIsSubmitting(true);
        try {
            // Simulated delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const success = await wallet.topUp(numAmount);

            if (success) {
                setAlert({
                    show: true,
                    message: `เติมเงินสำเร็จ ${numAmount.toLocaleString()} บาท`,
                    type: 'success'
                });
                // Close modal after short delay
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setAlert({ show: true, message: 'การทำรายการล้มเหลว กรุณาลองใหม่', type: 'error' });
            }
        } catch (error) {
            setAlert({ show: true, message: 'การเชื่อมต่อขัดข้อง', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

            {/* Modal Container */}
            <div className={`relative bg-card border border-border rounded-xl overflow-hidden w-full max-w-[420px] shadow-2xl shadow-black/20 transform transition-all duration-300 flex flex-col max-h-[85vh] ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Header Section */}
                <div className="p-8 pb-4 relative z-10 shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            {step !== 'amount' && (
                                <button onClick={handleBackStep} className="group flex items-center justify-center w-8 h-8 rounded-lg bg-secondary hover:bg-muted transition-colors">
                                    <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-foreground tracking-tight">
                                    {step === 'amount' ? 'ระบุยอดเงิน' : step === 'method' ? 'เลือกช่องทาง' : 'ยืนยันรายการ'}
                                </h2>
                                <p className="text-xs text-muted-foreground font-medium">ขั้นตอน {step === 'amount' ? '1' : step === 'method' ? '2' : '3'} จาก 3</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Minimal Step Indicator */}
                    <div className="flex gap-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ease-out bg-indigo-500 ${step === 'amount' ? 'w-1/3' : step === 'method' ? 'w-2/3' : 'w-full'}`} />
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 pt-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex-1 min-h-0">

                    {/* Amount */}
                    {step === 'amount' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="text-center space-y-2">
                                <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">ยอดเงินคงเหลือปัจจุบัน</p>
                                <p className="text-3xl font-bold text-foreground tracking-tight">฿{user?.creditBalance?.toLocaleString() || '0'}</p>
                            </div>

                            <div className="relative group">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-transparent border-b-2 border-border focus:border-primary py-4 text-center text-5xl font-bold text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/30"
                                    autoFocus
                                />
                                <p className="text-center text-muted-foreground text-sm mt-2">ระบุจำนวนเงินที่ต้องการเติม</p>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[100, 300, 500, 1000, 2000, 5000].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val.toString())}
                                        className="py-3 rounded-xl bg-secondary border border-border text-foreground text-sm font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
                                    >
                                        +{val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Method */}
                    {step === 'method' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="text-center mb-6">
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">ยอดชำระสุทธิ</p>
                                <p className="font-bold text-foreground text-4xl">฿{parseFloat(amount).toLocaleString()}</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        id: 'promptpay',
                                        label: 'QR Code PromptPay',
                                        desc: 'ฟรีค่าธรรมเนียม',
                                        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>,
                                        activeColor: 'bg-indigo-500',
                                        activeBorder: 'border-indigo-500'
                                    },
                                    {
                                        id: 'truemoney',
                                        label: 'TrueMoney Wallet',
                                        desc: 'เติมเงินผ่านเบอร์',
                                        icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm2-4h-2V7h2v6z" /></svg>,
                                        activeColor: 'bg-orange-500',
                                        activeBorder: 'border-orange-500'
                                    }
                                ].map(method => {
                                    const isSelected = selectedMethod === method.id;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                                            className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 text-left group
                                                ${isSelected
                                                    ? `bg-secondary ${method.activeBorder} shadow-lg shadow-black/5`
                                                    : 'bg-card border-border hover:bg-secondary hover:border-border'
                                                }
                                            `}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                                                ${isSelected
                                                    ? `${method.activeColor} text-white shadow-lg`
                                                    : 'bg-secondary text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                                                }
                                            `}>
                                                {method.icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <span className={`block font-bold text-sm tracking-wide transition-colors ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                                                    {method.label}
                                                </span>
                                                <span className={`block text-xs transition-colors mt-0.5 ${isSelected ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                                                    {method.desc}
                                                </span>
                                            </div>

                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 overflow-hidden
                                                ${isSelected ? `${method.activeBorder} ${method.activeColor}` : 'border-border group-hover:border-primary/50'}
                                            `}>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Confirm */}
                    {step === 'confirm' && (
                        <div className="flex flex-col h-full animate-fadeIn">
                            {selectedMethod === 'promptpay' ? (
                                <div className="flex flex-col items-center space-y-6">
                                    <div className="text-center space-y-2">
                                        <h4 className="text-foreground font-bold text-xl tracking-wide">QR PromptPay</h4>
                                        <p className="text-muted-foreground text-sm font-medium">สแกน QR Code เพื่อเติมเงิน</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl shadow-lg shadow-black/5">
                                        <img src={`https://promptpay.io/0812345678/${amount}.png`} alt="QR" className="w-48 h-48 mix-blend-multiply" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">สแกน QR Code เพื่อเติมเงิน</p>
                                        <div className="text-2xl font-bold text-foreground">฿{parseFloat(amount).toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-500 bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20">
                                        <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-8 py-2">


                                    <div className="text-center space-y-2">
                                        <h4 className="text-foreground font-bold text-xl tracking-wide">TrueMoney Wallet</h4>
                                        <p className="text-muted-foreground text-sm font-medium">สแกน QR Code เพื่อเติมเงิน</p>
                                    </div>

                                    <div className="p-4 bg-white rounded-xl shadow-lg shadow-orange-500/20 ring-1 ring-orange-500/20">
                                        <img src={`https://promptpay.io/0812345678/${amount}.png`} alt="TrueMoney QR" className="w-48 h-48 mix-blend-multiply" />
                                    </div>

                                    <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20">
                                        <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Test Mode Note */}
                            <div className="mt-auto pt-6 text-center">
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-muted-foreground font-medium">Test Mode:</span> ยอดเงินจะเข้าทันทีหลังยืนยัน
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <br />
                {/* Footer */}
                <div className="p-8 pt-0 z-10 shrink-0 bg-transparent mt-2">
                    <button
                        onClick={step === 'confirm' ? handleTopUp : handleNextStep}
                        disabled={isSubmitting || (step === 'amount' && !amount) || (step === 'method' && !selectedMethod)}
                        className={`w-full h-11 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group shadow-md
                            ${step === 'confirm'
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-600/20 hover:shadow-emerald-600/30'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30'}
                            ${(isSubmitting || (step === 'amount' && !amount) || (step === 'method' && !selectedMethod)) ? 'opacity-50 cursor-not-allowed transform-none hover:transform-none shadow-none bg-none bg-white/5 text-white/20 border border-white/5' : 'hover:scale-[1.02] active:scale-[0.98]'}
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังดำเนินการ...
                            </>
                        ) : (
                            step === 'confirm' ? 'ยืนยันการทำรายการ' : 'ดำเนินการต่อ'
                        )}
                    </button>
                </div>

            </div>

            <AlertModal isOpen={alert.show} onClose={() => setAlert({ ...alert, show: false })} title={alert.type === 'success' ? 'สำเร็จ' : 'แจ้งเตือน'} message={alert.message} type={alert.type} />
            <LoadingModal isOpen={isSubmitting} message="กำลังดำเนินการ..." />
        </div >
    );

}

// Reuse styles from global.css or add specific ones here if needed
// but mostly using Tailwind classes for glassmorphism
