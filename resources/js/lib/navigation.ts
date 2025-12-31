import { type NavItem } from "@/types";
import { dashboard } from "@/routes"; // Impor fungsi route dashboard
import { route } from 'ziggy-js';
import { LayoutGrid, Package, MapPin } from "lucide-react"; // Impor ikon

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: route('products.index', undefined, false),
        icon: Package,
    },
    {
        title: 'Customers',
        href: route('customers.index', undefined, false),
        icon: Package,
    },
    {
        title: 'Orders',
        href: route('orders.index', undefined, false),
        icon: Package,
    },
    {
        title: 'Reviews',
        href: route('reviews.index', undefined, false),
        icon: Package,
    },
    {
        title: 'Lokasi Toko',
        href: route('stores.index', undefined, false),
        icon: MapPin,
    },
    // LINK BARU AKAN DITAMBAHKAN SECARA OTOMATIS DI SINI
];
