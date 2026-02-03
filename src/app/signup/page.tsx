'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/AlertModal';
import LoadingModal from '@/components/LoadingModal';
import AddressForm from '@/components/AddressForm';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !username || !password || !email || !phone || !address) return;

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
            setIsErrorOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            const success = await register({
                username,
                password,
                name,
                email,
                phone,
                address,
            });
            setIsLoading(false);

            if (success) {
                setIsSuccessOpen(true);
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setErrorMessage('ข้อมูลบางอย่าง (อีเมลหรือเบอร์โทร) ถูกใช้งานไปแล้ว');
                setIsErrorOpen(true);
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('เกิดข้อผิดพลาดในการสมัครสมาชิก');
            setIsErrorOpen(true);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-[#0a0a0f] text-white overflow-hidden">

            {/* ----- Left Side: Signup Form ----- */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#0a0a0f] relative overflow-y-auto no-scrollbar order-1">
                <div className="w-full max-w-[450px] space-y-8 relative z-10 py-10">
                    <br />
                    <br />
                    <br />
                    <br />
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">สร้างบัญชี</h1>
                        <p className="text-gray-400 text-sm font-light">สร้างบัญชีของคุณเพื่อเข้าถึงประสบการณ์พิเศษ</p>
                    </div>
                    <br />
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-6">
                        {/* Name Input */}
                        <div className="relative z-0 w-full group">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-8"
                                placeholder=" "
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="name" className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6 cursor-text">
                                ชื่อ-นามสกุล
                            </label>
                            <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                        </div>

                        {/* Username Input */}
                        <div className="relative z-0 w-full group">
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-8"
                                placeholder=" "
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="username" className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6 cursor-text">
                                ชื่อผู้ใช้ (Username)
                            </label>
                            <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="relative z-0 w-full group">
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-8"
                                placeholder=" "
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <label htmlFor="phone" className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6 cursor-text">
                                เบอร์โทรศัพท์
                            </label>
                            <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                        </div>

                        {/* Address Input (Cascading Dropdown) */}
                        <div className="relative z-0 w-full group">
                            <AddressForm onAddressChange={setAddress} />
                            <input
                                type="text"
                                value={address || ""}
                                required
                                className="opacity-0 absolute w-0 h-0"
                                readOnly
                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('กรุณากรอกที่อยู่ให้ครบถ้วน')}
                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative z-0 w-full group">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-8"
                                placeholder=" "
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email" className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6 cursor-text">
                                อีเมล
                            </label>
                            <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="relative z-0 w-full group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-16"
                                placeholder=" "
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password" className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6 cursor-text">
                                รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
                            </label>

                            {/* Toggle Password Visibility Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-8 top-0 z-10 text-gray-500 hover:text-indigo-400 transition-colors duration-300 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>

                            <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative z-0 w-full group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-16"
                                placeholder=" "
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label htmlFor="confirmPassword" className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400 scale-75 -translate-y-6 cursor-text">
                                ยืนยันรหัสผ่าน
                            </label>

                            {/* Toggle Confirm Password Visibility Button */}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-8 top-0 z-10 text-gray-500 hover:text-indigo-400 transition-colors duration-300 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>

                            <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold rounded-[2rem]
                                transition-all duration-500 transform hover:scale-[1.02]
                                hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.7)] hover:brightness-110
                                hover:from-indigo-500 hover:to-purple-500
                                active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group shadow-xl shadow-indigo-500/20 mt-4"
                        >
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                            {isLoading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
                        </button>

                        <p className="text-center text-gray-500 text-sm mt-6">
                            มีบัญชีอยู่แล้วใช่ไหม?{' '}
                            <Link href="/login" className="font-bold text-white hover:text-indigo-400 transition-colors ml-1 hover:underline">
                                เข้าสู่ระบบที่นี่
                            </Link>
                        </p>
                    </form>
                    <br />
                    <br />
                </div>
            </div>

            {/* ----- Right Side: Graphics ----- */}
            <div className="hidden lg:flex relative items-center justify-center bg-indigo-950/30 overflow-hidden order-2">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-[#0a0a0f] z-10" />

                <div className="relative z-30 p-12 text-center">
                    <div className="mb-8 inline-flex p-5 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20">
                        <svg className="w-20 h-20 text-indigo-400 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tight mb-6 text-white drop-shadow-sm">
                        สร้างบัญชี<span className="text-indigo-400">ของคุณ</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-md mx-auto font-light leading-relaxed">
                        เริ่มการเดินทางใหม่ของคุณกับเราวันนี้ สมัครสมาชิกเพื่อรับสิทธิพิเศษและบริการที่ดีที่สุด
                    </p>
                </div>
            </div>

            {/* Modals */}
            <LoadingModal isOpen={isLoading} message="กำลังสร้างบัญชีของคุณ..." />
            <AlertModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} title="สมัครสมาชิกไม่สำเร็จ" message={errorMessage} type="error" />
            <AlertModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} title="สมัครสมาชิกสำเร็จ" message="ยินดีต้อนรับสู่ SonthiShop บัญชีของคุณถูกสร้างเรียบร้อยแล้ว" type="success" />
        </div >
    );
}
