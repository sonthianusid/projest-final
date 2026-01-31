'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import AlertModal from '@/components/AlertModal';
import PaymentMethodModal, { PaymentMethod } from '@/components/PaymentMethodModal';
import LoadingModal from '@/components/LoadingModal';

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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const { addToCart, triggerCartAnimation } = useCart();
    const { user, wallet } = useAuth();
    const [isAdded, setIsAdded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset image index when product changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [id]);

    useEffect(() => {
        if (product) {
            const saved = localStorage.getItem('favorites');
            if (saved) {
                const favs = JSON.parse(saved);
                setIsFavorite(favs.includes(product.id));
            }
        }
    }, [product]);

    const toggleFavorite = () => {
        if (!product) return;

        const saved = localStorage.getItem('favorites');
        let favs: number[] = saved ? JSON.parse(saved) : [];

        if (isFavorite) {
            favs = favs.filter(id => id !== product.id);
        } else {
            favs.push(product.id);
        }

        localStorage.setItem('favorites', JSON.stringify(favs));
        setIsFavorite(!isFavorite);
    };

    // Fetch product from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();
                if (data.success && data.product) {
                    setProduct(data.product);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        if (!selectedSize) {
            setShowAlert(true);
            return;
        }

        const imgElement = document.getElementById(`product-img-${product.id}`);
        if (imgElement) {
            const rect = imgElement.getBoundingClientRect();
            triggerCartAnimation(product.image_url, rect);
        }

        // Map to the format addToCart expects
        addToCart({
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            originalPrice: product.original_price,
            image: product.image_url,
            isNew: product.is_new,
            selectedSize
        } as any);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            setShowAlert(true);
            return;
        }
        // Open payment modal directly
        setIsPaymentOpen(true);
    };

    const handlePaymentConfirm = (method: PaymentMethod) => {
        if (!product) return;

        setIsPaymentOpen(false); // Close payment modal first
        setIsProcessing(true); // Show loading modal

        // Simulate processing delay
        setTimeout(() => {
            if (method === 'store_credit') {
                wallet.deduct(product.price);
            }

            setIsProcessing(false); // Hide loading modal
            setShowSuccess(true); // Show success alert
        }, 2000);
    };

    const sizes = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11'];

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a]">
                <div className="h-[68px]"></div>
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                        <div className="aspect-square bg-white/5 rounded-3xl animate-pulse"></div>
                        <div className="space-y-6">
                            <div className="h-8 bg-white/10 rounded w-24 animate-pulse"></div>
                            <div className="h-12 bg-white/10 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-white/10 rounded w-1/2 animate-pulse"></div>
                            <div className="h-24 bg-white/5 rounded animate-pulse"></div>
                            <div className="grid grid-cols-4 gap-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-2xl font-bold text-white mb-2">ไม่พบสินค้า</h1>
                    <p className="text-gray-400 mb-6">สินค้าที่คุณค้นหาไม่มีอยู่ในระบบ</p>
                    <Link href="/products" className="btn-primary">
                        กลับไปหน้าสินค้า
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <div className="h-[68px]"></div>

            <AlertModal
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                title="ลืมเลือกไซส์หรือเปล่า?"
                message="กรุณาเลือกไซส์รองเท้าที่คุณต้องการ ก่อนกดเพิ่มลงตะกร้าครับ"
            />
            <br />
            <div className="container mx-auto px-6 py-12">

                {/* Back Button */}
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 group transition-colors"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>กลับไปหน้าสินค้า</span>
                </Link>

                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-8 flex gap-2">
                    <Link href="/" className="hover:text-white">หน้าแรก</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-white">สินค้า</Link>
                    <span>/</span>
                    <span className="text-white">{product.name}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    {/* Image Section */}
                    {/* Added group/image for hover effects on arrows */}
                    <div className="relative aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden flex items-center justify-center p-8 sticky top-24 group/image">
                        {/* Favorite Button */}
                        <button
                            onClick={toggleFavorite}
                            className={`absolute top-6 right-6 z-20 w-12 h-12 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all group ${isFavorite
                                ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-black/30 border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30'
                                }`}
                        >
                            <svg className={`w-6 h-6 transition-transform ${isFavorite ? 'scale-110 fill-current' : 'group-hover:scale-110'}`} fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        {/* Navigation Arrows */}
                        {(() => {
                            // Use images from product data (API) or fallback to single image
                            // product.images comes from the API (product_images table)
                            const productImages = (product as any).images || [];

                            const images = productImages.length > 0
                                ? productImages.map((img: string) => ({ src: img, alt: product.name, style: {} }))
                                : [{ src: product.image_url || 'https://via.placeholder.com/500', alt: 'Front View', style: {} }];

                            // Fallback for Panda if no images in DB yet (OPTIONAL: Keep this temporarily or remove if DB is ready)
                            // If we want to strictly follow "make other items slide like Panda", we should rely on dynamic data.

                            if (images.length === 1 && product.name.toLowerCase().includes('panda')) {
                                images.push(
                                    { src: '/images/panda-left.png', alt: 'Side View (Left)', style: {} },
                                    { src: '/images/panda-right.png', alt: 'Side View (Right)', style: {} }
                                );
                            }

                            const handleNextImage = () => {
                                setCurrentImageIndex((prev) => (prev + 1) % images.length);
                            };

                            const handlePrevImage = () => {
                                setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                            };

                            return (
                                <>
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handlePrevImage(); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all opacity-0 group-hover/image:opacity-100"
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleNextImage(); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all opacity-0 group-hover/image:opacity-100"
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>

                                            {/* Indicators */}
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                                {images.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/30'}`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    <div className="animate-float w-full">
                                        <img
                                            id={`product-img-${product.id}`}
                                            src={images[currentImageIndex].src}
                                            alt={images[currentImageIndex].alt || product.name}
                                            style={images[currentImageIndex].style}
                                            className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-300"
                                        />
                                    </div>
                                </>
                            );
                        })()}

                        {(product.is_new as any) === 1 && (
                            <span className="absolute top-6 left-6 badge bg-green-500 text-white text-lg px-4 py-2">
                                NEW COLLECTION
                            </span>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col h-full justify-center">
                        <div className="mb-2">
                            <span className={`badge ${product.brand === 'nike' ? 'badge-nike' : 'badge-adidas'} mb-4`}>
                                {product.brand?.toUpperCase() || 'BRAND'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-bold gradient-text">฿{product.price?.toLocaleString()}</span>
                            {product.original_price && product.original_price > product.price && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">฿{product.original_price.toLocaleString()}</span>
                                    <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                                        SAVE {Math.round((1 - product.price / product.original_price) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            {product.stock > 0 ? (
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${product.stock < 10 ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-green-500/30 bg-green-500/10 text-green-400'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span className="font-medium">สินค้าในคลัง: {product.stock} ชิ้น</span>
                                </div>
                            ) : (
                                <div className="px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    สินค้าหมด
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {product.description || 'รองเท้าผ้าใบคุณภาพพรีเมียม ดีไซน์ทันสมัย สวมใส่สบาย รองรับทุกการเคลื่อนไหว ผลิตจากวัสดุคุณภาพสูง ทนทานต่อการใช้งาน'}
                            </p>

                            {/* Size Selector */}
                            <div>
                                <h3 className="text-white font-medium mb-3 flex justify-between">
                                    เลือกไซส์
                                    <button className="text-[#667eea] text-sm hover:underline">ตารางไซส์</button>
                                </h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 rounded-xl border transition-all ${selectedSize === size
                                                ? 'border-[#667eea] bg-[#667eea]/10 text-white shadow-[0_0_15px_rgba(102,126,234,0.3)]'
                                                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <br />
                            {/* Actions */}
                            <div className="pt-6 flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2 ${isAdded ? 'bg-green-600' : ''
                                        }`}
                                >
                                    {isAdded ? (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            เพิ่มเรียบร้อย
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            เพิ่มลงตะกร้า
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-orange-500/30 hover:shadow-orange-500/50"
                                    style={{
                                        background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)'
                                    }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    ซื้อเลย
                                </button>
                            </div>
                            <br />

                            {/* Services Icons */}
                            <div className="grid grid-cols-3 gap-4 pt-6">
                                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                    <svg className="w-10 h-10 text-[#667eea] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <p className="text-sm text-white font-medium">จัดส่งฟรี</p>
                                </div>

                                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                    <svg className="w-10 h-10 text-[#667eea] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-white font-medium">ของแท้ 100%</p>
                                </div>

                                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                    <svg className="w-10 h-10 text-[#667eea] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <p className="text-sm text-white font-medium">คืนได้ 30 วัน</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
            </div>
            <br />
            {/* Payment Modal */}
            <PaymentMethodModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onConfirm={handlePaymentConfirm}
                totalAmount={product?.price || 0}
                userBalance={user?.creditBalance || 0}
            />

            {/* Loading Modal */}
            <LoadingModal
                isOpen={isProcessing}
                message="กำลังดำเนินการชำระเงิน..."
            />

            {/* Success Alert - No redirect */}
            <AlertModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="สั่งซื้อสำเร็จ"
                message="ขอบคุณที่สั่งซื้อสินค้ากับเรา สินค้าจะถูกจัดส่งโดยเร็วที่สุด"
                type="success"
            />
        </div>
    );
}