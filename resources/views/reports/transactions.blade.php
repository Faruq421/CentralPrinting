<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Laporan Transaksi</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
        }
        .container {
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #FF6500;
            padding-bottom: 20px;
        }
        .header h1 {
            font-size: 24px;
            color: #FF6500;
            margin-bottom: 5px;
        }
        .header p {
            color: #666;
        }
        .summary {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .summary-item {
            display: table-cell;
            text-align: center;
            width: 20%;
        }
        .summary-item strong {
            display: block;
            font-size: 18px;
            color: #FF6500;
        }
        .summary-item span {
            font-size: 10px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #FF6500;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .status-paid {
            color: #22c55e;
            font-weight: bold;
        }
        .status-unpaid {
            color: #ef4444;
            font-weight: bold;
        }
        .status-cancelled {
            color: #6b7280;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Central Printing</h1>
            <p>Laporan Transaksi</p>
            <p>Periode: {{ $startDate }} - {{ $endDate }}</p>
        </div>

        <div class="summary">
            <div class="summary-item">
                <strong>{{ $summary['totalOrders'] }}</strong>
                <span>Total Pesanan</span>
            </div>
            <div class="summary-item">
                <strong>Rp {{ number_format($summary['totalRevenue'], 0, ',', '.') }}</strong>
                <span>Total Pendapatan</span>
            </div>
            <div class="summary-item">
                <strong>{{ $summary['paidOrders'] }}</strong>
                <span>Lunas</span>
            </div>
            <div class="summary-item">
                <strong>{{ $summary['unpaidOrders'] }}</strong>
                <span>Belum Bayar</span>
            </div>
            <div class="summary-item">
                <strong>{{ $summary['cancelledOrders'] }}</strong>
                <span>Dibatalkan</span>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th class="text-center">No</th>
                    <th>ID Transaksi</th>
                    <th>Tanggal</th>
                    <th>Pelanggan</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Pembayaran</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($orders as $index => $order)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>TRX-{{ str_pad($order->id, 4, '0', STR_PAD_LEFT) }}</td>
                    <td>{{ $order->created_at->format('d/m/Y H:i') }}</td>
                    <td>{{ $order->customer->user->name ?? 'Guest' }}</td>
                    <td class="text-center {{ $order->order_status === 'cancelled' ? 'status-cancelled' : '' }}">
                        {{ ucfirst($order->order_status) }}
                    </td>
                    <td class="text-center {{ $order->payment_status === 'paid' ? 'status-paid' : 'status-unpaid' }}">
                        {{ $order->payment_status === 'paid' ? 'Lunas' : 'Belum Bayar' }}
                    </td>
                    <td class="text-right">Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada transaksi dalam periode ini.</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer">
            <p>Laporan dihasilkan pada: {{ $generatedAt }}</p>
            <p>Central Printing - Solusi Cetak Terpercaya</p>
        </div>
    </div>
</body>
</html>
