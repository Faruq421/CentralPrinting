<?php

namespace App\Http\Controllers;

use App\Features\Order\Order;
use App\Features\Order\OrderItem;
use App\Features\Product\Product;
use App\Features\Product\Category;
use App\Features\Review\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
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

        // ===== PRODUK TERLARIS =====
        $topProducts = OrderItem::select('product_id_produk', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('order', function ($q) {
                $q->where('payment_status', 'paid');
            })
            ->groupBy('product_id_produk')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->with('product:id_produk,nama_produk')
            ->get()
            ->map(function ($item, $index) {
                return [
                    'name' => $item->product->nama_produk ?? 'Produk Dihapus',
                    'sales' => (int) $item->total_sold,
                    'id' => 'PRD-' . str_pad($item->product_id_produk, 3, '0', STR_PAD_LEFT),
                ];
            });

        // ===== AKTIVITAS TERKINI =====
        $recentActivity = collect();
        
        // Pesanan terbaru
        $recentOrders = Order::with('user')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($order) {
                return [
                    'user' => $order->user->name ?? 'Guest',
                    'action' => $order->order_status === 'cancelled' ? 'membatalkan pesanan' : 'membuat pesanan baru',
                    'target' => '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    'time' => $order->created_at->diffForHumans(),
                ];
            });
        
        // Ulasan terbaru
        $recentReviews = Review::with('user')
            ->latest()
            ->take(2)
            ->get()
            ->map(function ($review) {
                return [
                    'user' => $review->user->name ?? 'Anonim',
                    'action' => 'memberikan ulasan bintang ' . $review->rating,
                    'target' => '',
                    'time' => $review->created_at->diffForHumans(),
                ];
            });
        
        $recentActivity = $recentOrders->merge($recentReviews)
            ->sortByDesc(function ($item) {
                return Carbon::parse($item['time']);
            })
            ->take(5)
            ->values();

        // ===== PENJUALAN PER KATEGORI =====
        $categorySales = OrderItem::select('products.category_id', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->join('products', 'order_items.product_id_produk', '=', 'products.id_produk')
            ->whereHas('order', function ($q) {
                $q->where('payment_status', 'paid');
            })
            ->groupBy('products.category_id')
            ->with('product.category')
            ->get()
            ->map(function ($item) {
                $category = Category::find($item->category_id);
                return [
                    'name' => $category->name ?? 'Lainnya',
                    'value' => (int) $item->total_sold,
                ];
            });

        // ===== DATA TRANSAKSI TERBARU =====
        $recentTransactions = Order::with('user')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => 'TRX-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    'date' => $order->created_at->format('d M Y'),
                    'customer' => $order->user->name ?? 'Guest',
                    'amount' => $order->total_price,
                    'status' => $this->translatePaymentStatus($order->payment_status),
                ];
            });

        // ===== DATA CHART PENJUALAN =====
        $timeRange = $request->input('timeRange', '6m');
        $chartData = $this->getChartData($timeRange);

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
            'topProducts' => $topProducts,
            'recentActivity' => $recentActivity,
            'categorySales' => $categorySales->count() > 0 ? $categorySales : [
                ['name' => 'Belum ada data', 'value' => 0]
            ],
            'recentTransactions' => $recentTransactions,
            'chartData' => $chartData,
        ]);
    }

    private function getChartData(string $timeRange): array
    {
        $now = Carbon::now();
        $chartData = [];

        switch ($timeRange) {
            case '1m':
                // Data per minggu untuk 1 bulan terakhir
                for ($i = 3; $i >= 0; $i--) {
                    $weekStart = $now->copy()->subWeeks($i)->startOfWeek();
                    $weekEnd = $now->copy()->subWeeks($i)->endOfWeek();
                    
                    $revenue = Order::where('payment_status', 'paid')
                        ->whereBetween('created_at', [$weekStart, $weekEnd])
                        ->sum('total_price');
                    
                    $orders = Order::whereBetween('created_at', [$weekStart, $weekEnd])->count();
                    
                    $chartData[] = [
                        'name' => 'Minggu ' . (4 - $i),
                        'pendapatan' => (int) $revenue,
                        'pesanan' => $orders,
                    ];
                }
                break;

            case '3m':
            case '6m':
                $months = $timeRange === '3m' ? 2 : 5;
                for ($i = $months; $i >= 0; $i--) {
                    $monthStart = $now->copy()->subMonths($i)->startOfMonth();
                    $monthEnd = $now->copy()->subMonths($i)->endOfMonth();
                    
                    $revenue = Order::where('payment_status', 'paid')
                        ->whereBetween('created_at', [$monthStart, $monthEnd])
                        ->sum('total_price');
                    
                    $orders = Order::whereBetween('created_at', [$monthStart, $monthEnd])->count();
                    
                    $chartData[] = [
                        'name' => $monthStart->translatedFormat('M'),
                        'pendapatan' => (int) $revenue,
                        'pesanan' => $orders,
                    ];
                }
                break;

            default:
                // Default: data per bulan untuk tahun yang dipilih atau 1 tahun terakhir
                $year = is_numeric($timeRange) ? (int) $timeRange : $now->year;
                
                for ($month = 1; $month <= 12; $month++) {
                    $monthStart = Carbon::create($year, $month, 1)->startOfMonth();
                    $monthEnd = Carbon::create($year, $month, 1)->endOfMonth();
                    
                    // Skip bulan yang belum terjadi
                    if ($monthStart->isFuture()) {
                        continue;
                    }
                    
                    $revenue = Order::where('payment_status', 'paid')
                        ->whereBetween('created_at', [$monthStart, $monthEnd])
                        ->sum('total_price');
                    
                    $orders = Order::whereBetween('created_at', [$monthStart, $monthEnd])->count();
                    
                    $chartData[] = [
                        'name' => $monthStart->translatedFormat('M'),
                        'pendapatan' => (int) $revenue,
                        'pesanan' => $orders,
                    ];
                }
                break;
        }

        return $chartData;
    }

    private function translatePaymentStatus(string $status): string
    {
        return match ($status) {
            'paid' => 'Lunas',
            'unpaid' => 'Pending',
            'expired' => 'Kadaluarsa',
            default => ucfirst($status),
        };
    }
}
