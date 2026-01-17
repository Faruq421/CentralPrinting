<?php

namespace App\Http\Controllers;

use App\Features\Order\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Download PDF report for transactions
     */
    public function downloadPdf(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        $orders = Order::with('customer.user', 'items.product')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate summary
        $summary = [
            'totalOrders' => $orders->count(),
            'totalRevenue' => $orders->where('payment_status', 'paid')->sum('total_price'),
            'paidOrders' => $orders->where('payment_status', 'paid')->count(),
            'unpaidOrders' => $orders->where('payment_status', 'unpaid')->count(),
            'cancelledOrders' => $orders->where('order_status', 'cancelled')->count(),
        ];

        $pdf = Pdf::loadView('reports.transactions', [
            'orders' => $orders,
            'summary' => $summary,
            'startDate' => $startDate->format('d M Y'),
            'endDate' => $endDate->format('d M Y'),
            'generatedAt' => Carbon::now()->format('d M Y H:i'),
        ]);

        $filename = 'laporan-transaksi-' . $startDate->format('Y-m-d') . '-' . $endDate->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Download Excel/CSV report for transactions
     */
    public function downloadExcel(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();

        $orders = Order::with('customer.user')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'laporan-transaksi-' . $startDate->format('Y-m-d') . '-' . $endDate->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for Excel UTF-8 compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Header row
            fputcsv($file, [
                'ID Transaksi',
                'Tanggal',
                'Pelanggan',
                'Email',
                'Status Pesanan',
                'Status Pembayaran',
                'Total (Rp)',
            ]);

            // Data rows
            foreach ($orders as $order) {
                fputcsv($file, [
                    'TRX-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                    $order->created_at->format('d/m/Y H:i'),
                    $order->customer->user->name ?? 'Guest',
                    $order->customer->user->email ?? '-',
                    ucfirst($order->order_status),
                    ucfirst($order->payment_status),
                    $order->total_price,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
