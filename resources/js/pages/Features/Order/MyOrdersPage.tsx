import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { type PageProps } from '@/types';
import { route } from 'ziggy-js';
import SiteLayout from '@/layouts/SiteLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, Truck, Hourglass, XCircle, Loader2, CreditCard, Wallet } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

// Midtrans Snap type declaration
declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options: {
                    onSuccess?: (result: unknown) => void;
                    onPending?: (result: unknown) => void;
                    onError?: (result: unknown) => void;
                    onClose?: () => void;
                }
            ) => void;
        };
    }
}
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Tentukan tipe data dasar untuk props
interface OrderItemProduct {
    nama_produk: string;
    // tambahkan field lain jika perlu, mis: 'image_url'
}

interface OrderItem {
    id: number;
    product: OrderItemProduct;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    created_at: string;
    order_status: string; // Mis: 'pending', 'processing', 'shipped', 'completed'
    payment_status: string;
    total_price: number;
    estimated_completion_date: string | null; // Tanggal estimasi
    items: OrderItem[];
    reviews_count?: number;
    reviews_edited_count?: number;
    snap_token?: string | null;
    payment_method?: string;
}

// Tipe untuk data paginasi
interface PaginatedOrders {
    data: Order[];
    // tambahkan links, meta jika perlu untuk paginasi
}

// Helper untuk styling status
const getStatusBadge = (status: string) => {
    // Handle undefined status gracefully
    const statusLower = status ? status.toLowerCase() : 'unknown';

    switch (statusLower) {
        case 'completed':
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-2 h-4 w-4" />Selesai</Badge>;
        case 'shipped':
            return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><Truck className="mr-2 h-4 w-4" />Dikirim</Badge>;
        case 'processing':
            return <Badge variant="secondary"><Hourglass className="mr-2 h-4 w-4" />Diproses</Badge>;
        case 'cancelled':
            return <Badge variant="destructive"><XCircle className="mr-2 h-4 w-4" />Dibatalkan</Badge>;
        default:
            return <Badge variant="outline"><Package className="mr-2 h-4 w-4" />Menunggu</Badge>;
    }
};

const formatCurrency = (value: number | string) => {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numberValue);
};

// Helper untuk label status pembayaran dalam Bahasa Indonesia
const getPaymentStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return 'Sudah Dibayar';
        case 'unpaid':
            return 'Belum Dibayar';
        case 'expired':
            return 'Kedaluwarsa';
        default:
            return status || 'Tidak Diketahui';
    }
};

const getPaymentStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return 'text-green-600 border-green-200 bg-green-50';
        case 'unpaid':
            return 'text-red-600 border-red-200 bg-red-50';
        case 'expired':
            return 'text-orange-600 border-orange-200 bg-orange-50';
        default:
            return 'text-gray-600';
    }
};

