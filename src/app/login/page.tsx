'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/AlertModal';
import LoadingModal from '@/components/LoadingModal';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
            setIsErrorOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            const success = await login(username, password);
            setIsLoading(false);

            if (success) {
                setIsSuccessOpen(true);
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง');
                setIsErrorOpen(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาตรวจสอบว่า XAMPP MySQL เปิดอยู่');
            setIsErrorOpen(true);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-background text-foreground overflow-hidden">
            {/* ----- Left Column (Graphics) ----- */}
            <div className="hidden lg:flex relative items-center justify-center bg-indigo-950/30 overflow-hidden animate-graphics-from-left">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-[#0a0a0f] z-10" />

                {/* Decorative Circles */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000" />

                <div className="relative z-30 p-12 text-center">
                    <div className="mb-8 inline-flex p-5 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20">
                        <svg className="w-20 h-20 text-indigo-400 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h2 className="text-5xl font-bold tracking-tight mb-6 text-white drop-shadow-sm">เข้าสู่<span className="text-indigo-400">ระบบ</span></h2>
                    <p className="text-lg text-gray-400 max-w-md mx-auto font-light leading-relaxed">เข้าสู่ระบบเพื่อจัดการคิวและรับการแจ้งเตือนแบบเรียลไทม์</p>
                </div>
            </div>

            {/* ----- Right Column (Login Form) ----- */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background relative animate-slide-from-right">
                {/* Mobile Glow */}
                <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />

                <div className="w-full max-w-[400px] space-y-10 relative z-10">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">เข้าสู่ระบบ</h1>
                        <p className="text-gray-400 text-sm font-light">กรุณาเข้าสู่ระบบด้วยบัญชีของคุณ</p>
                    </div>
                    <br />
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
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
                                <label
                                    htmlFor="username"
                                    className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                                    peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400
                                    scale-75 -translate-y-6 cursor-text"
                                >
                                    ชื่อผู้ใช้ / อีเมลล์ / เบอร์โทรศัพท์
                                </label>
                                <div className="absolute right-0 top-0 z-10 text-gray-500 peer-focus:text-indigo-500 transition-colors duration-300 pointer-events-none">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <br />
                            {/* Password Input */}
                            <div className="relative z-0 w-full group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    className="block py-3 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-gray-700 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-500 peer transition-colors duration-300 pr-16"
                                    placeholder=" "
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute text-base text-gray-400 duration-300 transform top-0 origin-[0] -z-10
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                                    peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-indigo-400
                                    scale-75 -translate-y-6 cursor-text"
                                >
                                    รหัสผ่าน
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
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <br />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold rounded-[2rem]
                                transition-all duration-500 transform hover:scale-[1.02] 
                                hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.7)] hover:brightness-110
                                hover:from-indigo-500 hover:to-purple-500
                                active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group shadow-xl shadow-indigo-500/20"
                        >
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />

                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-lg">กำลังเข้าสู่ระบบ...</span>
                                </div>
                            ) : (
                                'เข้าสู่ระบบ'
                            )}
                        </button>



                        <p className="text-center text-gray-500 text-sm">
                            ยังไม่มีบัญชีใช่ไหม?{' '}
                            <Link href="/signup" className="font-bold text-white hover:text-indigo-400 transition-colors ml-1 hover:underline">
                                สมัครสมาชิกเลย

                            </Link>
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"> ลืมรหัสผ่าน?</a>
                        </p>
                    </form>
                </div>
            </div>

            {/* Modals */}
            <LoadingModal isOpen={isLoading} message="กำลังเข้าสู่ระบบ..." />

            <AlertModal
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                title="เข้าสู่ระบบไม่สำเร็จ"
                message={errorMessage}
                type="error"
            />

            <AlertModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                title="เข้าสู่ระบบสำเร็จ"
                message="ยินดีต้อนรับกลับเข้าสู่ระบบ SonthiShop"
                type="success"
            />
        </div>
    );
}