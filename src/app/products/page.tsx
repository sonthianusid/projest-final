'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
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

const categories = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'วิ่ง', label: 'วิ่ง' },
    { key: 'ไลฟ์สไตล์', label: 'ไลฟ์สไตล์' },
    { key: 'บาสเก็ตบอล', label: 'บาสเก็ตบอล' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // default to newest
    const { user, isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        // 1. Initial Load from localStorage
        const saved = localStorage.getItem('favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }

        // 2. If logged in, sync from DB
        if (isAuthenticated && user?.id) {
            fetchUserFavorites();
        }
    }, [user, isAuthenticated]);

    const fetchUserFavorites = async () => {
        try {
            const res = await fetch(`/api/favorites?userId=${user?.id}`);
            const data = await res.json();
            if (data.success) {
                setFavorites(data.favorites);
                // Also update localStorage to keep them in sync
                localStorage.setItem('favorites', JSON.stringify(data.favorites));
            }
        } catch (error) {
            console.error('Failed to fetch favorites from DB');
        }
    };

    const toggleFavorite = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();

        const isCurrentlyFav = favorites.includes(id);
        const newFavorites = isCurrentlyFav
            ? favorites.filter(fid => fid !== id)
            : [...favorites, id];

        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));

        if (isAuthenticated && user?.id) {
            try {
                await fetch('/api/favorites', {
                    method: isCurrentlyFav ? 'DELETE' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId: id })
                });
            } catch (error) {
                console.error('Failed to sync favorite with DB');
            }
        }
    };

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter and Sort products
    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter((product) => {
            const productCategory = product.category ? product.category.toLowerCase() : '';
            const productBrand = product.brand ? product.brand.toLowerCase() : '';
            const filterCategory = selectedCategory.toLowerCase();
            const filterBrand = selectedBrand.toLowerCase();

            const matchesCategory = selectedCategory === 'all' || productCategory === filterCategory;
            const matchesBrand = selectedBrand === 'all' || productBrand === filterBrand;
            return matchesCategory && matchesBrand;
        });

        // Sorting Logic
        return result.sort((a, b) => {
            switch (sortBy) {
                case 'favorites':
                    // Sort favorites to top
                    const aFav = favorites.includes(a.id) ? 1 : 0;
                    const bFav = favorites.includes(b.id) ? 1 : 0;
                    if (aFav !== bFav) return bFav - aFav; // Higher priority (1) comes first
                    // If both are favorites or both are not, maintain original order or secondary sort
                    return 0; // Or add a secondary sort here, e.g., by newest
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                case 'discount':
                    const aDiscount = a.original_price && a.original_price > a.price ? (a.original_price - a.price) / a.original_price : 0;
                    const bDiscount = b.original_price && b.original_price > b.price ? (b.original_price - b.price) / b.original_price : 0;
                    return bDiscount - aDiscount; // Higher discount first
                case 'newest':
                default:
                    // Priority: is_new, then id descending
                    if ((a.is_new as any) == (b.is_new as any)) return b.id - a.id;
                    return ((b.is_new as any) || 0) - ((a.is_new as any) || 0);
            }
        });
    }, [products, selectedCategory, selectedBrand, sortBy, favorites]);

    const getCategoryLabel = (key: string) => categories.find(c => c.key === key)?.label || key;

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="h-[68px]"></div>
                <section className="py-6 border-b border-white/5">
                    <div className="container mx-auto px-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-white/10 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-24"></div>
                        </div>
                    </div>
                </section>
                <section className="py-8">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-square bg-white/5 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                                    <div className="h-6 bg-white/10 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Spacer for navbar */}
            <div className="h-[68px]"></div>

            {/* Simple Header */}
            <section className="py-6 border-b border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <br />
                            <h1 className="text-2xl font-bold text-white">สินค้า</h1>
                            <p className="text-gray-500 text-sm mt-1">{filteredAndSortedProducts.length} รายการ</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Sort Dropdown */}
                            {/* Sort Dropdown */}
                            <div className="relative group/select">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none text-white text-sm font-bold outline-none transition-all cursor-pointer min-w-[140px] text-left"
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '0',
                                        padding: '8px 32px 8px 8px',
                                        backgroundImage: 'none'
                                    }}
                                >
                                    <option value="newest" className="bg-[#1a1a2e]">มาใหม่</option>
                                    <option value="favorites" className="bg-[#1a1a2e]">รายการโปรด</option>
                                    <option value="price_asc" className="bg-[#1a1a2e]">ราคาต่ำ - สูง</option>
                                    <option value="price_desc" className="bg-[#1a1a2e]">ราคาสูง - ต่ำ</option>
                                    <option value="discount" className="bg-[#1a1a2e]">ส่วนลดมากสุด</option>
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white group-hover/select:text-[#667eea] transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            <div className="relative group/select">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none text-white text-sm font-bold outline-none transition-all cursor-pointer min-w-[140px] text-left"
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '0',
                                        padding: '8px 32px 8px 8px',
                                        backgroundImage: 'none'
                                    }}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.key} value={cat.key} className="bg-[#1a1a2e]">{cat.label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white group-hover/select:text-[#667eea] transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            <div className="relative group/select">
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="appearance-none text-white text-sm font-bold outline-none transition-all cursor-pointer min-w-[140px] text-left"
                                    style={{
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '0',
                                        padding: '8px 32px 8px 8px',
                                        backgroundImage: 'none'
                                    }}
                                >
                                    <option value="all" className="bg-[#1a1a2e]">แบรนด์ทั้งหมด</option>
                                    <option value="nike" className="bg-[#1a1a2e]">Nike</option>
                                    <option value="adidas" className="bg-[#1a1a2e]">Adidas</option>
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white group-hover/select:text-[#667eea] transition-colors">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
            </section>

            {/* Products Grid */}
            <section className="py-8">
                <br />
                <div className="container mx-auto px-6">
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-5xl mb-4">😔</div>
                            <p className="text-gray-400 mb-4">ไม่พบสินค้า</p>
                            <button
                                onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }}
                                className="text-[#667eea] hover:underline text-sm"
                            >
                                ดูสินค้าทั้งหมด
                            </button>
                        </div>
                    ) : (
                        <div key={`${sortBy}-${selectedCategory}-${selectedBrand}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedProducts.map((product, index) => (
                                <ScrollReveal key={product.id} index={index}>
                                    <div className="card group h-full">
                                        <div className="relative aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-hidden">
                                            {/* Badges */}
                                            {/* Heart Button (Top Left) */}
                                            <button
                                                onClick={(e) => toggleFavorite(e, product.id)}
                                                className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-95 group ${favorites.includes(product.id)
                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                                    : 'bg-black/20 text-white hover:bg-red-500 hover:text-white'
                                                    }`}
                                            >
                                                <svg className={`w-5 h-5 transition-transform ${favorites.includes(product.id) ? 'scale-110 fill-current' : 'group-hover:scale-110'}`} fill={favorites.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>

                                            {/* Badges Group (Bottom Left) -> Brand, New, Discount */}
                                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 z-10 max-w-[80%]">
                                                <span className={`badge ${product.brand === 'nike' ? 'badge-nike' : 'badge-adidas'}`}>
                                                    {product.brand?.toUpperCase() || 'BRAND'}
                                                </span>
                                                {(product.is_new as any) === 1 && <span className="badge bg-green-500 text-white">ใหม่</span>}
                                                {product.original_price && product.original_price > product.price && (
                                                    <span className="badge bg-red-500 text-white">
                                                        -{Math.round((1 - product.price / product.original_price) * 100)}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Image */}
                                            <img
                                                src={product.image_url || 'https://via.placeholder.com/500'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Link href={`/products/${product.id}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:bg-[#667eea] hover:text-white relative tooltip-container">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 tooltip-text transition-opacity whitespace-nowrap pointer-events-none">
                                                        ดูรายละเอียด
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <p className="text-[#667eea] text-xs font-medium mb-1">{getCategoryLabel(product.category)}</p>
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="text-white font-medium mb-3 group-hover:text-[#667eea] transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="mb-4">
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <span className="text-xl font-bold text-white">฿{product.price.toLocaleString()}</span>
                                                    {product.original_price && product.original_price > product.price && (
                                                        <span className="text-gray-500 line-through text-sm">฿{product.original_price.toLocaleString()}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 text-xs">
                                                    {product.stock > 0 ? (
                                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${product.stock < 10 ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-green-500/30 bg-green-500/10 text-green-400'}`}>
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                            <span>เหลือ {product.stock} ชิ้น</span>
                                                        </div>
                                                    ) : (
                                                        <div className="px-2 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            สินค้าหมด
                                                        </div>
                                                    )}
                                                </div>
                                                <br />
                                            </div>
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="block w-full btn-primary py-2.5 text-sm text-center active:scale-95 transition-transform"
                                            >
                                                เลือกไซส์
                                            </Link>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
                <br />
            </section>
        </div>
    );
}
