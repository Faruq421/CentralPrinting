import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingBag, Package, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

// Tipe data untuk props dari backend
interface DashboardStats {
    totalRevenue: number;
    revenueChange: number;
    ordersThisMonth: number;
    ordersChange: number;
    productsSold: number;
    productsSoldChange: number;
    activeCustomers: number;
    activeCustomersChange: number;
}

interface RecentOrder {
    id: string;
    customer: string;
    status: string;
    statusKey: string;
    total: number;
    date: string;
}

interface ChartDataPoint {
    name: string;
    pendapatan: number;
    pesanan: number;
}

interface DashboardProps {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
    totalOrdersThisMonth: number;
    chartData: ChartDataPoint[];
}

// Helper untuk format currency
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Helper untuk format angka
const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('id-ID').format(value);
};

// Helper untuk format currency pendek (untuk chart tooltip)
const formatCurrencyShort = (value: number): string => {
    if (value >= 1000000000) {
        return `Rp ${(value / 1000000000).toFixed(1)}M`;
    }
    if (value >= 1000000) {
        return `Rp ${(value / 1000000).toFixed(1)}Jt`;
    }
    if (value >= 1000) {
        return `Rp ${(value / 1000).toFixed(0)}rb`;
    }
    return `Rp ${value}`;
};

export default function Dashboard({ stats, recentOrders, totalOrdersThisMonth, chartData }: DashboardProps) {
    // Mapping stats ke format yang dibutuhkan UI
    const statsCards = [
        {
            title: "Total Pendapatan",
            value: formatCurrency(stats.totalRevenue),
            change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% dari bulan lalu`,
            icon: DollarSign,
            trend: stats.revenueChange >= 0 ? "up" : "down"
        },
        {
            title: "Pesanan Bulan Ini",
            value: formatNumber(stats.ordersThisMonth),
            change: `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}% dari bulan lalu`,
            icon: ShoppingBag,
            trend: stats.ordersChange >= 0 ? "up" : "down"
        },
        {
            title: "Produk Terjual",
            value: formatNumber(stats.productsSold),
            change: `${stats.productsSoldChange >= 0 ? '+' : ''}${stats.productsSoldChange}% dari bulan lalu`,
            icon: Package,
            trend: stats.productsSoldChange >= 0 ? "up" : "down"
        },
        {
            title: "Pelanggan Aktif",
            value: formatNumber(stats.activeCustomers),
            change: `${stats.activeCustomersChange >= 0 ? '+' : ''}${stats.activeCustomersChange}% dari bulan lalu`,
            icon: Activity,
            trend: stats.activeCustomersChange >= 0 ? "up" : "down"
        }
    ];

    // Mapping status ke variant Badge
    const getStatusVariant = (statusKey: string): "default" | "secondary" | "outline" | "destructive" => {
        switch (statusKey) {
            case 'completed': return 'default';
            case 'processing': case 'shipped': return 'secondary';
            case 'pending': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    // Custom tooltip untuk chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                    <p className="font-semibold text-sm mb-2">{label}</p>
                    <p className="text-sm text-orange-600">
                        Pendapatan: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-sm text-blue-600">
                        Pesanan: {payload[1].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Overview" />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center space-x-2">
                        <Button>Download Laporan</Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    {stat.trend === 'up' ?
                                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> :
                                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                    }
                                    <span className={stat.trend === 'up' ? "text-green-600" : "text-red-600"}>
                                        {stat.change}
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Sales Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview Penjualan</CardTitle>
                            <CardDescription>Pendapatan dan pesanan 6 bulan terakhir</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[350px] w-full">
                                {chartData && chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                yAxisId="left"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => formatCurrencyShort(value)}
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="pendapatan"
                                                name="Pendapatan"
                                                fill="#f97316"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                yAxisId="right"
                                                dataKey="pesanan"
                                                name="Pesanan"
                                                fill="#3b82f6"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-md flex items-center justify-center border border-dashed text-muted-foreground">
                                        <div className="text-center">
                                            <p>Belum ada data penjualan</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Pesanan Terbaru</CardTitle>
                            <CardDescription>
                                Kamu memiliki {formatNumber(totalOrdersThisMonth)} pesanan bulan ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    <div className="font-medium">{order.customer}</div>
                                                    <div className="text-xs text-muted-foreground">{order.id}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getStatusVariant(order.statusKey)}
                                                        className="text-xs"
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                Belum ada pesanan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
