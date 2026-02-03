'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface Product {
  id: number;
  name: string;
  price: number;
  original_price: number;
  image_url: string;
  brand: string;
  stock: number;
}

const services = [
  {
    icon: (
      <svg className="w-12 h-12 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: 'จัดส่งฟรี',
    desc: 'สำหรับคำสั่งซื้อ ฿2,000 ขึ้นไป'
  },
  {
    icon: (
      <svg className="w-12 h-12 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'สินค้าแท้ 100%',
    desc: 'รับประกันทุกชิ้นที่จำหน่าย'
  },
  {
    icon: (
      <svg className="w-12 h-12 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'คืนได้ 30 วัน',
    desc: 'ไม่พอใจยินดีคืนเงิน'
  },
  {
    icon: (
      <svg className="w-12 h-12 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'ชำระเงินปลอดภัย',
    desc: 'เข้ารหัส SSL ปลอดภัยสูงสุด'
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          // Get first 4 products
          setFeaturedProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="h-[68px]"></div>

      {/* Hero Section */}
      <section className="hero-bg min-h-[85vh] flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <ScrollReveal className="space-y-8">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                รองเท้าผ้าใบ
                <span className="gradient-text block mt-2">คุณภาพพรีเมียม</span>
              </h1>

              <p className="text-gray-400 text-lg max-w-md leading-relaxed mt-2">
                ค้นพบรองเท้าผ้าใบ Nike และ Adidas รุ่นล่าสุด สินค้าแท้ 100% พร้อมจัดส่งทั่วประเทศ
              </p>
              <br />
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary inline-flex items-center gap-2 group">
                  <span>ดูสินค้าทั้งหมด</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/about" className="btn-secondary">เกี่ยวกับเรา</Link>
              </div>
              <br />
              <div className="flex gap-10 pt-6">
                {[
                  { value: '500+', label: 'สินค้า' },
                  { value: '10K+', label: 'ลูกค้า' },
                  { value: '99%', label: 'พึงพอใจ' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <ScrollReveal index={2}>
                <div className="animate-float">
                  <div className="w-full aspect-square max-w-lg mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
                      alt="รองเท้าผ้าใบ"
                      className="w-[80%] object-contain transform -rotate-12 hover:rotate-0 transition-transform duration-700"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pt-20 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <ScrollReveal>
              <br />
              <h2 className="text-3xl font-bold text-white">สินค้าแนะนำ</h2>
              <p className="text-gray-400 mt-3">รองเท้าผ้าใบยอดนิยม</p>
              <br />
            </ScrollReveal>
          </div>

          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-white/5 rounded-xl mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ScrollReveal key={product.id} index={index}>
                  <div className="card group h-full">
                    <div className="relative aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-hidden">
                      <span className={`badge absolute top-4 left-4 z-10 ${product.brand === 'nike' ? 'badge-nike' : 'badge-adidas'}`}>
                        {product.brand?.toUpperCase() || 'BRAND'}
                      </span>
                      <img
                        src={product.image_url || 'https://via.placeholder.com/500'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link href={`/products/${product.id}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:bg-[#667eea] hover:text-white relative tooltip-container">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-medium mb-3 group-hover:text-[#667eea] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xl font-bold text-white">฿{product.price?.toLocaleString()}</span>
                          {product.original_price && product.original_price > product.price && (
                            <>
                              <span className="text-gray-500 line-through text-sm ml-1">฿{product.original_price.toLocaleString()}</span>
                              <span className="text-green-400 text-xs font-medium ml-2">
                                -{Math.round((1 - product.price / product.original_price) * 100)}%
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {product.stock > 0 ? (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${product.stock < 10 ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-green-500/30 bg-green-500/10 text-green-400'}`}>
                              <span>เหลือ {product.stock} ชิ้น</span>
                            </div>
                          ) : (
                            <div className="px-2 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold">
                              สินค้าหมด
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
              <br />
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="pt-32 pb-24 bg-[#0d0d1a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <ScrollReveal>

              <br />
              <h2 className="text-3xl font-bold text-white">บริการของเรา</h2>
              <p className="text-gray-400 mt-3">ทำไมต้องเลือกซื้อกับเรา</p>
              <br />

            </ScrollReveal>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} index={index}>
                <div className="glass rounded-xl p-10 text-center hover:scale-105 transition-transform group h-full">
                  <div className="mb-6 flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.desc}</p>
                </div>
              </ScrollReveal>
            ))}
            <br />
          </div>
        </div>
      </section>
    </div>
  );
}