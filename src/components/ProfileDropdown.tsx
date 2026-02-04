'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from './ConfirmModal';
import LoadingModal from './LoadingModal';

export default function ProfileDropdown() {
    const { user, logout, isAdmin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread count
    useEffect(() => {
        if (user) {
            const fetchUnreadCount = () => {
                fetch(`/api/notifications?userId=${user.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setUnreadCount(data.unreadCount);
                        }
                    })
                    .catch(console.error);
            };

            fetchUnreadCount();
            // Poll every 5 seconds for near real-time updates
            const interval = setInterval(fetchUnreadCount, 5000);
            return () => clearInterval(interval);
        }
    }, [user]); // Removed isOpen dependency to prevent resetting interval unnecessarily

    // ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 pl-4 py-2 pr-2 border-l border-white/10 transition-all duration-300 group outline-none ${isOpen ? 'bg-white/5' : 'hover:bg-white/5'}`}
            >
                <div className="flex flex-col items-end leading-tight mr-1 hidden sm:flex">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {user.name}
                    </span>
                    <span className={`text-[10px] font-medium tracking-wide uppercase ${isAdmin ? 'text-amber-500' : 'text-muted-foreground'}`}>
                        {isAdmin ? 'ผู้ดูแลระบบ' : 'สมาชิก'}
                    </span>
                </div>

                {/* Avatar */}
                <div className="relative">
                    <div className={`absolute -inset-[2px] bg-gradient-to-tr from-[#667eea] to-[#764ba2] rounded-full blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isOpen ? 'opacity-100' : ''}`}></div>
                    <div className="relative w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl">
                        {/* ถ้ามีรูปภาพจริง ให้ใส่ <img> ตรงนี้ แทนตัวหนังสือ */}
                        <span className="text-sm font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* Notification Dot (Trigger) */}
                    {unreadCount > 0 && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#1a1a2e] rounded-full shadow-sm animate-pulse z-10"></div>
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full right-0 mt-3 w-80 transform transition-all duration-300 origin-top-right z-50
                ${isOpen
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-[-10px] scale-95 pointer-events-none'
                }`}
            >
                {/* Main Card */}
                <div className="bg-popover border border-border rounded-2xl shadow-[0_10px_50px_-10px_rgba(0,0,0,0.2)] overflow-hidden ring-1 ring-border/50 backdrop-blur-xl">

                    {/* Header Section */}
                    <div className="relative p-6 bg-secondary/50 border-b border-border">
                        {/* Background Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="relative z-10 flex items-center gap-4">
                            {/* Large Avatar */}
                            <div className="w-16 h-16 shrink-0 rounded-full p-0.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-lg">
                                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-2xl font-bold text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-foreground font-bold text-lg leading-tight truncate">{user.name}</h4>
                                <p className="text-xs text-muted-foreground font-medium truncate mb-2">{user.email}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${isAdmin ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                    {isAdmin ? 'Admin Access' : 'Verified Member'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Menu List */}
                    <div className="p-4 pt-4">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all group mb-2"
                            >
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </span>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-amber-400 group-hover:text-amber-300">แดชบอร์ด</span>
                                    <span className="text-[11px] text-gray-500">จัดการระบบและสินค้า</span>
                                </div>
                            </Link>
                        )}

                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all group mb-2"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <span className="font-medium group-hover:translate-x-1 transition-transform">ข้อมูลส่วนตัว</span>
                        </Link>

                        <Link
                            href="/notifications"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all group mb-2 justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </span>
                                <span className="font-medium group-hover:translate-x-1 transition-transform">การแจ้งเตือน</span>
                            </div>
                            {unreadCount > 0 && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all group mb-1">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            <span className="font-medium group-hover:translate-x-1 transition-transform">การตั้งค่า</span>
                        </button>
                    </div>

                    {/* Footer / Logout */}
                    <div className="p-4 pt-3 border-t border-border bg-muted/20">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setShowLogoutConfirm(true);
                            }}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all group"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-white/20 group-hover:text-white transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </span>
                            <span className="font-bold">ออกจากระบบ</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={() => {
                    setIsLoggingOut(true);
                    // Simulate logout delay for better UX
                    setTimeout(() => {
                        logout();
                    }, 1000);
                }}
                title="ยืนยันการออกจากระบบ"
                message="คุณต้องการออกจากระบบใช่หรือไม่? คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อเข้าถึงบัญชีของคุณ"
            />

            {/* Logout Loading Modal */}
            <LoadingModal isOpen={isLoggingOut} message="กำลังออกจากระบบ..." />
        </div>
    );
}