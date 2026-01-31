'use client';

import React from 'react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#161622] to-[#0a0a0f] pt-24 pb-20 px-4 relative overflow-hidden">
            <div className="h-[68px]"></div>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
                <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-pink-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                        เกี่ยวกับ<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#c084fc]">เรา</span>
                    </h1>
                    <p className="text-gray-400 text-base max-w-2xl mx-auto">
                        พัฒนาโดยนักศึกษาสาขาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคสุพรรณบุรี
                    </p>
                </div>

                {/* Profile Card */}
                <div className="mb-10">
                    <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-10 hover:border-purple-500/20 transition-all duration-500 hover:shadow-[0_0_60px_-20px_rgba(139,92,246,0.3)]">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Profile Image */}
                            <div className="relative shrink-0">
                                <div className="absolute -inset-2 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full opacity-50 blur-lg animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <div className="relative w-32 h-32 rounded-full border-3 border-[#1a1a2e] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 shadow-2xl">
                                    <img
                                        src="/images/profile-placeholder.jpg"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://ui-avatars.com/api/?name=Thanakrit+R&background=a855f7&color=fff&size=256&bold=true';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left space-y-5">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">ชื่อ-นามสกุล</p>
                                    <p className="text-2xl text-white font-bold">นายธนกฤต ระโหฐาน</p>
                                    <p className="text-sm text-gray-400 mt-1">Mr. Thanakrit Rahothan</p>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-gray-500 text-xs uppercase mb-1">สถาบันการศึกษา</p>
                                        <p className="text-white/90 text-sm font-medium">วิทยาลัยเทคนิคสุพรรณบุรี</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-gray-500 text-xs uppercase mb-1">สาขา</p>
                                        <p className="text-white/90 text-sm font-medium">เทคโนโลยีสารสนเทศ</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-gray-500 text-xs uppercase mb-1">รหัสนักศึกษา</p>
                                        <p className="text-white/90 text-sm font-mono font-medium">68319010017</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-gray-500 text-xs uppercase mb-1">บทบาท</p>
                                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2] text-sm font-bold">Full-Stack Developer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Vision */}
                    <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(139,92,246,0.4)] hover:scale-[1.02]">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center shrink-0 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">วิสัยทัศน์</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    มุ่งมั่นพัฒนาระบบอีคอมเมิร์ซที่ทันสมัย ใช้งานง่าย และตอบโจทย์ความต้องการของผู้ใช้งานในยุคดิจิทัล ด้วยเทคโนโลยีที่ล้ำสมัยและประสบการณ์ผู้ใช้ที่ยอดเยี่ยม
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 hover:border-pink-500/40 transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(236,72,153,0.4)] hover:scale-[1.02]">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center shrink-0 border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">พันธกิจ</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    สร้างสรรค์แพลตฟอร์มการช้อปปิ้งออนไลน์ที่มีประสิทธิภาพ ปลอดภัย และเข้าถึงได้ง่าย พร้อมนำเสนอประสบการณ์การซื้อสินค้าที่น่าประทับใจให้กับทุกคน
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        ค่านิยมของเรา
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Quality */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-7 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_30px_-12px_rgba(59,130,246,0.4)] hover:scale-[1.02]">
                            <div className="flex items-center gap-5 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-white text-base font-bold">คุณภาพ (Quality)</h4>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed pl-16">มุ่งเน้นคุณภาพในทุกรายละเอียด</p>
                        </div>

                        {/* Innovation */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-7 hover:border-purple-500/40 transition-all duration-300 hover:shadow-[0_0_30px_-12px_rgba(139,92,246,0.4)] hover:scale-[1.02]">
                            <div className="flex items-center gap-5 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h4 className="text-white text-base font-bold">นวัตกรรม (Innovation)</h4>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed pl-16">สร้างสรรค์สิ่งใหม่ด้วยเทคโนโลยี</p>
                        </div>

                        {/* Responsibility */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-7 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_30px_-12px_rgba(16,185,129,0.4)] hover:scale-[1.02]">
                            <div className="flex items-center gap-5 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h4 className="text-white text-base font-bold">ความรับผิดชอบ</h4>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed pl-16">ซื่อสัตย์ รับผิดชอบในทุกงาน</p>
                        </div>
                    </div>
                </div>

                {/* Skills & Technologies */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        ทักษะและเทคโนโลยี
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {/* React.js */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(6,182,212,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">React.js</p>
                            </div>
                        </div>

                        {/* Next.js */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-gray-400/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(156,163,175,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-500/20 to-gray-600/10 flex items-center justify-center border border-gray-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">Next.js</p>
                            </div>
                        </div>

                        {/* TypeScript */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(59,130,246,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">TypeScript</p>
                            </div>
                        </div>

                        {/* Tailwind CSS */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-teal-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(20,184,166,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center border border-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">Tailwind CSS</p>
                            </div>
                        </div>

                        {/* Node.js */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-green-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(34,197,94,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">Node.js</p>
                            </div>
                        </div>

                        {/* Database */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-orange-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(249,115,22,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">Database</p>
                            </div>
                        </div>

                        {/* Git Control */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-red-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(239,68,68,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">Git Control</p>
                            </div>
                        </div>

                        {/* UX/UI Design */}
                        <div className="group bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 hover:border-pink-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-12px_rgba(236,72,153,0.4)]">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                </div>
                                <p className="text-white text-sm font-semibold">UX/UI Design</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
