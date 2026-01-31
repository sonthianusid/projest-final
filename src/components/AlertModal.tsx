'use client';

import { useEffect, useState } from 'react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error';
}

export default function AlertModal({ isOpen, onClose, title, message, type = 'error' }: AlertModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-md bg-black/40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal: ขนาดคงเดิม (max-w-[460px], min-h-[300px]) */}
            <div className={`relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-[410px] min-h-[250px] flex flex-col items-center justify-center mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col items-center text-center w-full">
                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 relative ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                        <div className={`absolute inset-0 rounded-full opacity-30 blur-2xl ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <div className={`w-full h-full rounded-full border-4 flex items-center justify-center relative z-10 shadow-xl ${isSuccess ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-red-500/20 bg-red-500/10'}`}>
                            {isSuccess ? (
                                <svg className="w-10 h-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-10 h-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Text */}
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 mb-6 text-sm leading-relaxed px-4">{message}</p>

                    {/* Buttons: Flex Center เพื่อให้ปุ่มอยู่ตรงกลาง */}
                    <div className="flex justify-center gap-4 w-full px-2">
                        <button
                            onClick={onClose}
                            className="min-w-[120px] px-6 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:text-white transition-all active:scale-95 border border-white/5"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onClose}
                            className={`min-w-[120px] px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 ${isSuccess
                                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                                : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'}`}
                        >
                            {isSuccess ? 'ตกลง' : 'ลองใหม่'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}