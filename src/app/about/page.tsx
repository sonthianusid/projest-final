'use client';

import React from 'react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-4 relative overflow-hidden font-sans">
            {/* Subtle Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
                        ผู้จัดทำ<span className="text-indigo-500">โครงงาน</span>
                    </h1>
                    <br />
                </div>

                {/* Main Profile Section */}
                <div className="mb-24">
                    <div className="relative bg-[#12121a] border border-white/5 rounded-2xl p-8 md:p-12 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-2xl shadow-black/50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-500" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            {/* Profile Image */}
                            <br />
                            <div className="shrink-0 relative">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img
                                        src="/images/profile.png"
                                        alt="Profile"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="mb-8">
                                    <br />
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-3">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                        Project Creator
                                    </div>
                                    <h2 className="text-4xl font-bold text-white mb-2">นายสนธิ อนุสิทธิ์</h2>
                                    <p className="text-gray-400 font-medium text-lg tracking-wide">นักศึกษาสาขาเทคโนโลยีสารสนเทศ</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="px-0 py-2 group/item border-b border-white/10 hover:border-indigo-500/50 transition-colors">
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 group-hover/item:text-indigo-400 transition-colors">รหัสนักศึกษา</p>
                                        <p className="text-white font-mono text-lg">68319010014</p>
                                    </div>
                                    <div className="px-0 py-2 group/item border-b border-white/10 hover:border-indigo-500/50 transition-colors">
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 group-hover/item:text-indigo-400 transition-colors">ระดับชั้น</p>
                                        <p className="text-white text-lg">ปวส. 1/2</p>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 px-0 py-2 group/item border-b border-white/10 hover:border-indigo-500/50 transition-colors">
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 group-hover/item:text-indigo-400 transition-colors">สถาบันการศึกษา</p>
                                        <p className="text-white text-lg">วิทยาลัยเทคนิคสุพรรณบุรี</p>
                                    </div>
                                </div>
                                <br />
                            </div>
                            <br />
                        </div>
                    </div>
                    <br />
                </div>

                {/* Project Details (Objectives & Scope) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {/* Objectives */}
                    <div className="group p-10 rounded-2xl bg-[#12121a] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">วัตถุประสงค์ (Objectives)</h3>
                        <ul className="space-y-3 text-gray-400 group-hover:text-gray-300 transition-colors list-disc list-inside leading-relaxed">
                            <li>เพื่อพัฒนาระบบร้านค้าออนไลน์ที่มีประสิทธิภาพ</li>
                            <li>เพื่อศึกษาและประยุกต์ใช้เทคโนโลยี Next.js และ Database</li>
                            <li>เพื่อลดขั้นตอนการทำงานและเพิ่มความสะดวกในการซื้อขาย</li>
                        </ul>
                    </div>

                    {/* Scope / Advisor */}
                    <div className="group p-10 rounded-2xl bg-[#12121a] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">อาจารย์ที่ปรึกษา</h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors mb-2">
                            โครงการนี้ได้รับคำแนะนำและตรวจสอบโดย
                        </p>
                        <p className="text-xl font-bold text-white">ชื่ออาจารย์ที่ปรึกษา</p>
                        <p className="text-indigo-400 text-sm mt-1">ตำแหน่ง / สาขาวิชา</p>
                    </div>
                </div>

                {/* Tech Stack used in Project */}
                <div>
                    <br />
                    <br />
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-2xl font-bold text-white">เครื่องมือที่ใช้ในการพัฒนา</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent ml-8" />
                    </div>
                    <br />
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {[
                            {
                                name: 'React',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-2h2V7h-2v7z" /></svg>
                            },
                            {
                                name: 'Next.js',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 19h20L12 2zm0 3.8L17.6 17H6.4L12 5.8z" /></svg>
                            },
                            {
                                name: 'TypeScript',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h4v14H3V5zm6 0h12v2H9V5zm0 4h12v2H9V9zm0 4h8v2H9v-2zm0 4h12v2H9v-2z" /></svg>
                            },
                            {
                                name: 'Tailwind',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                            },
                            {
                                name: 'Node.js',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                            },
                            {
                                name: 'MySQL',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                            },
                            {
                                name: 'Git',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1h12v1zm0-3H6v-1h12v1z" /></svg>
                            },
                            {
                                name: 'VS Code',
                                icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.39z" /></svg>
                            },
                        ].map((skill, idx) => (
                            <div key={idx} className="aspect-square rounded-xl bg-[#12121a] border border-white/5 flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 cursor-default group shadow-lg hover:shadow-indigo-500/10">
                                <div className="text-gray-500 group-hover:text-indigo-400 transition-colors duration-300 transform group-hover:scale-110">
                                    {skill.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <br />
                <br />
            </div>
        </div>
    );
}
