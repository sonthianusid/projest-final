'use client';

import { useEffect, useState } from 'react';

interface LoadingModalProps {
    isOpen: boolean;
    message?: string;
}

export default function LoadingModal({ isOpen, message }: LoadingModalProps) {
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
        <div className={`fixed inset-0 z-[70] flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/40"></div>

            {/* Modal: ปรับ min-h เป็น 300px */}
            <div className={`relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_0_60px_rgba(102,126,234,0.2)] w-full max-w-[410px] min-h-[250px] flex flex-col items-center justify-center mx-4 transform transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}`}>

                <div className="flex flex-col items-center justify-center w-full">
                    {/* Custom Loader Animation */}
                    <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-[4px] border-t-[#667eea] border-r-transparent border-b-[#764ba2] border-l-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-3 border-[4px] border-r-[#667eea] border-b-transparent border-l-[#764ba2] border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40 animate-pulse">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide text-center">
                        {message ? 'กำลังดำเนินการ' : 'กำลังดำเนินการ'}
                    </h3>
                    <p className="text-gray-400 animate-pulse text-sm text-center leading-relaxed px-4">
                        {message || 'กรุณารอสักครู่... ระบบกำลังตรวจสอบข้อมูล'}
                    </p>
                </div>
            </div>
        </div>
    );
}