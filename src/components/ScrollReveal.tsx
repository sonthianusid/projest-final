'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    index?: number; // ใช้สำหรับคำนวณ Delay ให้ขึ้นมาทีละชิ้น
    className?: string;
}

export default function ScrollReveal({ children, index = 0, className = "" }: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // เมื่อ element โผล่เข้ามาในหน้าจอประมาณ 10%
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // เลิกจับตาดูเมื่อแสดงผลแล้ว (เพื่อให้เล่นรอบเดียว)
                }
            },
            {
                threshold: 0.1, // 0.1 หมายถึงเห็น 10% ของ object ก็ให้เริ่มทำงาน
                rootMargin: '50px', // เผื่อระยะนิดหน่อย
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    // คำนวณ Delay: แถวละ 3-4 ชิ้น ก็จะหน่วงเวลาไล่กันไป (0ms, 100ms, 200ms, ...)
    // ใช้ % 4 เพื่อให้มันรีเซ็ต Delay ทุกๆ 4 ชิ้น ไม่ให้นานเกินไปถ้ารายการเยอะ
    const delay = (index % 4) * 100;

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-700 ease-out transform ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20' // เริ่มต้น: จางและอยู่ต่ำกว่าปกติ 20px
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}