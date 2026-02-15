import React from 'react';
import { usePage } from '@inertiajs/react';
import { type PageProps } from '@/types';

// Impor Header & Footer dari lokasi BARU
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

// Impor Toaster/Sonner untuk notifikasi global
import { Toaster } from '@/components/ui/sonner';

export default function SiteLayout({ children, headerPadding = true }: { children: React.ReactNode, headerPadding?: boolean }) {
    // Ambil 'auth' dari props global untuk diteruskan ke Header
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header Situs menerima props 'auth' */}
            <SiteHeader auth={auth} />

            {/* 'children' adalah konten halaman spesifik (Welcome, MyOrders, etc.) */}
            {/* pb-20 on mobile for bottom nav safe area */}
            <main className="flex-1 pb-20 lg:pb-0">
                {children}
            </main>

            {/* Footer Situs */}
            <SiteFooter />

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />

            {/* Toaster untuk notifikasi di semua halaman */}
            <Toaster richColors position="top-right" />
        </div>
    );
}
