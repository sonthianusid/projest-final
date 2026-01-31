'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string; // เพิ่ม selectedSize ให้รองรับข้อมูลจากการเลือกไซส์
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    totalAmount: number;
    triggerCartAnimation: (imageSrc: string, startRect: DOMRect) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [flyingImage, setFlyingImage] = useState<{ src: string, startRect: DOMRect, endRect: DOMRect } | null>(null);

    const triggerCartAnimation = (imageSrc: string, startRect: DOMRect) => {
        const cartIcon = document.getElementById('cart-icon-target');
        if (cartIcon) {
            const endRect = cartIcon.getBoundingClientRect();
            setFlyingImage({ src: imageSrc, startRect, endRect });

            setTimeout(() => {
                setFlyingImage(null);
            }, 800); // Animation duration
        }
    };

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('sneakerStore_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart data:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sneakerStore_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            // เช็คทั้ง ID และ Size (ถ้าสินค้าคนละไซส์ ควรแยกแถวกัน)
            const existingItem = prevCart.find((item) =>
                item.id === product.id && item.selectedSize === product.selectedSize
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    (item.id === product.id && item.selectedSize === product.selectedSize)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalAmount, triggerCartAnimation }}>
            {children}
            {flyingImage && (
                <img
                    src={flyingImage.src}
                    className="fixed z-[9999] pointer-events-none rounded-full object-cover shadow-2xl animate-fly-to-cart"
                    style={{
                        top: flyingImage.startRect.top,
                        left: flyingImage.startRect.left,
                        width: flyingImage.startRect.width,
                        height: flyingImage.startRect.height,
                        // --- แก้ไขการคำนวณพิกัด (Center to Center) ---
                        '--target-x': `${(flyingImage.endRect.left + flyingImage.endRect.width / 2) - (flyingImage.startRect.left + flyingImage.startRect.width / 2)}px`,
                        '--target-y': `${(flyingImage.endRect.top + flyingImage.endRect.height / 2) - (flyingImage.startRect.top + flyingImage.startRect.height / 2)}px`,
                        // ------------------------------------------
                    } as React.CSSProperties}
                />
            )}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}