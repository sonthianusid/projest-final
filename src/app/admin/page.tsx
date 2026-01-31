'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { allProducts, Product } from '@/data/products';
import AlertModal from '@/components/AlertModal';
import ConfirmModal from '@/components/ConfirmModal';

type TabType = 'dashboard' | 'products' | 'orders' | 'sales' | 'users';

interface Order {
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { isAdmin, isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // State สำหรับ Modal และ Alert
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: '', price: '', image: '' });

    // State สำหรับ User Management
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [isDeleteUserConfirmOpen, setIsDeleteUserConfirmOpen] = useState(false);
    const [deleteUserIndex, setDeleteUserIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
            return;
        }

        const storedProducts = localStorage.getItem('admin_products');
        setProducts(storedProducts ? JSON.parse(storedProducts) : allProducts);

        const storedOrders = localStorage.getItem('orders');
        setOrders(storedOrders ? JSON.parse(storedOrders) : [
            { id: 'ORD-001', customerName: 'สมชาย ใจดี', total: 4500, status: 'pending', createdAt: new Date().toISOString() },
            { id: 'ORD-002', customerName: 'มานี รักเรียน', total: 7800, status: 'processing', createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 'ORD-003', customerName: 'วิภา สวยงาม', total: 3200, status: 'shipped', createdAt: new Date(Date.now() - 172800000).toISOString() }
        ]);

        const storedUsers = localStorage.getItem('users');
        setUsers(storedUsers ? JSON.parse(storedUsers) : []);
    }, [isAuthenticated, isAdmin, router]);

    const saveProducts = (updatedProducts: Product[]) => {
        setProducts(updatedProducts);
        localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    };

    const handleDeleteProduct = (id: number) => { setDeleteProductId(id); setIsConfirmOpen(true); };

    const confirmDelete = () => {
        if (deleteProductId !== null) {
            saveProducts(products.filter(p => p.id !== deleteProductId));
            setAlertMessage('ลบสินค้าเรียบร้อยแล้ว'); setAlertType('success'); setIsAlertOpen(true);
        }
        setIsConfirmOpen(false); setDeleteProductId(null);
    };

    const handleEditProduct = (product: Product) => { setEditingProduct({ ...product }); setIsEditModalOpen(true); };

    const saveEditProduct = () => {
        if (editingProduct) {
            saveProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
            setIsEditModalOpen(false); setEditingProduct(null);
            setAlertMessage('แก้ไขสินค้าเรียบร้อยแล้ว'); setAlertType('success'); setIsAlertOpen(true);
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price) {
            setAlertMessage('กรุณากรอกชื่อสินค้าและราคา'); setAlertType('error'); setIsAlertOpen(true); return;
        }
        const maxId = Math.max(...products.map(p => p.id), 0);
        const product: Product = {
            id: maxId + 1, name: newProduct.name, brand: newProduct.brand || 'SonthiShop',
            category: newProduct.category || 'lifestyle', price: Number(newProduct.price),
            originalPrice: Number(newProduct.price), image: newProduct.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', isNew: true
        };
        saveProducts([...products, product]);
        setIsAddModalOpen(false); setNewProduct({ name: '', brand: '', category: '', price: '', image: '' });
        setAlertMessage('เพิ่มสินค้าเรียบร้อยแล้ว'); setAlertType('success'); setIsAlertOpen(true);
    };

    // User Management Handlers
    const saveUsers = (updatedUsers: any[]) => {
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const handleEditUser = (user: any, index: number) => {
        setEditingUser({ ...user, index });
        setIsEditUserModalOpen(true);
    };

    const saveEditUser = () => {
        if (editingUser) {
            const updatedUsers = [...users];
            const { index, ...userData } = editingUser;
            updatedUsers[index] = userData;
            saveUsers(updatedUsers);
            setIsEditUserModalOpen(false);
            setEditingUser(null);
            setAlertMessage('แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว');
            setAlertType('success');
            setIsAlertOpen(true);
        }
    };

    const handleDeleteUser = (index: number) => {
        setDeleteUserIndex(index);
        setIsDeleteUserConfirmOpen(true);
    };

    const confirmDeleteUser = () => {
        if (deleteUserIndex !== null) {
            const updatedUsers = users.filter((_, i) => i !== deleteUserIndex);
            saveUsers(updatedUsers);
            setAlertMessage('ลบผู้ใช้เรียบร้อยแล้ว');
            setAlertType('success');
            setIsAlertOpen(true);
        }
        setIsDeleteUserConfirmOpen(false);
        setDeleteUserIndex(null);
    };

    if (!isAuthenticated || !isAdmin) return null;

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    const tabs = [
        { id: 'dashboard', label: 'ภาพรวม' },
        { id: 'products', label: 'สินค้า' },
        { id: 'orders', label: 'คำสั่งซื้อ' },
        { id: 'users', label: 'ผู้ใช้งาน' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f17] to-[#0a0a0a] relative overflow-hidden">
            <div className="h-[68px]"></div>

            {/* Enhanced Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                <div className="absolute bottom-[10%] left-[30%] w-[450px] h-[450px] bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 max-w-7xl">
                {/* Header Section */}
                <br />
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb]">Dashboard</span>
                            </h1>
                            <p className="text-gray-400 text-base lg:text-lg font-medium">
                                ยินดีต้อนรับกลับ, <span className="text-white font-semibold">{user?.name}</span> 👋
                            </p>
                        </div>

                        {/* Tab Navigation Pill Style */}
                        <div className="p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 inline-flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <br />
                    {/* ================= DASHBOARD TAB ================= */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Stats Cards - Premium Dark Theme */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                                {/* Card 1: Total Sales */}
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="group relative bg-[#12121a]/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] hover:border-indigo-500/30 cursor-pointer text-left h-[190px] flex flex-col justify-between"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-500" />

                                    <div className="relative z-10 flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium mb-2 group-hover:text-indigo-200 transition-colors">ยอดขายรวม</p>
                                            <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all">
                                                ฿{totalSales.toLocaleString()}
                                            </h3>
                                        </div>
                                        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-indigo-500/20 group-hover:border-indigo-500/40 shrink-0">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4">
                                        <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 py-1.5 px-3 rounded-lg w-fit border border-indigo-500/20">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                            <span>เติบโต +12%</span>
                                        </div>
                                    </div>
                                </button>

                                {/* Card 2: Orders */}
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="group relative bg-[#12121a]/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:border-blue-500/30 cursor-pointer text-left h-[190px] flex flex-col justify-between"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500" />

                                    <div className="relative z-10 flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium mb-2 group-hover:text-blue-200 transition-colors">คำสั่งซื้อ</p>
                                            <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all">
                                                {orders.length}
                                            </h3>
                                        </div>
                                        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-blue-500/20 group-hover:border-blue-500/40 shrink-0">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4">
                                        <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 py-1.5 px-3 rounded-lg w-fit border border-blue-500/20">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span>ล่าสุด 2 ชม. ที่แล้ว</span>
                                        </div>
                                    </div>
                                </button>

                                {/* Card 3: Products */}
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className="group relative bg-[#12121a]/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] hover:border-emerald-500/30 cursor-pointer text-left h-[190px] flex flex-col justify-between"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/30 transition-all duration-500" />

                                    <div className="relative z-10 flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium mb-2 group-hover:text-emerald-200 transition-colors">สินค้าในคลัง</p>
                                            <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-emerald-200 transition-all">
                                                {products.length}
                                            </h3>
                                        </div>
                                        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-emerald-500/20 group-hover:border-emerald-500/40 shrink-0">
                                            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4">
                                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-lg w-fit border border-emerald-500/20">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span>พร้อมจำหน่าย</span>
                                        </div>
                                    </div>
                                </button>

                                {/* Card 4: Users */}
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className="group relative bg-[#12121a]/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.3)] hover:border-pink-500/30 cursor-pointer text-left h-[190px] flex flex-col justify-between"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[60px] rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-pink-500/30 transition-all duration-500" />

                                    <div className="relative z-10 flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium mb-2 group-hover:text-pink-200 transition-colors">ผู้ใช้งาน</p>
                                            <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-200 transition-all">
                                                {users.length}
                                            </h3>
                                        </div>
                                        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-pink-500/20 group-hover:border-pink-500/40 shrink-0">
                                            <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-4">
                                        <div className="flex items-center gap-2 text-xs text-pink-400 bg-pink-500/10 py-1.5 px-3 rounded-lg w-fit border border-pink-500/20">
                                            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
                                            <span>กำลังใช้งาน</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ================= PRODUCTS TAB ================= */}
                    {activeTab === 'products' && (
                        <div className="space-y-6 animate-enter">
                            <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                                <h3 className="text-xl font-bold text-white pl-2">รายการสินค้า ({products.length})</h3>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    เพิ่มสินค้า
                                </button>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/5">
                                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">สินค้า</th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">หมวดหมู่</th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ราคา</th>
                                                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {products.map((product) => (
                                                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-white/5 p-1 border border-white/10">
                                                                <img className="h-full w-full object-contain rounded-lg" src={product.image} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-bold text-white group-hover:text-[#667eea] transition-colors">{product.name}</div>
                                                                <div className="text-xs text-gray-500">{product.brand}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-white/10 text-gray-300">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-white">฿{product.price.toLocaleString()}</div>
                                                        {product.price < product.originalPrice && (
                                                            <div className="text-xs text-red-400 line-through">฿{product.originalPrice.toLocaleString()}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-3">
                                                            <button onClick={() => handleEditProduct(product)} className="text-indigo-400 hover:text-indigo-300 bg-indigo-400/10 p-2 rounded-lg transition-all hover:scale-110">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                            </button>
                                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-300 bg-red-400/10 p-2 rounded-lg transition-all hover:scale-110">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                    )}

                    {/* ================= ORDERS TAB ================= */}
                    {activeTab === 'orders' && (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-enter">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5">
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">รหัสคำสั่งซื้อ</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ลูกค้า</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ยอดรวม</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">สถานะ</th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">วันที่</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{order.customerName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">฿{order.total.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                                'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                                        {order.status === 'pending' ? 'รอดำเนินการ' : order.status === 'processing' ? 'กำลังเตรียม' : 'จัดส่งแล้ว'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ================= USERS TAB ================= */}
                    {activeTab === 'users' && (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-enter">
                            {users.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">ยังไม่มีข้อมูลผู้ใช้งานในระบบ</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/5">
                                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Username</th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อ</th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">อีเมล</th>
                                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">เบอร์โทร</th>
                                                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">จัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((u, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{u.username}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{u.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.phone}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                onClick={() => handleEditUser(u, i)}
                                                                className="text-indigo-400 hover:text-indigo-300 bg-indigo-400/10 p-2 rounded-lg transition-all hover:scale-110"
                                                                title="แก้ไขผู้ใช้"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(i)}
                                                                className="text-red-400 hover:text-red-300 bg-red-400/10 p-2 rounded-lg transition-all hover:scale-110"
                                                                title="ลบผู้ใช้"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* ========== MODALS ========== */}

                {/* Add Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="bg-[#12121a] border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-enter">
                            <h3 className="text-2xl font-bold text-white mb-6">เพิ่มสินค้าใหม่</h3>
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">ชื่อสินค้า</label>
                                    <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" placeholder="Ex. Nike Air Force 1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 ml-1">แบรนด์</label>
                                        <input type="text" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" placeholder="Ex. Nike" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 ml-1">หมวดหมู่</label>
                                        <input type="text" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" placeholder="Ex. Lifestyle" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">ราคา (บาท)</label>
                                    <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">URL รูปภาพ</label>
                                    <input type="text" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium">ยกเลิก</button>
                                <button onClick={handleAddProduct} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all font-bold">บันทึก</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                        <div className="bg-[#12121a] border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-enter">
                            <h3 className="text-2xl font-bold text-white mb-6">แก้ไขสินค้า</h3>
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">ชื่อสินค้า</label>
                                    <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 ml-1">แบรนด์</label>
                                        <input type="text" value={editingProduct.brand} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1 ml-1">ราคา</label>
                                        <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => { setIsEditModalOpen(false); setEditingProduct(null); }} className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium">ยกเลิก</button>
                                <button onClick={saveEditProduct} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all font-bold">บันทึก</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {isEditUserModalOpen && editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditUserModalOpen(false)}></div>
                        <div className="bg-[#12121a] border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-enter">
                            <h3 className="text-2xl font-bold text-white mb-6">แก้ไขข้อมูลผู้ใช้</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">Username</label>
                                    <input
                                        type="text"
                                        value={editingUser.username}
                                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">ชื่อ-นามสกุล</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">อีเมล</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 ml-1">เบอร์โทร</label>
                                    <input
                                        type="tel"
                                        value={editingUser.phone}
                                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#667eea] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => { setIsEditUserModalOpen(false); setEditingUser(null); }}
                                    className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={saveEditUser}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all font-bold"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title={alertType === 'success' ? 'สำเร็จ' : 'เกิดข้อผิดพลาด'} message={alertMessage} type={alertType} />
                <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmDelete} title="ยืนยันการลบ" message="คุณต้องการลบสินค้านี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้" />
                <ConfirmModal isOpen={isDeleteUserConfirmOpen} onClose={() => setIsDeleteUserConfirmOpen(false)} onConfirm={confirmDeleteUser} title="ยืนยันการลบผู้ใช้" message="คุณต้องการลบผู้ใช้นี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้" />
            </div>
        </div>
    );
}