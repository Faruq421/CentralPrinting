import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { type PageProps } from '@/types';
import { route } from 'ziggy-js';
import { Search, User, Menu, ChevronDown, LogOut, UserCircle, Package, Printer, Gift, Briefcase, Phone, Mail, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartSheet } from '@/components/CartSheet';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const productCategories = [
    { title: 'Promosi & Marketing', icon: <Printer className="h-5 w-5 text-orange-500" />, items: ['Digital Printing', 'Display Promotion', 'Large Format', 'Sticker', 'NameCard & Invitation'] },
    { title: 'Produk & Merchandise', icon: <Gift className="h-5 w-5 text-orange-500" />, items: ['Garment & Textile', 'Merchandise', 'Packaging', 'Home Decor & Photo'] },
    { title: 'Kebutuhan Kantor', icon: <Briefcase className="h-5 w-5 text-orange-500" />, items: ['Stationary', 'Kop Surat', 'Amplop', 'ID Card'] }
];

export default function SiteHeader({ auth }: PageProps) {
    const { user } = auth;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed w-full top-0 z-50 transition-all duration-300",
            isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
        )}>
            {/* Top Bar - Light Theme */}
            <div className={cn(
                "bg-gray-50 text-gray-600 text-xs transition-all duration-300 overflow-hidden border-b border-gray-100",
                isScrolled ? "max-h-0 py-0 border-transparent" : "max-h-12 py-2.5"
            )}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <a href="tel:08123456789" className="flex items-center hover:text-orange-600 transition-colors">
                            <Phone className="h-3.5 w-3.5 mr-2 text-orange-500" />
                            <span className="font-medium">0812-3456-7890</span>
                        </a>
                        <a href="mailto:info@printshop.com" className="hidden sm:flex items-center hover:text-orange-600 transition-colors">
                            <Mail className="h-3.5 w-3.5 mr-2 text-orange-500" />
                            <span className="font-medium">info@printshop.com</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="#" className="hover:text-orange-600 transition-colors">Lacak Pesanan</Link>
                        <span className="text-gray-300">|</span>
                        <Link href="#" className="hover:text-orange-600 transition-colors">Bantuan</Link>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className={cn(
                "container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center transition-all duration-300",
                isScrolled ? "py-3" : "py-5"
            )}>
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <img
                        src="/storage/logo/logo.png"
                        alt="Logo PrintShop"
                        className={cn("w-auto transition-all duration-300", isScrolled ? "h-8" : "h-10")}
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center justify-center flex-1 px-8">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "bg-transparent hover:bg-transparent hover:text-orange-600 font-medium",
                                            route().current('welcome') ? "text-orange-600 font-bold" : "text-gray-700"
                                        )}
                                    >
                                        Beranda
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    className={cn(
                                        "bg-transparent hover:text-orange-600 font-medium hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                                        route().current('shop.*') ? "text-orange-600 font-bold" : "text-gray-700"
                                    )}
                                >
                                    Produk & Jasa
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="w-[850px] p-8 bg-white rounded-2xl shadow-xl border border-gray-100 ring-1 ring-black/5">
                                        <div className="grid grid-cols-3 gap-10">
                                            {productCategories.map((category) => (
                                                <div key={category.title} className="group cursor-pointer">
                                                    <div className="flex items-center gap-3 mb-4 p-2 -ml-2 rounded-lg group-hover:bg-gray-50 transition-colors">
                                                        <div className="p-2.5 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                                                            {React.cloneElement(category.icon as React.ReactElement, { className: "h-5 w-5" })}
                                                        </div>
                                                        <h3 className="font-bold text-gray-900 text-base">{category.title}</h3>
                                                    </div>

                                                    <div className="space-y-1">
                                                        {category.items.map((item) => (
                                                            <Link
                                                                key={item}
                                                                href={route('shop.index', { category: category.title })}
                                                                className="flex items-center justify-between py-2 px-3 -mx-3 rounded-md text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all group/item"
                                                            >
                                                                <span>{item}</span>
                                                                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-orange-500" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 -mx-8 -mb-8 px-8 py-4">
                                            <p className="text-sm text-gray-500">Tidak menemukan yang Anda cari?</p>
                                            <Link href={route('shop.index')} className="text-sm font-semibold text-gray-900 hover:text-orange-600 flex items-center gap-2 transition-colors">
                                                Jelajahi Semua Kategori
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-gray-700 hover:text-orange-600 font-medium")}>
                                        Portofolio
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="#" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-gray-700 hover:text-orange-600 font-medium")}>
                                        Panduan Cetak
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">


                    <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block"></div>

                    <CartSheet />

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50 hover:text-orange-600">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border border-gray-100 shadow-lg">
                                <DropdownMenuLabel className="px-2 py-1.5">
                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500 font-normal">{user.email}</div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {!!user.is_admin && (
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                        <Link href={route('products.index')}><UserCircle className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                    <Link href="#"><User className="mr-2 h-4 w-4" />Profil Saya</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                    <Link href={route('orders.my')}><Package className="mr-2 h-4 w-4" />Pesanan Saya</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-red-600 focus:text-red-700">
                                    <Link href={route('logout')} method="post" as="button" className="w-full text-left">
                                        <LogOut className="mr-2 h-4 w-4" />Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden sm:flex items-center gap-3 ml-2">
                            <Link href={route('login')} className="text-sm font-semibold text-gray-700 hover:text-orange-600 px-3">
                                Log in
                            </Link>
                            <Button asChild className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl transition-all h-10 px-6">
                                <Link href={route('register')}>Daftar</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Trigger */}
                    <div className="lg:hidden ml-2">
                        <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="-mr-2">
                                    <Menu className="h-6 w-6 text-gray-700" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-full h-[100dvh] max-w-full rounded-none border-none p-0 flex flex-col bg-white">
                                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between shrink-0">
                                    <DialogTitle>
                                        <img src="/storage/logo/logo.png" alt="Logo" className="h-8 w-auto" />
                                    </DialogTitle>
                                    <DialogClose className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors">
                                        <X className="h-5 w-5 text-gray-500" />
                                        <span className="sr-only">Close</span>
                                    </DialogClose>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto py-6 px-6">
                                    <div className="space-y-1">
                                        <Link
                                            href="/"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-4 text-lg font-semibold text-gray-900 border-b border-gray-100"
                                        >
                                            Beranda
                                        </Link>

                                        <div className="py-4 border-b border-gray-100">
                                            <p className="mb-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Produk & Layanan</p>
                                            <div className="space-y-6">
                                                {productCategories.map((category) => (
                                                    <div key={category.title}>
                                                        <div className="flex items-center gap-2 mb-3 text-orange-600">
                                                            {category.icon}
                                                            <span className="font-semibold">{category.title}</span>
                                                        </div>
                                                        <ul className="pl-7 space-y-3">
                                                            {category.items.map((item) => (
                                                                <li key={item}>
                                                                    <Link
                                                                        href={route('shop.index', { category: category.title })}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className="text-gray-600 text-base"
                                                                    >
                                                                        {item}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Link
                                            href="#"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-4 text-lg font-semibold text-gray-900 border-b border-gray-100"
                                        >
                                            Portofolio
                                        </Link>
                                        <Link
                                            href="#"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-4 text-lg font-semibold text-gray-900 border-b border-gray-100"
                                        >
                                            Panduan Cetak
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 border-t bg-gray-50 shrink-0">
                                    {!user ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button variant="outline" size="lg" className="w-full" asChild>
                                                <Link href={route('login')}>Log in</Link>
                                            </Button>
                                            <Button size="lg" className="w-full bg-neutral-900 text-white hover:bg-neutral-800" asChild>
                                                <Link href={route('register')}>Daftar</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="destructive" size="lg" className="w-full" asChild>
                                            <Link href={route('logout')} method="post" as="button">Logout</Link>
                                        </Button>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </nav>
        </header>
    );
}
