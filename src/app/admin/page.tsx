'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AlertModal from '@/components/AlertModal';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingModal from '@/components/LoadingModal';
import OrderDetailModal from '@/components/OrderDetailModal';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabType = 'dashboard' | 'products' | 'orders' | 'users' | 'sales';

interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number;
    image: string;
    isNew: boolean;
    stock: number;
}

interface Order {
    id: number; // DB uses int
    order_number: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
}

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
}

interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    pendingOrders?: number;
    lowStockProducts?: number;
    totalCredit?: number;
    totalCategories?: number;
    newUsers?: number;
    salesHistory?: { date: string, total: number }[];
}

export default function AdminDashboard() {
    const { isAdmin, isAuthenticated, user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);


    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        totalCredit: 0,
        totalCategories: 0,
        newUsers: 0
    });
    const [timeFilter, setTimeFilter] = useState('year'); // Default to year as requested

    // Order Filters
    const [ordersTimeFilter, setOrdersTimeFilter] = useState('all');
    const [ordersStatusFilter, setOrdersStatusFilter] = useState('all');

    // UI States
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
    const [confirmMessage, setConfirmMessage] = useState('');

    // Form States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Available US shoe sizes
    const AVAILABLE_SIZES = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11'];

    const [productForm, setProductForm] = useState({
        name: '', brand: '', category: '', price: '', originalPrice: '', image: '', stock: '',
        sizes: Object.fromEntries(AVAILABLE_SIZES.map(s => [s, ''])) as Record<string, string>
    });

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userForm, setUserForm] = useState({
        name: '', email: '', phone: '', username: '', role: 'user', password: ''
    });

    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    // Fetch Data Functions
    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`/api/dashboard/stats?filter=${timeFilter}`);
            const data = await res.json();
            if (data.success) setStats(data.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, [timeFilter]);

    const fetchProducts = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.success) {
                // Map DB columns to frontend interface
                const mappedProducts = data.products.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand || 'ไม่มีแบรนด์',
                    category: p.category || 'ไม่มีหมวดหมู่',
                    price: Number(p.price),
                    originalPrice: Number(p.original_price || p.price),
                    image: p.image_url || 'https://via.placeholder.com/150',
                    isNew: Boolean(p.is_new),
                    stock: p.stock || 0
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoadingData(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const queryParams = new URLSearchParams();
            if (ordersStatusFilter !== 'all') queryParams.append('status', ordersStatusFilter);
            if (ordersTimeFilter !== 'all') queryParams.append('filter', ordersTimeFilter);

            const res = await fetch(`/api/orders?${queryParams.toString()}`);
            const data = await res.json();
            if (data.success) setOrders(data.orders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoadingData(false);
        }
    }, [ordersStatusFilter, ordersTimeFilter]);

    const fetchUsers = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (data.success) setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoadingData(false);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        if (!loading && isAuthenticated && isAdmin) {
            fetchStats();
            // Fetch initial data based on active tab
            if (activeTab === 'dashboard') fetchStats();
            else if (activeTab === 'products') fetchProducts();
            else if (activeTab === 'orders') fetchOrders();
            else if (activeTab === 'users') fetchUsers();
        }
    }, [loading, isAuthenticated, isAdmin, activeTab, fetchStats, fetchProducts, fetchOrders, fetchUsers]);

    // Auth Check
    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, isAdmin, router]);

    // Handlers
    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertType(type);
        setIsAlertOpen(true);
    };

    const handleSaveProduct = async () => {
        if (!productForm.name || !productForm.price) {
            showAlert('กรุณากรอกชื่อสินค้าและราคา', 'error');
            return;
        }

        // Convert sizes object to array
        const sizesArray = Object.entries(productForm.sizes)
            .filter(([_, stock]) => stock && Number(stock) > 0)
            .map(([size, stock]) => ({ size, stock: Number(stock) }));

        // Calculate total stock from sizes
        const totalStock = sizesArray.reduce((sum, s) => sum + s.stock, 0);

        const payload = {
            name: productForm.name,
            brand: productForm.brand || '',
            category: productForm.category,
            price: Number(productForm.price) || 0,
            original_price: productForm.originalPrice ? Number(productForm.originalPrice) : null,
            image_url: productForm.image || '',
            stock: totalStock,
            sizes: sizesArray,
            is_new: true,
            is_active: true
        };

        setIsLoadingAction(true);
        try {
            let res;
            if (editingProduct) {
                res = await fetch(`/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();
            if (data.success) {
                showAlert(editingProduct ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ', 'success');
                setIsProductModalOpen(false);
                setEditingProduct(null);
                setProductForm({
                    name: '', brand: '', category: '', price: '', originalPrice: '', image: '', stock: '',
                    sizes: Object.fromEntries(AVAILABLE_SIZES.map(s => [s, ''])) as Record<string, string>
                });
                fetchProducts(); // Refresh list
            } else {
                showAlert(data.message, 'error');
            }
        } catch (error) {
            showAlert('เกิดข้อผิดพลาดในการบันทึก', 'error');
        } finally {
            setIsLoadingAction(false);
        }
    };

    const confirmDeleteProduct = (id: number) => {
        setConfirmMessage('คุณต้องการลบสินค้านี้ใช่หรือไม่?');
        setConfirmAction(() => async () => {
            setIsLoadingAction(true);
            try {
                const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    showAlert('ลบสินค้าสำเร็จ', 'success');
                    fetchProducts();
                } else {
                    showAlert(data.message, 'error');
                }
            } catch (error) {
                showAlert('เกิดข้อผิดพลาดในการลบ', 'error');
            } finally {
                setIsLoadingAction(false);
            }
            setIsConfirmOpen(false);
        });
        setIsConfirmOpen(true);
    };

    const updateOrderStatus = async (id: number, status: string) => {
        setIsLoadingAction(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                showAlert('อัพเดทสถานะสำเร็จ', 'success');
                fetchOrders();
            } else {
                showAlert(data.message, 'error');
            }
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด', 'error');
        } finally {
            setIsLoadingAction(false);
        }
    };

    const confirmDeleteUser = (id: number) => {
        setConfirmMessage('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่? ข้อมูลจะหายถาวร');
        setConfirmAction(() => async () => {
            setIsLoadingAction(true);
            try {
                const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    showAlert('ลบผู้ใช้สำเร็จ', 'success');
                    fetchUsers();
                } else {
                    showAlert(data.message, 'error');
                }
            } catch (error) {
                showAlert('เกิดข้อผิดพลาดในการลบ', 'error');
            } finally {
                setIsLoadingAction(false);
            }
            setIsConfirmOpen(false);
        });
        setIsConfirmOpen(true);
    };

    const updateUserRole = async (id: number, role: string) => {
        setIsLoadingAction(true);
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role })
            });
            const data = await res.json();
            if (data.success) {
                showAlert('อัพเดทสิทธิ์สำเร็จ', 'success');
                fetchUsers();
            } else {
                showAlert(data.message, 'error');
            }
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด', 'error');
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleSaveUser = async () => {
        if (!userForm.name || !userForm.email || (!editingUser && !userForm.password)) {
            showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        try {
            setIsLoadingAction(true);
            const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
            const method = editingUser ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForm)
            });
            const data = await res.json();
            if (data.success) {
                showAlert(editingUser ? 'แก้ไขข้อมูลผู้ใช้สำเร็จ' : 'เพิ่มผู้ใช้งานสำเร็จ', 'success');
                setIsUserModalOpen(false);
                fetchUsers();
            } else {
                showAlert(data.message, 'error');
            }
        } catch (error) {
            showAlert('เกิดข้อผิดพลาดในการบันทึก', 'error');
        } finally {
            setIsLoadingAction(false);
        }
    };

    const openEditUser = (u: User) => {
        setEditingUser(u);
        setUserForm({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            username: u.username || '',
            role: u.role || 'user',
            password: '' // Don't show existing password
        });
        setIsUserModalOpen(true);
    };

    const openEditProduct = async (p: Product) => {
        setEditingProduct(p);

        // Fetch product details including sizes
        let sizesData: Record<string, string> = Object.fromEntries(AVAILABLE_SIZES.map(s => [s, '']));
        try {
            const res = await fetch(`/api/products/${p.id}`);
            const data = await res.json();
            if (data.success && data.product.sizes) {
                data.product.sizes.forEach((s: { size: string; stock: number }) => {
                    if (sizesData.hasOwnProperty(s.size)) {
                        sizesData[s.size] = s.stock.toString();
                    }
                });
            }
        } catch (e) {
            console.warn('Could not fetch product sizes:', e);
        }

        setProductForm({
            name: p.name,
            brand: p.brand,
            category: p.category,
            price: p.price.toString(),
            originalPrice: p.originalPrice.toString(),
            image: p.image,
            stock: p.stock.toString(),
            sizes: sizesData
        });
        setIsProductModalOpen(true);
    };

    // Derived Data for Search
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredOrders = orders.filter(o =>
        o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sales Summary Calculation
    const salesHistory = stats.salesHistory || [];
    const salesTotal = salesHistory.reduce((acc, curr) => acc + Number(curr.total), 0);
    const salesAvg = salesHistory.length > 0 ? salesTotal / salesHistory.length : 0;
    const salesMax = salesHistory.length > 0 ? Math.max(...salesHistory.map(s => Number(s.total))) : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f111a]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#0f111a] relative overflow-hidden text-white font-sans selection:bg-indigo-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="h-[68px]"></div>
            <br />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-14">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-extrabold tracking-tight">
                                หน้าจัดการ<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.1)]">ระบบ</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 text-xs font-semibold ml-1 flex items-center gap-2 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                            การจัดการระบบ <span className="text-gray-300">SonthiShop</span> แบบ Real-time
                        </p>
                    </div>

                    {/* Back Button - Premium Glass Design */}
                    {activeTab !== 'dashboard' && (
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className="relative group px-5 py-2.5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md border border-white/10 group-hover:border-white/20 transition-all rounded-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-300 border border-white/10">
                                    <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">กลับหน้าหลัก</span>
                            </div>
                        </button>
                    )}
                </div>
                <br />
                {/* Dashboard Stats */}
                {activeTab === 'dashboard' && (
                    <div className="animate-enter grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="ยอดขายรวม"
                            value={`฿${stats.totalSales.toLocaleString()}`}
                            icon="currency"
                            color="sapphire"
                            onClick={() => setActiveTab('sales')}
                        />
                        <StatCard
                            title="เครดิตรวมในระบบ"
                            value={`฿${(stats.totalCredit || 0).toLocaleString()}`}
                            icon="wallet"
                            color="emerald"
                            onClick={() => setActiveTab('users')}
                        />
                        <StatCard
                            title="รอการจัดส่ง"
                            value={stats.pendingOrders || 0}
                            icon="clock"
                            color="amber"
                            onClick={() => { setActiveTab('orders'); setOrdersStatusFilter('pending'); }}
                        />
                        <StatCard
                            title="ผู้ใช้งานทั้งหมด"
                            value={stats.totalUsers || 0}
                            icon="users"
                            color="amethyst"
                            onClick={() => setActiveTab('users')}
                        />
                        <StatCard
                            title="ผู้ใช้งานใหม่ (7 วัน)"
                            value={stats.newUsers || 0}
                            icon="userPlus"
                            color="pink"
                            onClick={() => setActiveTab('users')}
                        />
                        <StatCard
                            title="คำสั่งซื้อทั้งหมด"
                            value={stats.totalOrders}
                            icon="cart"
                            color="indigo"
                            onClick={() => setActiveTab('orders')}
                        />
                        <StatCard
                            title="สินค้าทั้งหมด"
                            value={stats.totalProducts}
                            icon="box"
                            color="topaz"
                            onClick={() => setActiveTab('products')}
                        />
                        <StatCard
                            title="หมวดหมู่สินค้า"
                            value={stats.totalCategories || 0}
                            icon="grid"
                            color="jade"
                            onClick={() => setActiveTab('products')}
                        />
                        <StatCard
                            title="สินค้าใกล้หมด"
                            value={stats.lowStockProducts || 0}
                            icon="alert"
                            color="ruby"
                            onClick={() => setActiveTab('products')}
                        />
                    </div>
                )}
                <br />

                {/* Functionality Tabs */}
                {activeTab !== 'dashboard' && (
                    <div className="animate-enter space-y-4">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-4 rounded-none backdrop-blur-md">
                            {/* Search Input Removed */}

                            {activeTab === 'products' && (
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setProductForm({
                                            name: '', brand: '', category: '', price: '', originalPrice: '', image: '', stock: '',
                                            sizes: Object.fromEntries(AVAILABLE_SIZES.map(s => [s, ''])) as Record<string, string>
                                        });
                                        setIsProductModalOpen(true);
                                    }}
                                    className="group relative px-7 py-4 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/20 hover:bg-white/10"
                                >
                                    <div className="relative flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 group-hover:bg-purple-500/30 transition-all duration-300">
                                            <svg className="w-4 h-4 text-purple-400 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 group-hover:from-purple-300 group-hover:to-blue-300 tracking-wide">เพิ่มสินค้าใหม่</span>
                                    </div>
                                </button>
                            )}

                            {activeTab === 'sales' && (
                                <div className="flex justify-between items-center px-4 py-2">
                                    <div className="text-white text-xl font-bold">
                                        สถิติมูลค่าการสั่งซื้อ
                                    </div>
                                    <div className="relative group/select">
                                        <select
                                            value={timeFilter}
                                            onChange={(e) => setTimeFilter(e.target.value)}
                                            className="appearance-none text-white text-base font-bold outline-none transition-all cursor-pointer min-w-[180px] text-left"
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
                                            <option value="today" className="bg-[#12121a]">วันนี้ (รายชั่วโมง)</option>
                                            <option value="week" className="bg-[#12121a]">สัปดาห์นี้ (รายวัน)</option>
                                            <option value="month" className="bg-[#12121a]">เดือนนี้ (รายวัน)</option>
                                            <option value="year" className="bg-[#12121a]">ปีนี้ (รายเดือน)</option>
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white group-hover/select:text-purple-400 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="flex gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                                    <div className="relative group/select">
                                        <select
                                            value={ordersTimeFilter}
                                            onChange={(e) => setOrdersTimeFilter(e.target.value)}
                                            className="appearance-none text-white text-base font-bold outline-none transition-all cursor-pointer min-w-[120px] text-left"
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
                                            <option value="all" className="bg-[#12121a]">ทุกช่วงเวลา</option>
                                            <option value="today" className="bg-[#12121a]">วันนี้</option>
                                            <option value="week" className="bg-[#12121a]">สัปดาห์นี้</option>
                                            <option value="month" className="bg-[#12121a]">เดือนนี้</option>
                                            <option value="year" className="bg-[#12121a]">ปีนี้</option>
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white group-hover/select:text-blue-400 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                    <div className="relative group/select">
                                        <select
                                            value={ordersStatusFilter}
                                            onChange={(e) => setOrdersStatusFilter(e.target.value)}
                                            className="appearance-none text-white text-base font-bold outline-none transition-all cursor-pointer min-w-[140px] text-left"
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
                                            <option value="all" className="bg-[#12121a]">ทุกสถานะ</option>
                                            <option value="pending" className="bg-[#12121a]">รอดำเนินการ</option>
                                            <option value="processing" className="bg-[#12121a]">กำลังจัดเตรียม</option>
                                            <option value="shipped" className="bg-[#12121a]">จัดส่งแล้ว</option>
                                            <option value="delivered" className="bg-[#12121a]">จัดส่งสำเร็จ</option>
                                            <option value="cancelled" className="bg-[#12121a]">ยกเลิก</option>
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white group-hover/select:text-blue-400 transition-colors">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'users' && (
                                <button
                                    onClick={() => {
                                        setEditingUser(null);
                                        setUserForm({ name: '', email: '', phone: '', username: '', role: 'user', password: '' });
                                        setIsUserModalOpen(true);
                                    }}
                                    className="group relative px-7 py-4 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/20 hover:bg-white/10"
                                >
                                    <div className="relative flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 group-hover:bg-purple-500/30 transition-all duration-300">
                                            <svg className="w-4 h-4 text-purple-400 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 group-hover:from-purple-300 group-hover:to-blue-300 tracking-wide">เพิ่มผู้ใช้งาน</span>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Content Table Container - Internal Scroll */}
                        <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.08] overflow-hidden backdrop-blur-xl shadow-2xl">
                            {activeTab === 'sales' ? (
                                <div className="animate-enter">
                                    <div className="p-8 h-[500px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={stats.salesHistory || []}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#ffffff50"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#ffffff50"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => `฿${value.toLocaleString()}`}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: '#ffffff10' }}
                                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                    formatter={(value: any) => [`฿${(Number(value) || 0).toLocaleString()}`, 'ยอดขาย']}
                                                    labelStyle={{ color: '#a1a1aa' }}
                                                />
                                                <Bar
                                                    dataKey="total"
                                                    fill="#8b5cf6"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={40}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Summary Metrics */}
                                    <div className="grid grid-cols-3 gap-6 p-8 border-t border-white/5 bg-white/[0.01]">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">ยอดขายรวมในช่วงนี้</span>
                                            <span className="text-2xl font-black text-white">฿{salesTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">ยอดขายเฉลี่ย</span>
                                            <span className="text-2xl font-black text-white">฿{Math.round(salesAvg).toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">ยอดขายสูงสุด</span>
                                            <span className="text-2xl font-black text-white">฿{salesMax.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : isLoadingData ? (
                                <div className="flex justify-center items-center h-[520px]">
                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="max-h-[440px] overflow-y-auto overflow-x-auto no-scrollbar scroll-smooth">
                                    <table className="w-full border-separate border-spacing-0">
                                        <thead className="sticky top-0 z-30">
                                            <tr className="bg-[#0f111a]/95 backdrop-blur-3xl border-b border-white/[0.08]">
                                                {activeTab === 'products' && (
                                                    <>
                                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">สินค้า</th>
                                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">หมวดหมู่</th>
                                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">ราคา</th>
                                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">สต็อก</th>
                                                        <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-wider">จัดการ</th>
                                                    </>
                                                )}
                                                {activeTab === 'orders' && (
                                                    <>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">รหัสคำสั่งซื้อ</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ลูกค้า</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ยอดรวม</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">สถานะ</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">วันที่</th>
                                                    </>
                                                )}
                                                {activeTab === 'users' && (
                                                    <>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ผู้ใช้งาน</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">อีเมล</th>
                                                        <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">บทบาท</th>
                                                        <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">จัดการ</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.05]">
                                            {/* Products Rows */}
                                            {activeTab === 'products' && filteredProducts.map((p) => (
                                                <tr key={p.id} className="hover:bg-white/[0.04] transition-all duration-300 group/row border-b border-white/[0.03] last:border-0 text-white">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-5">
                                                            <div className="h-16 w-16 rounded-xl bg-white/[0.04] p-2 border border-white/10 shrink-0">
                                                                <img src={p.image} alt="" className="h-full w-full object-contain filter drop-shadow-lg" />
                                                            </div>
                                                            <div>
                                                                <div className="text-base font-bold text-white group-hover/row:text-purple-400 transition-colors">{p.name}</div>
                                                                <div className="text-sm text-gray-500 mt-1">{p.brand}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5"><span className="px-3.5 py-2 text-xs font-bold uppercase tracking-wide rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">{p.category}</span></td>
                                                    <td className="px-8 py-5 text-base font-black text-amber-400">฿{p.price.toLocaleString()}</td>
                                                    <td className="px-8 py-5 text-base text-center">
                                                        <span className={`font-bold ${Number(p.stock) < 10 ? 'text-rose-400' : 'text-emerald-400'}`}>{p.stock}</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button onClick={() => openEditProduct(p)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/0 hover:shadow-blue-500/30"><svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                            <button onClick={() => confirmDeleteProduct(p.id)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all shadow-lg shadow-rose-500/0 hover:shadow-rose-500/30"><svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* Orders Rows */}
                                            {activeTab === 'orders' && filteredOrders.map((o) => (
                                                <tr
                                                    key={o.id}
                                                    onClick={() => {
                                                        setSelectedOrderId(o.id);
                                                        setIsOrderDetailOpen(true);
                                                    }}
                                                    className="hover:bg-white/[0.05] transition-all duration-300 group/row border-b border-white/[0.02] last:border-0 cursor-pointer text-white"
                                                >
                                                    <td className="px-8 py-6 text-sm text-gray-400 font-mono tracking-tight group-hover/row:text-white transition-colors">#{o.order_number}</td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-sm font-bold text-white">{o.customer_name || 'ลูกค้าทั่วไป'}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-black text-amber-400">฿{o.total_amount.toLocaleString()}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="relative group/status w-fit">
                                                            <select
                                                                value={o.status}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    updateOrderStatus(o.id, e.target.value);
                                                                }}
                                                                className={`appearance-none !pl-[45px] pr-10 py-2.5 text-[10px] font-black uppercase tracking-wider !rounded-none !border-0 !border-b-2 !bg-transparent hover:bg-white/5 cursor-pointer outline-none transition-all duration-300
                                                                    ${o.status === 'pending' ? 'text-amber-400 border-amber-500/40 hover:border-amber-500/60' :
                                                                        o.status === 'processing' ? 'text-blue-400 border-blue-500/40 hover:border-blue-500/60' :
                                                                            o.status === 'shipped' ? 'text-purple-400 border-purple-500/40 hover:border-purple-500/60' :
                                                                                o.status === 'delivered' ? 'text-emerald-400 border-emerald-500/40 hover:border-emerald-500/60' :
                                                                                    'text-rose-400 border-rose-500/40 hover:border-rose-500/60'}`}
                                                            >
                                                                <option className="bg-[#121214] text-gray-300" value="pending">รอดำเนินการ</option>
                                                                <option className="bg-[#121214] text-gray-300" value="processing">กำลังจัดเตรียม</option>
                                                                <option className="bg-[#121214] text-gray-300" value="shipped">จัดส่งแล้ว</option>
                                                                <option className="bg-[#121214] text-gray-300" value="delivered">จัดส่งสำเร็จ</option>
                                                                <option className="bg-[#121214] text-gray-300" value="cancelled">ยกเลิกแล้ว</option>
                                                            </select>
                                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ring-4 ring-current/10
                                                                    ${o.status === 'pending' ? 'bg-amber-500 text-amber-500' :
                                                                    o.status === 'processing' ? 'bg-blue-500 text-blue-500' :
                                                                        o.status === 'shipped' ? 'bg-purple-500 text-purple-500' :
                                                                            o.status === 'delivered' ? 'bg-emerald-500 text-emerald-500' :
                                                                                'bg-rose-500 text-rose-500'}`}
                                                            />
                                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{new Date(o.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                </tr>
                                            ))}

                                            {/* Users Rows */}
                                            {activeTab === 'users' && filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-white/[0.03] transition-all duration-300 group/row border-b border-white/[0.02] last:border-0 text-white">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                                {u.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-white group-hover/row:text-blue-400 transition-colors">{u.username}</div>
                                                                <div className="text-xs text-gray-500 mt-0.5">{u.name || 'ไม่ระบุชื่อ'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-gray-400 font-medium">{u.email}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="relative group/select w-fit">
                                                            <select
                                                                value={u.role}
                                                                onChange={(e) => updateUserRole(u.id, e.target.value)}
                                                                className={`appearance-none pl-2 pr-10 py-2 text-[10px] font-black uppercase tracking-wider !rounded-none !border-0 !border-b-2 cursor-pointer outline-none transition-all duration-300
                                                                ${u.role === 'admin'
                                                                        ? '!bg-purple-500/5 text-purple-400 border-purple-500/40 hover:border-purple-500/60'
                                                                        : '!bg-transparent text-gray-400 border-white/20 hover:border-white/40'}`}
                                                            >
                                                                <option value="user" className="bg-[#121214]">ผู้ใช้งานทั่วไป</option>
                                                                <option value="admin" className="bg-[#121214]">ผู้ดูแลระบบ</option>
                                                            </select>
                                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <button onClick={() => openEditUser(u)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/0 hover:shadow-blue-500/20"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                            <button onClick={() => confirmDeleteUser(u.id)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* Empty States */}
                                            {((activeTab === 'products' && filteredProducts.length === 0) ||
                                                (activeTab === 'orders' && filteredOrders.length === 0) ||
                                                (activeTab === 'users' && filteredUsers.length === 0)) && (
                                                    <tr>
                                                        <td colSpan={6} className="py-40 text-center">
                                                            <div className="flex flex-col items-center gap-8 animate-pulse">
                                                                <div className="relative w-24 h-24">
                                                                    <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl" />
                                                                    <div className="relative flex items-center justify-center w-full h-full bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-xl">
                                                                        <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-4m-8 0H4" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="text-xl font-black text-white/40 tracking-tight">ไม่พบข้อมูลที่คุณค้นหา</div>
                                                                    <div className="text-sm font-medium text-gray-600">ลองใช้คำค้นหาอื่นหรือเปลี่ยนตัวกรอง</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <OrderDetailModal
                isOpen={isOrderDetailOpen}
                onClose={() => setIsOrderDetailOpen(false)}
                orderId={selectedOrderId}
                isAdmin={true}
                onActionComplete={fetchOrders}
            />

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsProductModalOpen(false)}></div>

                    <div className="relative z-10 w-full max-w-4xl bg-gradient-to-b from-[#141418] to-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-enter">

                        {/* Header */}
                        <div className="relative px-8 py-6 border-b border-white/5">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {editingProduct ? `รหัส: #${editingProduct.id}` : 'กรอกข้อมูลสินค้าให้ครบถ้วน'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                                {/* Left Column - Form Fields */}
                                <div className="lg:col-span-3 space-y-6">

                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">ข้อมูลพื้นฐาน</p>
                                        <Input
                                            label="ชื่อสินค้า"
                                            value={productForm.name}
                                            onChange={v => setProductForm({ ...productForm, name: v })}
                                            placeholder="เช่น Nike Air Jordan 1 Retro"
                                        />
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">แบรนด์</label>
                                                <select
                                                    value={productForm.brand}
                                                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                                                    className="w-full text-white text-sm focus:outline-none cursor-pointer"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                                                        borderRadius: 0,
                                                        padding: '12px 24px 12px 0',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none',
                                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 0 center',
                                                        backgroundSize: '16px'
                                                    }}
                                                >
                                                    <option value="" style={{ backgroundColor: '#1a1a1e' }}>เลือกแบรนด์</option>
                                                    <option value="Nike" style={{ backgroundColor: '#1a1a1e' }}>Nike</option>
                                                    <option value="Adidas" style={{ backgroundColor: '#1a1a1e' }}>Adidas</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">หมวดหมู่</label>
                                                <select
                                                    value={productForm.category}
                                                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                    className="w-full text-white text-sm focus:outline-none cursor-pointer"
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                                                        borderRadius: 0,
                                                        padding: '12px 24px 12px 0',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'none',
                                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 0 center',
                                                        backgroundSize: '16px'
                                                    }}
                                                >
                                                    <option value="" style={{ backgroundColor: '#1a1a1e' }}>เลือกหมวดหมู่</option>
                                                    <option value="วิ่ง" style={{ backgroundColor: '#1a1a1e' }}>วิ่ง</option>
                                                    <option value="ไลฟ์สไตล์" style={{ backgroundColor: '#1a1a1e' }}>ไลฟ์สไตล์</option>
                                                    <option value="บาสเก็ตบอล" style={{ backgroundColor: '#1a1a1e' }}>บาสเก็ตบอล</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Size Stock */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">สต็อกตามไซส์</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {AVAILABLE_SIZES.map((size) => (
                                                <div key={size} className="relative">
                                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 text-center">{size}</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={productForm.sizes[size]}
                                                        onChange={(e) => setProductForm({
                                                            ...productForm,
                                                            sizes: { ...productForm.sizes, [size]: e.target.value }
                                                        })}
                                                        placeholder="0"
                                                        className="w-full py-2.5 bg-transparent border-0 border-b border-white/20 text-white text-sm font-bold text-center focus:border-purple-500 focus:outline-none transition-all"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                                            <span className="text-xs text-gray-400">สต็อกรวมทั้งหมด</span>
                                            <span className="text-base font-bold text-white">
                                                {Object.values(productForm.sizes).reduce((sum, val) => sum + (Number(val) || 0), 0)} ชิ้น
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">ราคา</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="ราคาขาย (บาท)"
                                                type="number"
                                                value={productForm.price}
                                                onChange={v => setProductForm({ ...productForm, price: v })}
                                                placeholder="0"
                                            />
                                            <Input
                                                label="ราคาเดิม (ถ้ามี)"
                                                type="number"
                                                value={productForm.originalPrice}
                                                onChange={v => setProductForm({ ...productForm, originalPrice: v })}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Image URL */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">รูปภาพสินค้า</p>
                                        <Input
                                            label="URL รูปภาพ"
                                            value={productForm.image}
                                            onChange={v => setProductForm({ ...productForm, image: v })}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Image Preview */}
                                <div className="lg:col-span-2">
                                    <div className="sticky top-0 space-y-4">
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">ตัวอย่างสินค้า</p>
                                        <div className="aspect-square rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden relative">
                                            {productForm.image ? (
                                                <img
                                                    src={productForm.image}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain p-4"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <div className="text-center">
                                                        <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="text-xs opacity-50">ใส่ URL เพื่อดูตัวอย่าง</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Overlay info on image */}
                                            {(productForm.name || productForm.price) && (
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                    <p className="text-sm font-bold text-white truncate">{productForm.name || 'ชื่อสินค้า'}</p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex gap-1.5 text-xs">
                                                            {productForm.brand && (
                                                                <span className="text-blue-400">{productForm.brand}</span>
                                                            )}
                                                            {productForm.brand && productForm.category && (
                                                                <span className="text-gray-500">•</span>
                                                            )}
                                                            {productForm.category && (
                                                                <span className="text-purple-400">{productForm.category}</span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-bold text-emerald-400">฿{Number(productForm.price || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
                            <button
                                onClick={() => setIsProductModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium text-sm transition-all"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                            >
                                {editingProduct ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มสินค้า'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Modal */}
            {
                isUserModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsUserModalOpen(false)} />
                        <div className="relative z-10 w-full max-w-2xl bg-[#141418] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-enter">
                            <div className="flex justify-between items-start p-8 pb-0">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">เพิ่มผู้ใช้งานใหม่</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {editingUser ? `รหัสผู้ใช้: #${editingUser.id}` : 'กรอกข้อมูลผู้ใช้งานให้ครบถ้วน'}
                                    </p>
                                </div>
                                <button onClick={() => setIsUserModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <Input label="ชื่อผู้ใช้ (Username)" value={userForm.username} onChange={v => setUserForm({ ...userForm, username: v })} placeholder="Username" />
                                        <Input label="ชื่อ-นามสกุล" value={userForm.name} onChange={v => setUserForm({ ...userForm, name: v })} placeholder="ชื่อเต็ม" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Input label="อีเมล" value={userForm.email} onChange={v => setUserForm({ ...userForm, email: v })} placeholder="email@example.com" />
                                        <Input label="เบอร์โทรศัพท์" value={userForm.phone} onChange={v => setUserForm({ ...userForm, phone: v })} placeholder="08x-xxx-xxxx" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <Input
                                            label={editingUser ? "รหัสผ่านใหม่ (ปล่อยว่างถ้าไม่ต้องการเปลี่ยน)" : "รหัสผ่าน"}
                                            value={userForm.password}
                                            onChange={v => setUserForm({ ...userForm, password: v })}
                                            placeholder="••••••••"
                                            type="password"
                                        />
                                    </div>
                                    <div className="relative group/select">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest transition-colors group-focus-within/select:text-blue-400">บทบาท (Role)</label>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${userForm.role === 'admin' ? 'text-purple-400' : 'text-gray-500'}`}>
                                                {userForm.role === 'admin' ? 'สิทธิ์ผู้ดูแลระบบ' : 'ผู้ใช้งานทั่วไป'}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={userForm.role}
                                                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                                className="w-full py-3 bg-transparent border-0 border-b border-white/20 text-white text-sm focus:border-blue-500 focus:outline-none transition-all cursor-pointer appearance-none"
                                            >
                                                <option value="user" className="bg-[#141418]">ผู้ใช้งานทั่วไป (USER)</option>
                                                <option value="admin" className="bg-[#141418]">ผู้ดูแลระบบ (ADMIN)</option>
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within/select:text-blue-400 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-5 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
                                <button
                                    onClick={() => setIsUserModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium text-sm transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSaveUser}
                                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                                >
                                    {editingUser ? 'บันทึกการเปลี่ยนแปลง' : 'ยืนยันเพิ่มผู้ใช้งาน'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title="แจ้งเตือน" message={alertMessage} type={alertType} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmAction} title="ยืนยัน" message={confirmMessage} />
            <LoadingModal isOpen={isLoadingAction} message="กำลังดำเนินการ..." />
        </div >
    );
}

// Helper Components
function StatCard({ title, value, icon, color, onClick, action }: { title: string, value: string | number, icon: string, color: string, onClick?: () => void, action?: React.ReactNode }) {
    const iconPaths: { [key: string]: string } = {
        currency: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.69 1.64 1.83 1.64.93 0 1.62-.56 1.62-1.22 0-.86-.81-1.33-2.68-1.78C8.3 12.83 7 11.96 7 10.14c0-1.61 1.43-2.88 3.51-3.23V5h2.67v1.88c1.71.36 3.04 1.54 3.11 3.24h-1.95c-.13-1.01-.74-1.63-1.68-1.63-.8 0-1.5.55-1.5 1.2 0 .84.88 1.16 2.65 1.59 2.07.5 3.32 1.39 3.32 3.25 0 1.61-1.32 2.87-3.72 3.16z",
        cart: "M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
        box: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 16h-2v-4h2v4zm2-6h-6v-2h6v2zm3 6h-2v-4h2v4zm0-6h-2v-2h2v2zm3 6h-2v-8h2v8zm0-10H8V6h11v3z",
        users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
        clock: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
        alert: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
        wallet: "M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
        grid: "M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z",
        userPlus: "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    };

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col items-center justify-center gap-3 p-6 h-[160px] 
            bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-xl 
            hover:border-indigo-500/50 hover:bg-indigo-500/5 
            transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-500/10 
            ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Icon */}
            <div className="text-gray-500 group-hover:text-indigo-400 transition-colors duration-300 transform group-hover:scale-110">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d={iconPaths[icon] || iconPaths['box']} />
                </svg>
            </div>

            {/* Content */}
            <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-white tracking-tight">
                    {value}
                </div>
                <div className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                    {title}
                </div>
            </div>

            {/* Action Button if Present */}
            {action && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {action}
                </div>
            )}
        </div>
    );
}

function Input({ label, value, onChange, placeholder, type = 'text', icon }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string, icon?: string }) {
    return (
        <div className="group/field relative">
            {label && <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 transition-colors group-focus-within/field:text-blue-400">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full py-3 bg-transparent border-0 border-b border-white/20 text-white text-sm focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600"
                placeholder={placeholder}
            />
        </div>
    );
}