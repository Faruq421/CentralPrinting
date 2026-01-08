<?php

namespace App\Http\Controllers;

use App\Features\Order\Order;
use App\Features\Order\OrderItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Periode waktu
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // ===== STATISTIK UTAMA =====

        // 1. Total Pendapatan (pesanan yang sudah dibayar)
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_price');
        
        // Pendapatan bulan ini
        $revenueThisMonth = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total_price');
        
        // Pendapatan bulan lalu
        $revenueLastMonth = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total_price');
        
        // Persentase perubahan pendapatan
        $revenueChange = $revenueLastMonth > 0 
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1)
            : ($revenueThisMonth > 0 ? 100 : 0);

        // 2. Pesanan Baru (bulan ini)
        $ordersThisMonth = Order::where('created_at', '>=', $startOfMonth)->count();
        $ordersLastMonth = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        
        $ordersChange = $ordersLastMonth > 0
            ? round((($ordersThisMonth - $ordersLastMonth) / $ordersLastMonth) * 100, 1)
            : ($ordersThisMonth > 0 ? 100 : 0);

        // 3. Produk Terjual (total quantity dari order items yang sudah dibayar)
        $productsSoldThisMonth = OrderItem::whereHas('order', function ($q) use ($startOfMonth) {
            $q->where('payment_status', 'paid')->where('created_at', '>=', $startOfMonth);
        })->sum('quantity');
        
        $productsSoldLastMonth = OrderItem::whereHas('order', function ($q) use ($startOfLastMonth, $endOfLastMonth) {
            $q->where('payment_status', 'paid')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth]);
        })->sum('quantity');
        
        $productsSoldChange = $productsSoldLastMonth > 0
            ? round((($productsSoldThisMonth - $productsSoldLastMonth) / $productsSoldLastMonth) * 100, 1)
            : ($productsSoldThisMonth > 0 ? 100 : 0);

        // 4. Pelanggan Aktif (customer yang punya pesanan bulan ini)
        $activeCustomersThisMonth = Order::where('created_at', '>=', $startOfMonth)
            ->distinct('user_id')
            ->count('user_id');
        
        $activeCustomersLastMonth = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->distinct('user_id')
            ->count('user_id');
        
        $activeCustomersChange = $activeCustomersLastMonth > 0
            ? round((($activeCustomersThisMonth - $activeCustomersLastMonth) / $activeCustomersLastMonth) * 100, 1)
            : ($activeCustomersThisMonth > 0 ? 100 : 0);

        // ===== PESANAN TERBARU =====
        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => 'ORD-' . str_pad($order->id, 3, '0', STR_PAD_LEFT),
                    'customer' => $order->user->name ?? 'Guest',
                    'status' => $this->translateStatus($order->order_status),
                    'statusKey' => $order->order_status,
                    'total' => $order->total_price,
                    'date' => $order->created_at->diffForHumans(),
                ];
            });

        // Total pesanan bulan ini untuk deskripsi
        $totalOrdersThisMonth = Order::where('created_at', '>=', $startOfMonth)->count();

        // ===== DATA CHART PENJUALAN (6 bulan terakhir) =====
        $chartData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = $now->copy()->subMonths($i)->startOfMonth();
            $monthEnd = $now->copy()->subMonths($i)->endOfMonth();
            
            $monthlyRevenue = Order::where('payment_status', 'paid')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('total_price');
            
            $monthlyOrders = Order::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            
            $chartData->push([
                'name' => $monthStart->translatedFormat('M'), // Jan, Feb, Mar, etc.
                'pendapatan' => (int) $monthlyRevenue,
                'pesanan' => $monthlyOrders,
            ]);
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'revenueChange' => $revenueChange,
                'ordersThisMonth' => $ordersThisMonth,
                'ordersChange' => $ordersChange,
                'productsSold' => $productsSoldThisMonth,
                'productsSoldChange' => $productsSoldChange,
                'activeCustomers' => $activeCustomersThisMonth,
                'activeCustomersChange' => $activeCustomersChange,
            ],
            'recentOrders' => $recentOrders,
            'totalOrdersThisMonth' => $totalOrdersThisMonth,
            'chartData' => $chartData,
        ]);
    }

    private function translateStatus(string $status): string
    {
        return match ($status) {
            'pending' => 'Pending',
            'processing' => 'Proses',
            'shipped' => 'Dikirim',
            'completed' => 'Selesai',
            'cancelled' => 'Batal',
            default => ucfirst($status),
        };
    }
}
