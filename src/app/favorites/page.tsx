'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ScrollReveal';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price: number;
    image_url: string;
    category: string;
    brand: string;
    stock: number;
    is_new: boolean;
}

export default function FavoritesPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('favorites');
        if (saved) {
            setFavoriteIds(JSON.parse(saved));
        }

        if (isAuthenticated && user?.id) {
            fetchUserFavorites();
        } else {
            // If not logged in, we use localStorage IDs to fetch product details
            if (saved) {
                fetchProductDetails(JSON.parse(saved));
            } else {
                setIsLoading(false);
            }
        }
    }, [user, isAuthenticated]);

    const fetchUserFavorites = async () => {
        try {
            const res = await fetch(`/api/favorites?userId=${user?.id}`);
            const data = await res.json();
            if (data.success) {
                setFavoriteIds(data.favorites);
                fetchProductDetails(data.favorites);
            }
        } catch (error) {
            console.error('Failed to fetch favorites');
            setIsLoading(false);
        }
    };

    const fetchProductDetails = async (ids: number[]) => {
        if (ids.length === 0) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                const favProducts = data.products.filter((p: Product) => ids.includes(p.id));
                setProducts(favProducts);
            }
        } catch (error) {
            console.error('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const removeFavorite = async (id: number) => {
        const newIds = favoriteIds.filter(fid => fid !== id);
        setFavoriteIds(newIds);
        setProducts(prev => prev.filter(p => p.id !== id));
        localStorage.setItem('favorites', JSON.stringify(newIds));

        if (isAuthenticated && user?.id) {
            try {
                await fetch('/api/favorites', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId: id })
                });
            } catch (error) {
                console.error('Failed to sync remove favorite');
            }
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden">
            <div className="h-[68px]"></div>

            {/* Decorations */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">รายการ <span className="text-[#667eea]">โปรด</span></h1>
                        <p className="text-gray-400">สินค้าที่คุณถูกใจทั้งหมดรวมอยู่ที่นี่</p>
                    </div>
                    <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors border-b border-white/10 hover:border-white">
                        กลับไปช้อปปิ้ง
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white/[0.02] border border-white/5 rounded-[40px] backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">ไม่มีรายการโปรด</h3>
                        <p className="text-gray-500 mb-8 max-w-xs">ไปเลือกดูสินค้าที่น่าสนใจ และกดหัวใจเพื่อบันทึกไว้ที่นี่ได้เลย!</p>
                        <Link href="/products" className="btn-primary px-8 py-3">สำรวจสินค้า</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <ScrollReveal key={product.id} index={index}>
                                <div className="group relative bg-[#12121a] border border-white/10 rounded-[32px] overflow-hidden hover:border-[#667eea]/50 transition-all duration-500">
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <button
                                            onClick={() => removeFavorite(product.id)}
                                            className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all active:scale-90"
                                            title="ลบออกจากรายการโปรด"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <Link href={`/products/${product.id}`} className="px-6 py-2.5 bg-white text-gray-900 rounded-full font-bold text-sm pointer-events-auto">ดูรายละเอียด</Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-[#667eea] text-xs font-bold uppercase mb-2">{product.brand}</p>
                                        <h3 className="text-white font-bold mb-4 line-clamp-1">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xl font-black text-white">฿{product.price.toLocaleString()}</p>
                                            <Link href={`/products/${product.id}`} className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#667eea] hover:text-white transition-all">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
