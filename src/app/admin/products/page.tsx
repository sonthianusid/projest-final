'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { allProducts as initialProducts, Product } from '@/data/products';
import AlertModal from '@/components/AlertModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminProducts() {
    const { isAdmin, isAuthenticated } = useAuth();
    const router = useRouter();
    const [productList, setProductList] = useState<Product[]>([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        // Load products from localStorage or use initial data
        const storedProducts = localStorage.getItem('admin_products');
        if (storedProducts) {
            setProductList(JSON.parse(storedProducts));
        } else {
            setProductList(initialProducts);
            localStorage.setItem('admin_products', JSON.stringify(initialProducts));
        }
    }, [isAuthenticated, isAdmin, router]);

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            const updatedProducts = productList.filter(p => p.id !== deleteId);
            setProductList(updatedProducts);
            localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
            setAlertMessage('ลบสินค้าเรียบร้อยแล้ว');
            setAlertType('success');
            setIsAlertOpen(true);
        }
        setIsConfirmOpen(false);
        setDeleteId(null);
    };

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border-b border-white/5">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">จัดการสินค้า</h1>
                            <p className="text-gray-400 mt-1">เพิ่ม ลบ แก้ไขสินค้าในร้าน</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/admin"
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                            >
                                ← กลับ
                            </Link>
                            <button
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-400 hover:to-indigo-500 transition-all"
                            >
                                + เพิ่มสินค้า
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Products Table */}
                <div className="bg-white/5 backdrop-blur-sm rounded-none border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">สินค้า</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">หมวดหมู่</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">ราคา</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">สถานะ</th>
                                    <th className="text-right px-6 py-4 text-gray-400 font-medium">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.map((product) => (
                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-white/5 text-gray-300 text-sm">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium">฿{product.price.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isNew ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {product.isNew ? 'ใหม่' : 'ปกติ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={alertType === 'success' ? 'สำเร็จ' : 'เกิดข้อผิดพลาด'}
                message={alertMessage}
                type={alertType}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="ยืนยันการลบ"
                message="คุณต้องการลบสินค้านี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้"
            />
        </div>
    );
}
