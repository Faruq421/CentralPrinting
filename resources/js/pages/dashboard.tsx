import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DollarSign,
    ShoppingBag,
    Package,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Printer,
    FileText,
    Loader2,
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    ComposedChart,
    PieChart,
    Pie,
    Bar,
    Cell,
    Sector
} from 'recharts';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

// TypeScript interfaces
interface Stats {
    totalRevenue: number;
    revenueChange: number;
    ordersThisMonth: number;
    ordersChange: number;
    productsSold: number;
    productsSoldChange: number;
    activeCustomers: number;
    activeCustomersChange: number;
}

interface TopProduct {
    name: string;
    sales: number;
    id: string;
}

interface RecentActivity {
    user: string;
    action: string;
    target: string;
    time: string;
}

interface CategorySale {
    name: string;
    value: number;
}

interface Transaction {
    id: string;
    date: string;
    customer: string;
    amount: number;
    status: string;
}

interface ChartDataPoint {
    name: string;
    pendapatan: number;
    pesanan: number;
}

interface DashboardProps {
    stats: Stats;
    topProducts: TopProduct[];
    recentActivity: RecentActivity[];
    categorySales: CategorySale[];
    recentTransactions: Transaction[];
    chartData: ChartDataPoint[];
}

export default function Dashboard() {
    const { stats, topProducts, recentActivity, categorySales, recentTransactions, chartData } = usePage<{
        stats: Stats;
        topProducts: TopProduct[];
        recentActivity: RecentActivity[];
        categorySales: CategorySale[];
        recentTransactions: Transaction[];
        chartData: ChartDataPoint[];
    }>().props;

    // Helper untuk mendapatkan rentang tanggal bulan ini
    const getCurrentMonthRange = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const format = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        return { start: format(start), end: format(end) };
    };

    const [timeRange, setTimeRange] = useState("6m");
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [reportDate, setReportDate] = useState(getCurrentMonthRange());
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isDownloading, setIsDownloading] = useState(false);

    // Handle chart time range change
    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value);
        router.get(route('dashboard'), { timeRange: value }, { preserveState: true, preserveScroll: true });
    };

    // Handle download report
    const handleDownloadReport = (type: 'pdf' | 'excel') => {
        if (!reportDate.start || !reportDate.end) {
            toast.error("Harap pilih tanggal mulai dan selesai terlebih dahulu.");
            return;
        }

        setIsDownloading(true);
        const routeName = type === 'pdf' ? 'reports.pdf' : 'reports.excel';
        const url = route(routeName, { start_date: reportDate.start, end_date: reportDate.end });

        // Open in new tab for download
        window.open(url, '_blank');

        setIsReportDialogOpen(false);
        setIsDownloading(false);
        toast.success(`Laporan (${type.toUpperCase()}) sedang diunduh...`);
    };

    // Format helpers
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const formatCurrencyShort = (value: number) => {
        if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
        if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}jt`;
        if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}rb`;
        return `Rp ${value}`;
    };

    // Stats cards data
    const statsData = [
        {
            title: "Total Pendapatan",
            value: formatCurrency(stats.totalRevenue),
            change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% dari bulan lalu`,
            trend: stats.revenueChange >= 0 ? "up" : "down",
            icon: DollarSign,
        },
        {
            title: "Pesanan Bulan Ini",
            value: formatNumber(stats.ordersThisMonth),
            change: `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}% dari bulan lalu`,
            trend: stats.ordersChange >= 0 ? "up" : "down",
            icon: ShoppingBag,
        },
        {
            title: "Produk Terjual",
            value: formatNumber(stats.productsSold),
            change: `${stats.productsSoldChange >= 0 ? '+' : ''}${stats.productsSoldChange}% dari bulan lalu`,
            trend: stats.productsSoldChange >= 0 ? "up" : "down",
            icon: Package,
        },
        {
            title: "Pelanggan Aktif",
            value: formatNumber(stats.activeCustomers),
            change: `${stats.activeCustomersChange >= 0 ? '+' : ''}${stats.activeCustomersChange}% dari bulan lalu`,
            trend: stats.activeCustomersChange >= 0 ? "up" : "down",
            icon: Activity,
        }
    ];

    const COLORS = ['#FF6500', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
        return (
            <g>
                <text x={cx} y={cy} textAnchor="middle" fill="#333">
                    <tspan x={cx} dy="-0.5em" className="text-lg font-bold" fill="#1f2937">
                        {payload.name}
                    </tspan>
                    <tspan x={cx} dy="1.6em" className="text-sm font-medium" fill="#6b7280">
                        {value} Terjual
                    </tspan>
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
            </g>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ringkasan Dashboard" />

            <style>{`
                .recharts-wrapper { outline: none !important; }
                .recharts-surface:focus { outline: none !important; }
                .recharts-layer:focus { outline: none !important; }
                .recharts-sector:focus { outline: none !important; }
                g:focus, path:focus { outline: none !important; }
            `}</style>

            <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">
                            Ringkasan performa bisnis Anda.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Download className="mr-2 h-4 w-4" />
                                    Unduh Laporan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Unduh Laporan Transaksi</DialogTitle>
                                    <DialogDescription>
                                        Pilih rentang tanggal laporan yang ingin Anda unduh.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="start-date" className="text-right">Dari</Label>
                                        <Input
                                            id="start-date"
                                            type="date"
                                            className="col-span-3"
                                            value={reportDate.start}
                                            onChange={(e) => setReportDate({ ...reportDate, start: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="end-date" className="text-right">Hingga</Label>
                                        <Input
                                            id="end-date"
                                            type="date"
                                            className="col-span-3"
                                            value={reportDate.end}
                                            onChange={(e) => setReportDate({ ...reportDate, end: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="outline" onClick={() => handleDownloadReport('excel')} disabled={isDownloading}>
                                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                        Excel (.csv)
                                    </Button>
                                    <Button onClick={() => handleDownloadReport('pdf')} disabled={isDownloading}>
                                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                                        PDF (.pdf)
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                                    ) : (
                                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                                    )}
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Revenue Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Overview Pendapatan</CardTitle>
                                    <CardDescription>Tren pendapatan dan pesanan per periode.</CardDescription>
                                </div>
                                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Pilih Waktu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1m">1 Bulan Terakhir</SelectItem>
                                        <SelectItem value="3m">3 Bulan Terakhir</SelectItem>
                                        <SelectItem value="6m">6 Bulan Terakhir</SelectItem>
                                        <SelectItem value="2026">Tahun 2026</SelectItem>
                                        <SelectItem value="2025">Tahun 2025</SelectItem>
                                        <SelectItem value="2024">Tahun 2024</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPesanan" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrencyShort} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none', padding: '12px' }}
                                            formatter={(value: number, name: string) => [name === 'Pendapatan (Rp)' ? formatCurrency(value) : value, name]}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Legend verticalAlign="top" height={36} iconType="circle" />
                                        <Area yAxisId="left" type="monotone" dataKey="pendapatan" name="Pendapatan (Rp)" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" />
                                        <Bar yAxisId="right" dataKey="pesanan" name="Jml Pesanan" barSize={20} fill="url(#colorPesanan)" radius={[4, 4, 0, 0]} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Produk Terlaris</CardTitle>
                            <CardDescription>Produk dengan penjualan tertinggi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {topProducts.length > 0 ? topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">{index + 1}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.id}</p>
                                        </div>
                                        <div className="ml-auto font-bold text-orange-600">+{product.sales}</div>
                                    </div>
                                )) : (
                                    <p className="text-center text-muted-foreground py-4">Belum ada data penjualan</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Activity */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Aktivitas Terkini</CardTitle>
                            <CardDescription>Aktivitas pengguna terbaru di platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <span className="relative flex h-2 w-2 mr-4 mt-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                        </span>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold text-gray-900">{item.user}</span> {item.action} <span className="font-medium text-gray-800">{item.target}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{item.time}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-muted-foreground py-4">Belum ada aktivitas</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales by Category */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Penjualan per Kategori</CardTitle>
                            <CardDescription>Distribusi penjualan berdasarkan kategori produk.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={categorySales}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            fill="#8884d8"
                                            dataKey="value"
                                            onMouseEnter={(_, index) => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(-1)}
                                        >
                                            {categorySales.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                        <CardDescription>Daftar transaksi terbaru yang masuk ke sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Transaksi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Jumlah</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.length > 0 ? recentTransactions.map((trx) => (
                                    <TableRow key={trx.id}>
                                        <TableCell className="font-medium">{trx.id}</TableCell>
                                        <TableCell>{trx.date}</TableCell>
                                        <TableCell>{trx.customer}</TableCell>
                                        <TableCell>
                                            <Badge variant={trx.status === 'Lunas' ? 'default' : 'secondary'}>
                                                {trx.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{formatCurrency(trx.amount)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada transaksi</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
