import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { type PageProps } from '@/types';
import { route } from 'ziggy-js';
import { Search, User, Menu, ChevronDown, LogOut, UserCircle, Package, Printer, Gift, Briefcase, Phone, Mail, X, ArrowRight, ShoppingCart, Heart, Bell, MapPin, MessageCircle, Instagram, Facebook, Settings } from 'lucide-react';
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
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";



export default function SiteHeader({ auth }: PageProps) {
    const { user } = auth;
    const { categories } = usePage<PageProps & { categories: (string | { name: string })[] }>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = React.useRef(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDifference = lastScrollY.current - currentScrollY;

                    setIsScrolled(currentScrollY > 0);

                    if (currentScrollY < 100) {
                        setIsVisible(true);
                    } else if (scrollDifference > 10) {
                        setIsVisible(true);
                    } else if (scrollDifference < -5) {
                        setIsVisible(false);
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('shop.index'), { search: searchQuery.trim() });
            setIsMobileSearchOpen(false);
        }
    };

    useEffect(() => {
        if (isMobileSearchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isMobileSearchOpen]);


    return (
        <header className="w-full relative z-50">
            {/* WRAPPER: SMART HEADER */}
            <motion.div
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 w-full bg-white",
                    isScrolled && "shadow-md"
                )}
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : "-100%" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* 1. TOP BAR - Hidden on mobile */}
                <div className="bg-gray-100 text-[11px] font-medium text-gray-500 py-1.5 border-b border-gray-200 hidden md:block">
                    <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center space-x-6">
                            <span className="flex items-center hover:text-orange-600 transition-colors cursor-pointer">
                                <Phone className="h-3 w-3 mr-1.5 text-orange-500" /> +62 812-3456-7890
                            </span>
                            <span className="flex items-center hover:text-orange-600 transition-colors cursor-pointer">
                                <Mail className="h-3 w-3 mr-1.5 text-orange-500" /> info@centralprinting.com
                            </span>
                        </div>
                        <div className="flex items-center space-x-4 divide-x divide-gray-300">
                            <Link href="#" className="hover:text-orange-600 transition-colors pr-4">Tentang Kami</Link>
                            <Link href="#" className="hover:text-orange-600 transition-colors px-4">Bantuan</Link>
                            <Link href="#" className="hover:text-orange-600 transition-colors pl-4">Download App</Link>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN HEADER (Logo, Search, Actions) */}
                <div className={cn(
                    "border-b border-gray-100 transition-all duration-300",
                    isScrolled ? "py-2 lg:py-3" : "py-3 lg:py-5"
                )}>
                    <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <img src="/storage/logo/logo.png" alt="Central Printing" className="h-8 lg:h-10 w-auto" />
                        </Link>

                        {/* Search Bar (Desktop) */}
                        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl relative group">
                            <div className="flex w-full items-center">
                                <input
                                    type="text"
                                    placeholder="Cari layanan cetak, spanduk, atau merchandise..."
                                    className="w-full h-11 pl-4 pr-12 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button type="submit" className="h-11 px-6 rounded-l-none rounded-r-lg bg-orange-600 hover:bg-orange-700 text-white shadow-sm font-bold">
                                    <Search className="h-5 w-5" />
                                </Button>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 lg:gap-6 flex-shrink-0">
                            {/* Search Trigger (Mobile) */}
                            <div className="lg:hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setIsMobileSearchOpen(true)}
                                >
                                    <Search className="h-5 w-5 text-gray-700" />
                                </Button>
                            </div>

                            {/* Cart (desktop only, mobile uses bottom nav) */}
                            <div className="hidden lg:block">
                                <CartSheet />
                            </div>

                            {/* User / Auth (Desktop only) */}
                            <div className="hidden lg:block pl-2 border-l border-gray-200">
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-all group">
                                                <div className="h-9 w-9 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm border border-orange-200 group-hover:scale-105 transition-transform">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="text-left hidden xl:block">
                                                    <p className="text-xs text-gray-500 font-medium leading-none mb-1">Halo,</p>
                                                    <p className="text-sm font-bold text-gray-900 leading-none truncate max-w-[100px]">{user.name.split(' ')[0]}</p>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-gray-400" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
                                            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {!!user.is_admin && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('products.index')} className="cursor-pointer"><UserCircle className="mr-2 h-4 w-4" /> Dashboard Admin</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href={route('orders.my')} className="cursor-pointer"><Package className="mr-2 h-4 w-4" /> Pesanan Saya</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('profile.edit')} className="cursor-pointer"><Settings className="mr-2 h-4 w-4" /> Kelola Akun</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
                                                <Link href={route('logout')} method="post" as="button" className="w-full text-left cursor-pointer"><LogOut className="mr-2 h-4 w-4" /> Keluar</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link href={route('login')} className="text-sm font-bold text-gray-700 hover:text-orange-600">
                                            Masuk
                                        </Link>
                                        <span className="h-4 w-px bg-gray-300"></span>
                                        <Link href={route('register')} className="text-sm font-bold text-orange-600 hover:text-orange-700">
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. NAVIGATION BAR - Desktop only */}
                <div className="bg-white border-b border-gray-200 hidden lg:block">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex items-center gap-8">
                            {/* Categories Dropdown */}
                            <div className="relative group/cat z-30">
                                <button className="flex items-center gap-3 bg-gray-100 px-6 py-3.5 text-sm font-bold text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer border-l border-r border-gray-100 min-w-[150px]">
                                    <Menu className="h-5 w-5" />
                                    Kategori
                                    <ChevronDown className="h-4 w-4 ml-auto text-gray-500" />
                                </button>

                                <div className="absolute top-full left-0 w-[600px] bg-white shadow-xl rounded-b-xl border border-gray-100 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 translate-y-2 group-hover/cat:translate-y-0">
                                    <div className="grid grid-cols-3 gap-4 p-6">
                                        {categories && categories.map((category) => {
                                            const categoryName = typeof category === 'string' ? category : category.name;
                                            return (
                                                <Link
                                                    key={categoryName}
                                                    href={route('shop.index', { category: categoryName })}
                                                    className="flex items-center gap-2 p-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all group"
                                                >
                                                    <Printer className="h-4 w-4 text-orange-500" />
                                                    <span className="font-medium">{categoryName}</span>
                                                    <ArrowRight className="h-3 w-3 ml-auto opacity-0 -mr-2 group-hover:opacity-100 group-hover:mr-0 transition-all" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-b-xl border-t border-gray-100 text-center">
                                        <Link href={route('shop.index')} className="text-sm font-semibold text-orange-600 hover:underline">
                                            Lihat Semua Produk &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Main Navigation Links */}
                            <nav className="flex items-center gap-8">
                                <Link href="/" className={cn("text-sm font-semibold hover:text-orange-600 transition-colors relative py-3 group", route().current('welcome') ? "text-orange-600" : "text-gray-600")}>
                                    Beranda
                                    <span className={cn("absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left", route().current('welcome') && "scale-x-100")}></span>
                                </Link>
                                <Link href={route('shop.index')} className={cn("text-sm font-semibold hover:text-orange-600 transition-colors relative py-3 group", route().current('shop.*') ? "text-orange-600" : "text-gray-600")}>
                                    Semua Produk
                                </Link>
                                <Link href={route('locations.index')} className={cn("text-sm font-semibold hover:text-orange-600 transition-colors relative py-3 group", route().current('locations.index') ? "text-orange-600" : "text-gray-600")}>
                                    Lokasi Toko
                                    <span className={cn("absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left", route().current('locations.index') && "scale-x-100")}></span>
                                </Link>

                                {/* Contact Us Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors py-3 flex items-center gap-1">
                                        Contact Us
                                        <ChevronDown className="h-3 w-3" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 mt-2">
                                        <DropdownMenuLabel>Hubungi Kami</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <a href="https://wa.me/https://api.whatsapp.com/send/?phone=%2B6285271569045&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center">
                                                <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                                                WhatsApp
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href="https://www.instagram.com/centralprinting_duri?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center">
                                                <Instagram className="mr-2 h-4 w-4 text-pink-600" />
                                                Instagram
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href="https://www.facebook.com/people/Central-Printing-Duri/pfbid02obuDVuPbPXt8Pa2ZWPbPvAUyhMWhzyRSd4oYkCHMsY7jAydZ7vfJVwZ37H4VZP9zl/" target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center">
                                                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                                                Facebook
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <a href="mailto:info@centralprinting.com" className="cursor-pointer flex items-center">
                                                <Mail className="mr-2 h-4 w-4 text-gray-600" />
                                                Email
                                            </a>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </nav>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {isMobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 z-[60] bg-white lg:hidden"
                    >
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shadow-sm">
                            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Cari produk, layanan..."
                                        className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-5 h-10 font-semibold text-sm">
                                    Cari
                                </Button>
                            </form>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full text-gray-500"
                                onClick={() => setIsMobileSearchOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Quick category suggestions */}
                        <div className="px-4 py-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Kategori Populer</p>
                            <div className="flex flex-wrap gap-2">
                                {categories && categories.slice(0, 8).map((category) => {
                                    const categoryName = typeof category === 'string' ? category : category.name;
                                    return (
                                        <Link
                                            key={categoryName}
                                            href={route('shop.index', { category: categoryName })}
                                            onClick={() => setIsMobileSearchOpen(false)}
                                            className="px-3.5 py-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-100 rounded-full text-sm font-medium text-gray-600 transition-colors"
                                        >
                                            {categoryName}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SPACER FOR FIXED HEADER */}
            <div className="h-[60px] md:h-[115px] lg:h-[170px] w-full" aria-hidden="true" />
        </header>
    );
}
