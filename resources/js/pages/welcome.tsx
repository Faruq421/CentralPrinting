import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/layouts/SiteLayout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, CheckCircle, Clock, ShieldCheck, Truck, Star, Zap } from 'lucide-react';

// Interfaces
interface Product {
    id_produk: number;
    nama_produk: string;
    slug: string;
    harga: number;
    gambar: string;
    gambar_url?: string;
    category: {
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

export default function Welcome() {
    const { products, featuredProducts, categories } = usePage<{
        products: Product[],
        featuredProducts: Product[],
        categories: Category[]
    }>().props;

    return (
        <SiteLayout>
            <Head title="Pusat Cetak & Merchandise Terlengkap" />

            <div className="bg-gray-50 min-h-screen font-sans pb-20">

                {/* 1. HERO SECTION (Carousel + Banners) */}
                <section className="container mx-auto px-4 lg:px-8 py-4 lg:py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Main Carousel (8 cols) */}
                        <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-sm relative group">
                            <Carousel
                                className="w-full h-[200px] sm:h-[300px] lg:h-[400px]"
                                opts={{ loop: true }}
                            >
                                <CarouselContent>
                                    {[1, 2, 3].map((_, index) => (
                                        <CarouselItem key={index} className="pl-0">
                                            <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] bg-gray-900 flex items-center justify-center overflow-hidden">
                                                {/* Placeholder Gradient Backgrounds */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-orange-500 to-red-600' :
                                                        index === 1 ? 'from-blue-600 to-cyan-500' :
                                                            'from-emerald-500 to-teal-700'
                                                    } opacity-90`}></div>

                                                <div className="relative z-10 text-center text-white px-4 max-w-lg">
                                                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                                                        {index === 0 ? "Cetak Spanduk Kilat" : index === 1 ? "Merchandise Kantor" : "Diskon Member Baru"}
                                                    </h2>
                                                    <p className="text-white/90 text-sm sm:text-lg mb-6">
                                                        {index === 0 ? "Bisa ditunggu, kualitas tajam, tahan cuaca." : "Tingkatkan branding perusahaan dengan merchandise premium."}
                                                    </p>
                                                    <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8">
                                                        Lihat Penawaran
                                                    </Button>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white text-white hover:text-black border-none" />
                                <CarouselNext className="right-4 bg-white/10 hover:bg-white text-white hover:text-black border-none" />
                            </Carousel>
                        </div>

                        {/* Side Banners (4 cols) - Desktop Only */}
                        <div className="hidden lg:grid lg:col-span-4 grid-rows-2 gap-6">
                            <div className="bg-orange-100 rounded-2xl p-6 flex flex-col justify-center items-start hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
                                <div className="z-10 relative">
                                    <span className="text-orange-600 font-bold text-xs uppercase tracking-wider mb-2 block">Promo Spesial</span>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Kartu Nama<br />Premium</h3>
                                    <p className="text-gray-600 text-sm mb-4">Mulai Rp 25rb / box</p>
                                    <ArrowRight className="text-orange-600 h-5 w-5" />
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10">
                                    <Star className="h-32 w-32" />
                                </div>
                            </div>
                            <div className="bg-blue-100 rounded-2xl p-6 flex flex-col justify-center items-start hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
                                <div className="z-10 relative">
                                    <span className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-2 block">Layanan Baru</span>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Custom<br />Packaging</h3>
                                    <p className="text-gray-600 text-sm mb-4">Min. Order Rendah</p>
                                    <ArrowRight className="text-blue-600 h-5 w-5" />
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10">
                                    <CheckCircle className="h-32 w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. USP BAR (Keunggulan) */}
                <section className="bg-white border-y border-gray-100 py-6 mb-8">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Pengerjaan Kilat</h4>
                                    <p className="text-xs text-gray-500">Sehari jadi untuk produk tertentu</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Jaminan Kualitas</h4>
                                    <p className="text-xs text-gray-500">Garansi cetak ulang jika cacat</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Pengiriman Luas</h4>
                                    <p className="text-xs text-gray-500">Jangkauan seluruh Indonesia</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Harga Kompetitif</h4>
                                    <p className="text-xs text-gray-500">Murah tanpa kurangi kualitas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. CATEGORIES GRID */}
                <section className="container mx-auto px-4 lg:px-8 mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Kategori Populer</h2>
                        <Link href={route('shop.index')} className="text-orange-600 font-semibold text-sm hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories && categories.length > 0 ? categories.slice(0, 6).map((cat, idx) => (
                            <Link key={cat.id} href={route('shop.index')} className="group block">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all text-center h-full flex flex-col items-center justify-center gap-3 group-hover:border-orange-200">
                                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                        {/* Placeholder Icon based on index */}
                                        <Star className="h-8 w-8" />
                                    </div>
                                    <span className="font-semibold text-gray-700 group-hover:text-orange-600 text-sm">{cat.name}</span>
                                </div>
                            </Link>
                        )) : (
                            // Fallback if no categories loaded
                            ['Banner', 'Stiker', 'Kartu Nama', 'Brosur', 'Kaos', 'Mug'].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm cursor-pointer hover:shadow-md hover:border-orange-200 border border-transparent transition-all">
                                    <div className="h-14 w-14 bg-gray-100 rounded-full mx-auto mb-3"></div>
                                    <span className="font-semibold text-gray-700">{item}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 4. FEATURED PRODUCTS (Flash Sale Style) */}
                <section className="container mx-auto px-4 lg:px-8 mb-12">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                                    <Zap className="fill-yellow-400 text-yellow-400" />
                                    Flash Sale Hari Ini
                                </h2>
                                <p className="text-orange-100">Dapatkan harga terbaik sebelum waktu habis!</p>
                            </div>
                            <Button variant="secondary" className="mt-4 md:mt-0 font-bold text-orange-600 bg-white hover:bg-gray-100">
                                Lihat Semua Promo
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            {featuredProducts && featuredProducts.slice(0, 4).map((product) => (
                                <div key={product.id_produk} className="bg-white rounded-xl overflow-hidden text-gray-900 p-3">
                                    <ProductCard product={product} className="shadow-none border-none h-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. ALL PRODUCTS FEED */}
                <section className="container mx-auto px-4 lg:px-8 mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Rekomendasi Untuk Anda</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                        {products && products.map((product) => (
                            <ProductCard key={product.id_produk} product={product} />
                        ))}
                    </div>
                    <div className="mt-10 text-center">
                        <Button variant="outline" size="lg" className="min-w-[200px] font-semibold">
                            Muat Lebih Banyak
                        </Button>
                    </div>
                </section>

            </div>
        </SiteLayout>
    );
}
