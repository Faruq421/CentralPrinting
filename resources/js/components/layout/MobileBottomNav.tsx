import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { type PageProps } from '@/types';
import { Home, ShoppingBag, ShoppingCart, Package, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CartSheet } from '@/components/CartSheet';

interface CartData {
    items: Record<string, { id: string }>;
}

export default function MobileBottomNav() {
    const { auth, cart, url } = usePage<PageProps & { cart: CartData | null; url: string }>().props;
    const user = auth?.user;

    const cartItems = cart ? Object.values(cart.items || {}) : [];
    const cartCount = cartItems.length;

    // Determine current page for active state
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const navItems = [
        {
            label: 'Beranda',
            href: '/',
            icon: Home,
            isActive: currentUrl === '/' || currentUrl === '',
        },
        {
            label: 'Produk',
            href: route('shop.index'),
            icon: ShoppingBag,
            isActive: currentUrl.startsWith('/shop') || currentUrl.startsWith('/products') || currentUrl.startsWith('/produk-jasa'),
        },
        {
            label: 'Pesanan',
            href: user ? route('orders.my') : route('login'),
            icon: Package,
            isActive: currentUrl.startsWith('/my-orders') || currentUrl.startsWith('/orders'),
        },
        {
            label: user ? 'Akun' : 'Masuk',
            href: user ? route('profile.edit') : route('login'),
            icon: user ? User : LogIn,
            isActive: currentUrl.startsWith('/settings') || currentUrl.startsWith('/profile'),
        },
    ];

    // Keranjang active state
    const isCartActive = currentUrl.startsWith('/checkout') || currentUrl.startsWith('/cart');

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
            <div className="bg-white/95 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
                    {/* Beranda */}
                    {navItems.slice(0, 2).map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center py-2 px-3 min-w-[60px] relative transition-colors duration-200',
                                    item.isActive
                                        ? 'text-orange-600'
                                        : 'text-gray-400 active:text-gray-600'
                                )}
                            >
                                <div className="relative">
                                    <Icon
                                        className={cn(
                                            'h-[22px] w-[22px] transition-all duration-200',
                                            item.isActive && 'scale-110'
                                        )}
                                        strokeWidth={item.isActive ? 2.5 : 1.8}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        'text-[10px] mt-1 leading-none transition-all duration-200',
                                        item.isActive ? 'font-bold' : 'font-medium'
                                    )}
                                >
                                    {item.label}
                                </span>

                            </Link>
                        );
                    })}

                    {/* Keranjang — opens CartSheet instead of navigating */}
                    <CartSheet
                        trigger={
                            <button
                                className={cn(
                                    'flex flex-col items-center justify-center py-2 px-3 min-w-[60px] relative transition-colors duration-200',
                                    isCartActive
                                        ? 'text-orange-600'
                                        : 'text-gray-400 active:text-gray-600'
                                )}
                            >
                                <div className="relative">
                                    <ShoppingCart
                                        className={cn(
                                            'h-[22px] w-[22px] transition-all duration-200',
                                            isCartActive && 'scale-110'
                                        )}
                                        strokeWidth={isCartActive ? 2.5 : 1.8}
                                    />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow-sm">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        'text-[10px] mt-1 leading-none transition-all duration-200',
                                        isCartActive ? 'font-bold' : 'font-medium'
                                    )}
                                >
                                    Keranjang
                                </span>
                                {isCartActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-orange-500"
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    />
                                )}
                            </button>
                        }
                    />

                    {/* Pesanan & Akun */}
                    {navItems.slice(2).map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center py-2 px-3 min-w-[60px] relative transition-colors duration-200',
                                    item.isActive
                                        ? 'text-orange-600'
                                        : 'text-gray-400 active:text-gray-600'
                                )}
                            >
                                <div className="relative">
                                    <Icon
                                        className={cn(
                                            'h-[22px] w-[22px] transition-all duration-200',
                                            item.isActive && 'scale-110'
                                        )}
                                        strokeWidth={item.isActive ? 2.5 : 1.8}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        'text-[10px] mt-1 leading-none transition-all duration-200',
                                        item.isActive ? 'font-bold' : 'font-medium'
                                    )}
                                >
                                    {item.label}
                                </span>

                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.nav>
    );
}