export default function MyOrdersPage() {
    // Ambil data 'orders' yang dikirim dari controller
    const { orders } = usePage<{ orders: PaginatedOrders }>().props;
    const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
    const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

    // Handle cancel order
    const handleCancelOrder = (orderId: number) => {
        setCancellingOrderId(orderId);
        router.post(route('orders.cancel', orderId), {}, {
            preserveScroll: true,
            onFinish: () => setCancellingOrderId(null),
        });
    };

    // Handle pay order — buka Midtrans Snap popup
    const handlePayOrder = async (order: Order) => {
        setPayingOrderId(order.id);

        try {
            // Minta snap token baru dari backend
            const response = await axios.post(route('payment.createToken', { order: order.id }));
            const { snap_token } = response.data;

            if (snap_token && window.snap) {
                window.snap.pay(snap_token, {
                    onSuccess: async (result: unknown) => {
                        console.log('Payment success:', result);

                        // Update status pembayaran di backend
                        try {
                            await axios.post(route('orders.markPaid', order.id));
                        } catch (err) {
                            console.error('Gagal update status pembayaran:', err);
                        }

                        toast.success('Pembayaran berhasil!');
                        router.visit(window.location.href, { preserveScroll: true });
                    },
                    onPending: (result: unknown) => {
                        console.log('Payment pending:', result);
                        toast.info('Menunggu pembayaran. Silakan selesaikan pembayaran Anda.');
                        setPayingOrderId(null);
                    },
                    onError: (result: unknown) => {
                        console.error('Payment error:', result);
                        toast.error('Pembayaran gagal. Silakan coba lagi.');
                        setPayingOrderId(null);
                    },
                    onClose: () => {
                        console.log('Payment popup closed');
                        toast.info('Anda menutup popup pembayaran. Pesanan Anda tetap tersimpan.');
                        setPayingOrderId(null);
                    },
                });
            } else {
                toast.error('Midtrans Snap tidak tersedia. Silakan refresh halaman.');
                setPayingOrderId(null);
            }
        } catch (error) {
            console.error('Failed to create payment token:', error);
            toast.error('Gagal memulai pembayaran. Silakan coba lagi.');
            setPayingOrderId(null);
        }
    };

    // Check if order can be cancelled
    const canCancelOrder = (order: Order) => {
        return order.payment_status === 'unpaid' &&
            !['cancelled', 'completed'].includes(order.order_status?.toLowerCase());
    };

    return (
        <SiteLayout>
            <Head title="Pesanan Saya" />
            <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-12">
                <h1 className="text-xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-8">
                    Pesanan Saya
                </h1>

                {orders.data.length > 0 ? (
                    <div className="space-y-4 lg:space-y-6">
                        {orders.data.map((order) => (
                            <Card key={order.id} className="overflow-hidden">
                                <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 border-b p-3 lg:p-4 gap-2">
                                    <div>
                                        <CardTitle className="text-base lg:text-lg">Pesanan #{order.id}</CardTitle>
                                        <p className="text-xs lg:text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 lg:gap-2">
                                        <Badge variant="outline" className={getPaymentStatusStyle(order.payment_status)}>
                                            {getPaymentStatusLabel(order.payment_status)}
                                        </Badge>
                                        {getStatusBadge(order.order_status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 lg:p-6">
                                    <ul className="space-y-2 lg:space-y-3 mb-3 lg:mb-4">
                                        {order.items.map(item => (
                                            <li key={item.id} className="flex justify-between items-center text-sm lg:text-base">
                                                <span className="text-gray-700 truncate mr-2">{item.product?.nama_produk || 'Produk dihapus'} (x{item.quantity})</span>
                                                <span className="font-medium flex-shrink-0">{formatCurrency(item.price)}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-t pt-3 lg:pt-4 flex justify-between items-center">
                                        <span className="text-sm lg:text-base text-gray-600">Total Pesanan</span>
                                        <span className="text-lg lg:text-xl font-bold text-gray-800">
                                            {formatCurrency(order.total_price)}
                                        </span>
                                    </div>

                                    {/* INI ADALAH FITUR ESTIMASI PENGGUNA */}
                                    {order.estimated_completion_date && (
                                        <div className="mt-4 border-t pt-4">
                                            <h4 className="font-semibold text-gray-700">Estimasi Selesai:</h4>
                                            <p className="text-[#FF6500] font-medium">
                                                {new Date(order.estimated_completion_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="bg-gray-50 border-t p-3 lg:p-4 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2">
                                    {/* Tombol Bayar Sekarang - hanya tampil jika unpaid dan belum dibatalkan */}
                                    {canCancelOrder(order) && (
                                        <Button
                                            size="sm"
                                            className="bg-[#FF6500] hover:bg-[#e05a00] text-white w-full sm:w-auto"
                                            disabled={payingOrderId === order.id}
                                            onClick={() => handlePayOrder(order)}
                                        >
                                            {payingOrderId === order.id ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <Wallet className="mr-2 h-4 w-4" />
                                                    Bayar Sekarang
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    {/* Tombol Batalkan Pesanan - hanya tampil jika unpaid */}
                                    {canCancelOrder(order) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={cancellingOrderId === order.id}
                                                >
                                                    {cancellingOrderId === order.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Membatalkan...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Batalkan Pesanan
                                                        </>
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Batalkan Pesanan #{order.id}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Tidak, Kembali</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Ya, Batalkan Pesanan
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}

                                    {/* Tautkan ke halaman detail pesanan jika ada */}
                                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                                        <Link href={route('orders.show', order.id)}>Lihat Detail</Link>
                                    </Button>
                                    {order.order_status?.toLowerCase() === 'completed' && (
                                        <>
                                            {(!order.reviews_edited_count || order.reviews_edited_count === 0) && (
                                                <Button asChild className={`${order.reviews_count && order.reviews_count > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
                                                    <Link href={route('reviews.create-for-order', order.id)}>
                                                        {order.reviews_count && order.reviews_count > 0 ? 'Update Penilaian' : 'Beri Penilaian'}
                                                    </Link>
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 lg:py-16 border rounded-lg">
                        <Package className="h-12 w-12 lg:h-16 lg:w-16 mx-auto text-gray-400" />
                        <h2 className="mt-3 lg:mt-4 text-lg lg:text-xl font-semibold text-gray-700">Anda belum memiliki pesanan</h2>
                        <p className="mt-1.5 lg:mt-2 text-sm lg:text-base text-gray-500">Semua pesanan Anda akan muncul di sini.</p>
                        <Button asChild className="mt-4 lg:mt-6 bg-[#FF6500] hover:bg-[#C40C0C]">
                            <Link href="/">Mulai Belanja</Link>
                        </Button>
                    </div>
                )}

                {/* Tambahkan Navigasi Paginasi di sini jika diperlukan */}
            </div>
        </SiteLayout>
    );
}
