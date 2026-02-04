'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { useAuth } from './AuthContext';

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string; // เพิ่ม selectedSize ให้รองรับข้อมูลจากการเลือกไซส์
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (productId: number, selectedSize?: string) => void;
    updateQuantity: (productId: number, selectedSize: string | undefined, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    totalAmount: number;
    triggerCartAnimation: (imageSrc: string, startRect: DOMRect) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [flyingImage, setFlyingImage] = useState<{ src: string, startRect: DOMRect, endRect: DOMRect } | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

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

    // Load cart from localStorage whenever user changes (or on mount)
    useEffect(() => {
        // Prevent saving while we are switching users
        setIsInitialized(false);

        const cartKey = user?.id ? `sneakerStore_cart_${user.id}` : 'sneakerStore_cart_guest';
        const savedCart = localStorage.getItem(cartKey);

        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart data:', error);
                setCart([]);
            }
        } else {
            setCart([]);
        }

        // Mark as initialized so the save effect can start working
        setIsInitialized(true);
    }, [user]);

    // Save cart to localStorage whenever it changes, but ONLY after initialization
    useEffect(() => {
        if (!isInitialized) return;

        const cartKey = user?.id ? `sneakerStore_cart_${user.id}` : 'sneakerStore_cart_guest';
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }, [cart, user, isInitialized]);

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

    const removeFromCart = (productId: number, selectedSize?: string) => {
        setCart((prevCart) => prevCart.filter((item) =>
            !(item.id === productId && item.selectedSize === selectedSize)
        ));
    };

    const updateQuantity = (productId: number, selectedSize: string | undefined, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId, selectedSize);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                (item.id === productId && item.selectedSize === selectedSize)
                    ? { ...item, quantity }
                    : item
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
