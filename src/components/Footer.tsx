import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#0d0d1a] border-t border-white/5">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <svg className="w-5 h-5 text-[#667eea]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10c.5 1.5 1.5 3.5 1.5 6 0 3-2 5-6 5s-6-2-6-5c0-2.5 1-4.5 1.5-6m9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3-1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12c-1.5 0-2.5 2-2.5 3.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-3.5-2.5-3.5z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">
                            Sonthi<span className="text-[#667eea]">Shop</span>
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-8">
                        <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">หน้าแรก</Link>
                        <Link href="/products" className="text-gray-400 hover:text-white text-sm transition-colors">สินค้า</Link>
                        <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">เกี่ยวกับเรา</Link>
                        <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">ติดต่อ</Link>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/5">
                <div className="container mx-auto px-6 py-4">
                    <p className="text-gray-500 text-sm text-center">
                        © 2026 SonthiShop. สงวนลิขสิทธิ์ทุกประการ
                    </p>
                </div>
            </div>
        </footer>
    );
}