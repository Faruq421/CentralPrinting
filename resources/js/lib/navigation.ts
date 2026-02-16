import { type NavItem } from "@/types";
import { dashboard } from "@/routes";
import { route } from 'ziggy-js';
import {
    LayoutGrid,
    ShoppingBag,
    Package,
    Users,
    Star,
    MapPin,
    Settings,
    FileText
} from "lucide-react";

export const overviewNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
];

export const commerceNavItems: NavItem[] = [
    {
        title: 'Pesanan',
        href: route('orders.index', undefined, false),
        icon: ShoppingBag,
    },
    {
        title: 'Produk',
        href: route('products.index', undefined, false),
        icon: Package,
    },
    {
        title: 'Pelanggan',
        href: route('customers.index', undefined, false),
        icon: Users,
    },
    {
        title: 'Ulasan',
        href: route('reviews.index', undefined, false),
        icon: Star,
    },
];

export const operationalNavItems: NavItem[] = [
    {
        title: 'Toko & Lokasi',
        href: route('stores.index', undefined, false),
        icon: MapPin,
    },
    // Future: Reports, Settings etc.
];

export const mainNavItems: NavItem[] = [
    ...overviewNavItems,
    ...commerceNavItems,
    ...operationalNavItems,
];
