'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/AlertModal';

export default function ContactPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setAlertConfig({
                title: 'ข้อมูลไม่ครบถ้วน',
                message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, อีเมล, ข้อความ)',
                type: 'error'
            });
            setIsAlertOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setAlertConfig({
                    title: 'สำเร็จ!',
                    message: data.message,
                    type: 'success'
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setAlertConfig({
                    title: 'เกิดข้อผิดพลาด',
                    message: data.message || 'ไม่สามารถส่งข้อความได้ในขณะนี้',
                    type: 'error'
                });
            }
        } catch (error) {
            setAlertConfig({
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
            setIsAlertOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] pt-32 pb-20 px-4 relative overflow-hidden font-sans">
            {/* Subtle Background Effects */}
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Info Section */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
                                ติดต่อ<span className="text-indigo-500">เรา</span>
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed font-light">
                                มีคำถามหรือข้อเสนอแนะ? ทีมงานของเราพร้อมช่วยเหลือคุณเสมอ
                                <br />กรุณากรอกฟอร์มหรือติดต่อผ่านช่องทางด้านล่าง
                            </p>
                        </div>
<br />
                        <div className="space-y-6">
                            {/* Email */}
                            <div className="group flex items-center p-6 bg-[#12121a] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/10">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">ㅤอีเมล</h4>
                                    <p className="text-gray-400 text-sm">ㅤsonthiausid@gmail.com</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="group flex items-center p-6 bg-[#12121a] border border-white/5 rounded-2xl hover:border-pink-500/30 transition-all duration-300 shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-pink-500/10">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-pink-400 transition-colors">ㅤสายด่วน</h4>
                                    <p className="text-gray-400 text-sm">ㅤ065-664-7528</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="group flex items-center p-6 bg-[#12121a] border border-white/5 rounded-2xl hover:border-violet-500/30 transition-all duration-300 shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-violet-500/10">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-violet-400 transition-colors">ㅤที่อยู่</h4>
                                    <p className="text-gray-400 text-sm">ㅤวิทยาลัยเทคนิคสุพรรณบุรี</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50" />
                        <div className="relative bg-[#12121a] border border-white/5 rounded-2xl p-8 md:p-10 shadow-2xl">
                        
                            <h3 className="text-2xl font-bold text-white mb-8">ส่งข้อความถึงเรา</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">ชื่อของคุณ</label>
                                        <input
                                            type="text"
                                            placeholder="ระบุชื่อของคุณ"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:bg-indigo-500/[0.02] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">อีเมลติดต่อ</label>
                                        <input
                                            type="email"
                                            placeholder="example@mail.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:bg-indigo-500/[0.02] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">หัวข้อ</label>
                                    <input
                                        type="text"
                                        placeholder="ระบุหัวข้อเรื่อง"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:bg-indigo-500/[0.02] transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">ข้อความ</label>
                                    <textarea
                                        rows={5}
                                        placeholder="พิมพ์ข้อความของคุณตรงนี้..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:bg-indigo-500/[0.02] transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </div>
    );
}
