'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from '@/components/ProfileDropdown';
import WalletModal from '@/components/WalletModal';
import { useSound } from '@/hooks/useSound';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  // ... (State เดิมยังคงอยู่) ...
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { playSound } = useSound();

  // ... (Effect เดิมยังคงอยู่) ...

  // ลบ useEffect สำหรับ handleClickOutside ของ Profile อันเก่าออกได้เลยครับ เพราะย้ายไปใน Component ใหม่แล้ว

  const navLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/products', label: 'สินค้า' },
    { href: '/about', label: 'เกี่ยวกับเรา' },
    { href: '/contact', label: 'ติดต่อ' },
  ];

  return (
    <nav
      style={{ ['--navbar-height' as any]: '68px' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Solid Background with Blur */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-xl border-b border-border"></div>

      <div className="relative container mx-auto px-6">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* ... (Logo content เดิม) ... */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10c.5 1.5 1.5 3.5 1.5 6 0 3-2 5-6 5s-6-2-6-5c0-2.5 1-4.5 1.5-6m9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3-1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12c-1.5 0-2.5 2-2.5 3.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-3.5-2.5-3.5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Sonthi<span className="text-[#667eea]">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover', 0.2)}
                className={`px-4 py-2 font-medium transition-all relative nav-link ${pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            {/* Admin Dashboard Button - Only for Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => playSound('click')}
                onMouseEnter={() => playSound('hover', 0.2)}
                className="relative group p-2"
                title="แดชบอร์ด"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all duration-300">
                  <svg
                    className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={() => { playSound('click'); setIsWalletOpen(true); }}
                onMouseEnter={() => playSound('hover', 0.2)}
                className="hidden md:flex items-center gap-2 mr-6 px-1 py-1 border-b-2 border-white/10 hover:border-indigo-300 transition-all group"
              >
                <div className="text-indigo-300 group-hover:text-indigo-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-purple-200 transition-all">
                    ฿{user?.creditBalance?.toLocaleString() || '0'}
                  </span>
                </div>
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <Link
              href="/cart"
              id="cart-icon-target"
              onClick={() => playSound('pop')}
              onMouseEnter={() => playSound('hover', 0.2)}
              className="relative group p-2 mr-2"
            >
              {/* ... (Cart Icon content เดิม) ... */}
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(102,126,234,0.3)]">
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300 group-hover:scale-110 transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>

              {cartCount > 0 && (
                <div className="absolute top-0 right-0">
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-pink-500 to-violet-500 items-center justify-center text-[10px] text-white font-bold border-2 border-[#050505]">
                      {cartCount}
                    </span>
                  </span>
                </div>
              )}
            </Link>

            {/* [2. ส่วน Profile ใหม่] */}
            {/* User Auth (Desktop) */}
            <div className="hidden sm:flex items-center relative">
              {isAuthenticated ? (
                // ใช้ Component ใหม่ตรงนี้
                <ProfileDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => playSound('click')}
                    onMouseEnter={() => playSound('hover', 0.2)}
                    className="relative px-5 py-2.5 font-bold text-white/70 hover:text-white transition-all duration-300 group overflow-hidden"
                  >
                    <span className="relative z-10">เข้าสู่ระบบ</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Btn */}
            <button
              className="md:hidden p-2.5 text-white hover:bg-white/5 rounded-lg"
              onClick={() => {
                playSound('click');
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {/* ... (Mobile Icon content เดิม) ... */}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (คงเดิม) */}
        {isMobileMenuOpen && (
          // ... (Mobile Menu Content เดิม) ...
          <div className="md:hidden py-4 border-t border-white/10">
            {isAuthenticated && (
              <div className="flex items-center justify-between px-4 py-3 mb-2 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{user?.name}</span>
                    <span className="text-purple-400 text-xs font-bold">฿{user?.creditBalance?.toLocaleString() || '0'}</span>
                  </div>
                </div>
                <button onClick={logout} className="text-red-400 text-sm font-medium">
                  ออกจากระบบ
                </button>
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg font-medium ${pathname === link.href
                    ? 'text-white bg-white/5'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg font-medium text-white/60 hover:text-white hover:bg-white/5"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href="/products"
                className="btn-primary w-full text-center block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ช้อปเลย
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </nav>
  );
}

// Export WalletModal trigger hook
export function useWalletModal() {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}