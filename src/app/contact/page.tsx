'use client';

import React, { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('ขอบคุณที่ติดต่อเรา! เราจะตอบกลับโดยเร็วที่สุด');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f17] to-[#0a0a0a] pt-24 pb-20 px-4 relative overflow-hidden">
            <div className="h-[68px]"></div>

            {/* Enhanced Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                <div className="absolute bottom-[10%] left-[30%] w-[450px] h-[450px] bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                        ติดต่อ<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb]">เรา</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        มีคำถามหรือข้อสงสัย? ติดต่อเราได้ผ่านช่องทางด้านล่าง เรายินดีตอบทุกคำถาม
                    </p>
                </div>

                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                    {/* Phone */}
                    <a
                        href="tel:0632726216"
                        className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 text-center hover:border-green-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]"
                    >
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-green-500/20 group-hover:border-green-500/40">
                            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">โทรศัพท์</h3>
                        <p className="text-gray-400 font-mono text-sm group-hover:text-green-400 transition-colors">063-272-6216</p>
                    </a>

                    {/* Email */}
                    <a
                        href="mailto:thanakrit@example.com"
                        className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 text-center hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
                    >
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20 group-hover:border-blue-500/40">
                            <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">อีเมล</h3>
                        <p className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors">thanakrit@example.com</p>
                    </a>

                    {/* Facebook */}
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 text-center hover:border-blue-600/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)]"
                    >
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-600/20 to-blue-800/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-600/20 group-hover:border-blue-600/40">
                            <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Facebook</h3>
                        <p className="text-gray-400 text-sm group-hover:text-blue-500 transition-colors">ติดตามเรา</p>
                    </a>

                    {/* LINE */}
                    <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 text-center hover:border-[#06C755]/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(6,199,85,0.3)]">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#06C755]/20 to-[#06C755]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#06C755]/20 group-hover:border-[#06C755]/40">
                            <svg className="w-7 h-7 text-[#06C755]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.285.63.63 0 .345-.281.63-.63.63h-2.385c-.349 0-.63-.285-.63-.63V10.494c0-.345.281-.63.63-.63h2.385zm-5.733 0c.349 0 .63.285.63.631 0 .345-.281.63-.63.63h-1.755v1.125h1.755c.349 0 .63.285.63.63 0 .345-.281.63-.63.63h-2.385c-.349 0-.63-.285-.63-.63V10.494c0-.345.281-.63.63-.63h2.385zm-3.733 0c.349 0 .63.285.63.631v2.52c0 .345-.281.63-.63.63-.349 0-.63-.285-.63-.63v-2.52c0-.346.281-.631.63-.631zm-2.277 0c.189 0 .363.084.484.225l1.642 2.228V10.494c0-.346.282-.631.63-.631.349 0 .63.285.63.631v2.52c0 .2-.095.38-.247.498-.108.084-.242.132-.383.132-.189 0-.363-.084-.484-.225l-1.642-2.228v1.833c0 .345-.282.63-.63.63-.349 0-.63-.285-.63-.63v-2.52c0-.2.095-.38.247-.498.109-.084.243-.132.383-.132zM12 0C5.373 0 0 4.973 0 11.108c0 3.395 1.638 6.467 4.316 8.527.245.2.404.57.317.886l-.601 3.003c.125.044.256.077.393.077 3.38 0 5.485-2.062 5.567-2.146.126-.145.31-.225.502-.225.502.008 1.002.012 1.506.012 6.627 0 12-4.973 12-11.108S18.627 0 12 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">LINE ID</h3>
                        <p className="text-gray-400 text-sm font-mono group-hover:text-[#06C755] transition-colors">@sonthishop</p>
                    </div>
                </div>

                {/* Contact Form & Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-10">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                ส่งข้อความถึงเรา
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-3">ชื่อของคุณ</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 transition-all duration-300 hover:border-white/20"
                                            placeholder="นายธนกฤต ระโหฐาน"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-3">อีเมล</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 transition-all duration-300 hover:border-white/20"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-3">หัวข้อ</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 transition-all duration-300 hover:border-white/20"
                                        placeholder="สอบถามเกี่ยวกับสินค้า"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-3">ข้อความ</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={5}
                                        className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 transition-all duration-300 resize-none hover:border-white/20"
                                        placeholder="เขียนข้อความของคุณที่นี่..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl hover:shadow-[0_0_30px_-8px_rgba(102,126,234,0.5)] transition-all duration-300 hover:scale-[1.02]"
                                >
                                    ส่งข้อความ
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                ข้อมูลเพิ่มเติม
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">เวลาทำการ</p>
                                        <p className="text-white text-sm font-medium">จันทร์ - ศุกร์</p>
                                        <p className="text-gray-400 text-xs mt-0.5">09:00 - 18:00 น.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 flex items-center justify-center shrink-0 border border-pink-500/20">
                                        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">สถานที่</p>
                                        <p className="text-white text-sm font-medium">สุพรรณบุรี</p>
                                        <p className="text-gray-400 text-xs mt-0.5">ประเทศไทย</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">เวลาตอบกลับ</p>
                                        <p className="text-white text-sm font-medium">ภายใน 24 ชั่วโมง</p>
                                        <p className="text-gray-400 text-xs mt-0.5">ในวันทำการ</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                ติดตามเรา
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
                                    <svg className="w-6 h-6 mx-auto mb-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <p className="text-white text-xs font-medium">Facebook</p>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group bg-white/5 hover:bg-sky-500/10 border border-white/10 hover:border-sky-500/30 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
                                    <svg className="w-6 h-6 mx-auto mb-2 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                    <p className="text-white text-xs font-medium">Twitter</p>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
                                    <svg className="w-6 h-6 mx-auto mb-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                    <p className="text-white text-xs font-medium">Instagram</p>
                                </a>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group bg-white/5 hover:bg-gray-400/10 border border-white/10 hover:border-gray-400/30 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105">
                                    <svg className="w-6 h-6 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <p className="text-white text-xs font-medium">GitHub</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        คำถามที่พบบ่อย
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { q: 'สามารถติดต่อได้ช่องทางไหนบ้าง?', a: 'สามารถติดต่อได้ทาง โทรศัพท์, อีเมล, Facebook หรือ LINE' },
                            { q: 'เวลาทำการเป็นอย่างไร?', a: 'วันจันทร์ - ศุกร์ เวลา 09:00 - 18:00 น.' },
                            { q: 'ตอบกลับภายในกี่วัน?', a: 'เราจะตอบกลับภายใน 24 ชั่วโมง ในวันทำการ' },
                            { q: 'มีบริการจัดส่งหรือไม่?', a: 'มีบริการจัดส่งทั่วประเทศไทย' },
                        ].map((faq, index) => (
                            <div key={index} className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-indigo-500/20 transition-all duration-300">
                                <h4 className="text-white font-bold mb-3 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    {faq.q}
                                </h4>
                                <p className="text-gray-400 text-sm pl-11">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
