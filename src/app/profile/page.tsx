'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/AlertModal';
import AddressForm from '@/components/AddressForm';

export default function ProfilePage() {
    const { user, isAuthenticated, updateProfile } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user, isAuthenticated, router]);

    const handleBack = () => {
        router.back();
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            setAlertMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            setAlertType('error');
            setIsAlertOpen(true);
            return;
        }

        if (updateProfile) {
            updateProfile(formData).then(success => {
                if (success) {
                    setAlertMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
                    setAlertType('success');
                    setIsAlertOpen(true);
                    setIsEditing(false);
                } else {
                    setAlertMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
                    setAlertType('error');
                    setIsAlertOpen(true);
                }
            });
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone || '',
                address: user.address || ''
            });
        }
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f17] to-[#0a0a0a] relative overflow-hidden">
            <div className="h-[68px]"></div>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-5 mb-10">
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">จัดการข้อมูลส่วนตัว</h1>
                        <p className="text-sm text-gray-400 mt-1">จัดการข้อมูลบัญชีและการตั้งค่าของคุณ</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-[#12121a]/90 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl backdrop-blur-xl">
                    {/* Avatar Section */}
                    <div className="relative bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#12121a] p-10 border-b border-white/5">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="absolute -inset-1.5 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-full opacity-60 blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-2xl relative">
                                    <div className="w-full h-full rounded-full bg-[#12121a] flex items-center justify-center">
                                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-300">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Edit Avatar Button */}
                                <button className="absolute bottom-0 right-0 w-9 h-9 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-3 border-[#12121a]">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>

                            {/* User Info */}
                            <h2 className="text-2xl font-bold text-white mt-5">{user.name}</h2>
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase mt-3 ${user.role === 'admin' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/30' : 'bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/10 text-[#a78bfa] border border-[#667eea]/30'}`}>
                                {user.role === 'admin' ? 'Admin' : 'Member'}
                            </span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 md:p-10 space-y-7">
                        {/* Username (Read-only) */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-3 ml-1 uppercase tracking-wider">ชื่อผู้ใช้ (Username)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.username}
                                    disabled
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed font-medium"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-700/30 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-3 ml-1 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-5 py-4 bg-black/30 border rounded-xl transition-all duration-300 font-medium ${isEditing ? 'border-white/20 text-white focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 hover:border-white/30' : 'border-white/5 text-white/50 cursor-not-allowed'}`}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-3 ml-1 uppercase tracking-wider">อีเมล</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-5 py-4 bg-black/30 border rounded-xl transition-all duration-300 font-medium ${isEditing ? 'border-white/20 text-white focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 hover:border-white/30' : 'border-white/5 text-white/50 cursor-not-allowed'}`}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-3 ml-1 uppercase tracking-wider">เบอร์โทรศัพท์</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={!isEditing}
                                className={`w-full px-5 py-4 bg-black/30 border rounded-xl transition-all duration-300 font-medium ${isEditing ? 'border-white/20 text-white focus:outline-none focus:border-[#667eea]/50 focus:ring-4 focus:ring-[#667eea]/10 hover:border-white/30' : 'border-white/5 text-white/50 cursor-not-allowed'}`}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-3 ml-1 uppercase tracking-wider">ที่อยู่จัดส่ง</label>
                            {isEditing ? (
                                <AddressForm
                                    onAddressChange={(addr) => setFormData(prev => ({ ...prev, address: addr }))}
                                    initialAddress={formData.address}
                                />
                            ) : (
                                <textarea
                                    value={formData.address}
                                    disabled
                                    rows={2}
                                    className="w-full px-5 py-4 bg-black/30 border border-white/5 rounded-xl text-white/50 cursor-not-allowed resize-none font-medium"
                                />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-[0_0_25px_-8px_rgba(102,126,234,0.5)] hover:shadow-[0_0_35px_-8px_rgba(102,126,234,0.6)] transition-all hover:scale-[1.02]"
                                >
                                    แก้ไขข้อมูล
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 px-6 py-4 bg-white/5 text-gray-300 rounded-xl font-medium hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 px-6 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-bold shadow-[0_0_25px_-8px_rgba(102,126,234,0.5)] hover:shadow-[0_0_35px_-8px_rgba(102,126,234,0.6)] transition-all hover:scale-[1.02]"
                                    >
                                        บันทึก
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={alertType === 'success' ? 'สำเร็จ' : 'เกิดข้อผิดพลาด'}
                message={alertMessage}
                type={alertType}
            />
        </div>
    );
}
