'use client';

import { useEffect, useState } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-md bg-black/40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal: ขนาดคงเดิม (max-w-[460px], min-h-[300px]) */}
            <div className={`relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_0_50px_rgba(102,126,234,0.15)] w-full max-w-[410px] min-h-[250px] flex flex-col items-center justify-center mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

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
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 relative text-[#667eea]">
                        <div className="absolute inset-0 rounded-full bg-[#667eea] opacity-30 blur-2xl"></div>
                        <div className="w-full h-full rounded-full border-4 border-[#667eea]/20 bg-[#667eea]/10 flex items-center justify-center relative z-10 shadow-xl">
                            <svg className="w-10 h-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

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
                            onClick={() => { onConfirm(); onClose(); }}
                            className="min-w-[120px] px-6 py-3 rounded-xl bg-[#667eea] text-white font-bold hover:bg-[#5a6fd6] shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                        >
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}