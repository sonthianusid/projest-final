'use client';

import { useEffect, useState } from 'react';

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number | null;
    isAdmin?: boolean;
    onActionComplete?: () => void;
}

export default function OrderDetailModal({ isOpen, onClose, orderId, isAdmin, onActionComplete }: OrderDetailModalProps) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
            document.body.style.overflow = 'hidden';
        } else {
            setOrder(null);
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        if (!orderId) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'processing' })
            });
            const data = await res.json();
            if (data.success) {
                await fetchOrderDetails();
                if (onActionComplete) onActionComplete();
            }
        } catch (error) {
            console.error('Error confirming order:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm print:bg-white" onClick={onClose}></div>

            <div className="relative bg-[#18181b] border border-white/10 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl mx-4 print:shadow-none print:border-none print:w-full print:max-w-none print:h-auto print:max-h-none print:bg-white print:text-black print:overflow-visible">
                /* Print Styles */
                <style jsx global>{`
                    @media print {
                        @page {
                            size: A4;
                            margin: 20mm;
                        }
                        body {
                            background: white !important;
                            color: black !important;
                            overflow: visible !important;
                        }
                        body * {
                            visibility: hidden;
                        }
                        .print-content, .print-content * {
                            visibility: visible;
                        }
                        .print-content {
                            position: fixed;
                            left: 0;
                            top: 0;
                            width: 100vw;
                            height: 100vh;
                            margin: 0;
                            padding: 0;
                            background: white !important;
                            color: black !important;
                            z-index: 9999;
                        }
                        .no-print {
                            display: none !important;
                        }
                        /* Force light theme colors in print */
                        .print-content h2, 
                        .print-content h3, 
                        .print-content p, 
                        .print-content span, 
                        .print-content td, 
                        .print-content th {
                            color: black !important;
                            text-shadow: none !important;
                        }
                        /* Borders */
                        .print-content .border-b, 
                        .print-content .border-t {
                            border-color: #ddd !important;
                        }
                        /* Hide dark layout elements */
                        .print-hidden {
                            display: none !important;
                        }
                    }
                `}</style>

                <div className="print-content">
                    {/* Header Title Bar */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#18181b] sticky top-0 z-20 print:static print:bg-white print:border-gray-200">
                        <div>
                            <h2 className="text-lg font-bold text-white print:text-black">รายละเอียดคำสั่งซื้อ</h2>
                            <p className="text-xs text-gray-500 font-medium print:text-gray-600">#{order?.order_number}</p>
                        </div>
                        <div className="flex items-center gap-3 no-print">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium border border-white/5"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                <span>พิมพ์ใบเสร็จ</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 print:p-0 print:mt-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm">กำลังโหลด...</p>
                            </div>
                        ) : order ? (
                            <div className="space-y-8 print:space-y-4">
                                {/* Order Info Grid */}
                                <div className="grid grid-cols-2 gap-8 pb-6 border-b border-white/5 print:border-gray-200">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider print:text-gray-600">สถานะ</p>
                                        {(() => {
                                            const statusMap: Record<string, { label: string, color: string, printColor: string }> = {
                                                'pending': { label: 'รอดำเนินการ', color: 'text-amber-400', printColor: 'text-orange-600' },
                                                'processing': { label: 'กำลังดำเนินการ', color: 'text-blue-400', printColor: 'text-blue-600' },
                                                'shipped': { label: 'ส่งแล้ว', color: 'text-purple-400', printColor: 'text-purple-600' },
                                                'delivered': { label: 'สำเร็จ', color: 'text-emerald-400', printColor: 'text-green-600' },
                                                'cancelled': { label: 'ยกเลิก', color: 'text-rose-400', printColor: 'text-red-600' }
                                            };
                                            const status = statusMap[order.status?.toLowerCase()] || { label: order.status, color: 'text-gray-400', printColor: 'text-gray-600' };
                                            return (
                                                <div className={`font-bold text-sm ${status.color} print:${status.printColor}`}>
                                                    {status.label}
                                                </div>
                                            );
                                        })()}
                                        <p className="text-xs text-gray-500 print:text-gray-500 pt-1">
                                            {new Date(order.created_at).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider print:text-gray-600">ลูกค้า</p>
                                        <p className="text-sm font-bold text-white print:text-black">{order.customer_name}</p>
                                        <p className="text-xs text-gray-400 print:text-gray-600">{order.customer_phone || '-'}</p>
                                    </div>
                                </div>

                                {/* Order Items Table Look */}
                                <div>
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 print:border-gray-200">
                                                <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-1/2 print:text-gray-600">รายการสินค้า</th>
                                                <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right print:text-gray-600">ราคา</th>
                                                <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right print:text-gray-600">จำนวน</th>
                                                <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right print:text-gray-600">รวม</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 print:divide-gray-200">
                                            {order.items.map((item: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="py-3 pr-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 p-1 flex-shrink-0 flex items-center justify-center print:border-gray-200">
                                                                <img src={item.image_url} alt={item.product_name} className="w-full h-full object-contain" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white print:text-black">{item.product_name}</p>
                                                                {item.size && <span className="text-xs text-gray-500 print:text-gray-500">ไซส์: {item.size}</span>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-sm text-gray-400 text-right print:text-gray-700">฿{item.price.toLocaleString()}</td>
                                                    <td className="py-3 text-sm text-gray-400 text-right print:text-gray-700">{item.quantity}</td>
                                                    <td className="py-3 text-sm font-bold text-white text-right print:text-black">฿{item.subtotal.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t border-white/10 print:border-gray-300">
                                                <td colSpan={3} className="pt-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider print:text-gray-600">ยอดรวมทั้งหมด</td>
                                                <td className="pt-4 text-right text-lg font-black text-white print:text-black">฿{Number(order.total_amount).toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Addresses Grid */}
                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5 print:border-gray-200">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider print:text-gray-600">ที่อยู่จัดส่ง</p>
                                        <p className="text-sm text-gray-300 leading-relaxed print:text-gray-800">
                                            {order.shipping_address}
                                        </p>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider print:text-gray-600">การชำระเงิน</p>
                                        <p className="text-sm text-white print:text-black font-medium">
                                            {order.payment_method === 'store_credit' ? 'Store Credit' :
                                                order.payment_method === 'promptpay' ? 'QR PromptPay' :
                                                    order.payment_method === 'truemoney' ? 'TrueMoney Wallet' : 'เก็บเงินปลายทาง'}
                                        </p>
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                {isAdmin && order.status === 'pending' && (
                                    <div className="pt-6 border-t border-white/5 no-print">
                                        <button
                                            onClick={handleConfirmOrder}
                                            disabled={actionLoading}
                                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    กำลังบันทึก...
                                                </span>
                                            ) : 'ยืนยันการสั่งซื้อ'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-red-400">
                                ไม่พบข้อมูลคำสั่งซื้อ
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
