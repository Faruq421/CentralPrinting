import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ShoppingCart, ArrowRight, Star, CheckCircle, Zap, Award } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { formatRupiah } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';

interface Product {
    id_produk: number;
    nama_produk: string;
    slug: string;
    harga: number;
    gambar: string;
    gambar_url: string;
    category: {
        name: string;
    };
}

interface HeroSectionProps {
    featuredProducts: Product[];
}

export default function HeroSection({ featuredProducts }: HeroSectionProps) {
    // Helper to get product image
    const getProductImage = (product: Product) => {
        if (product.gambar_url) return product.gambar_url;
        if (product.gambar) return `/storage/${product.gambar}`;
        return 'https://placehold.co/600x450/e2e8f0/64748b?text=No+Image';
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section className="relative bg-white w-full overflow-hidden py-4">
            <div className="w-full px-2 sm:px-4 lg:px-6">
                <div className="relative bg-gray-50 rounded-3xl p-6 sm:p-10 ring-1 ring-black/5 shadow-sm max-w-[1800px] mx-auto overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}
                    ></div>

                    {/* Gradient Blobs */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="relative z-10"
                    >
                        <motion.div variants={itemVariants} className="flex gap-2 text-sm text-gray-500 mb-4 items-center">
                            <span className="font-medium px-3 py-1 bg-white/80 backdrop-blur rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                                <Award className="w-3 h-3 text-orange-500" />
                                Pilihan Editor
                            </span>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div>
                                <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-7xl leading-[1.0] font-bold text-gray-900 tracking-tight font-geist">
                                    Kebutuhan Cetak <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Terlengkap.</span>
                                </motion.h2>
                                <motion.p variants={itemVariants} className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed font-normal max-w-xl">
                                    Solusi percetakan modern untuk bisnis Anda. Dari stiker detail tinggi hingga banner skala besar, kami kerjakan dengan presisi.
                                </motion.p>

                                <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-gray-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs sm:text-sm text-gray-700 font-medium">Eco-Friendly</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-gray-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-xs sm:text-sm text-gray-700 font-medium">Custom Size</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-gray-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                                        <span className="text-xs sm:text-sm text-gray-700 font-medium">Pro Design</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
                                    <Link href={route('shop.index')}>
                                        <Button size="lg" className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Mulai Belanja
                                        </Button>
                                    </Link>
                                    <Link href={route('shop.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 hover:bg-white/50 rounded-full">
                                        Lihat Katalog
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </motion.div>

                                <motion.div variants={itemVariants} className="mt-10 flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        <img src="https://placehold.co/100x100/e2e8f0/64748b?text=U1" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                        <img src="https://placehold.co/100x100/e2e8f0/64748b?text=U2" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                        <img src="https://placehold.co/100x100/e2e8f0/64748b?text=U3" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+2K</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                        <p className="text-gray-500 text-xs mt-0.5">Sudah dipercaya 2,000+ bisnis</p>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div variants={imageVariants} className="grid grid-cols-2 gap-4 relative">
                                {/* Floating decorative elements */}
                                <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400 rounded-full blur-2xl opacity-20"></div>

                                {/* Left Column Products (index 0, 2) */}
                                <div className="space-y-4 pt-12">
                                    {featuredProducts?.slice(0, 2).map((product, index) => (
                                        <Link key={product.id_produk} href={route('products.show', product.slug)} className="block">
                                            <div className="relative group rounded-2xl bg-white p-2 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                                                    <ImageWithFallback
                                                        src={getProductImage(product)}
                                                        alt={product.nama_produk}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    {index === 0 && (
                                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-orange-600 shadow-sm">
                                                            Best Seller
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-3 px-1 pb-1">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[120px]">{product.nama_produk}</h3>
                                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{formatRupiah(product.harga)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Right Column Products (index 1, 3) */}
                                <div className="space-y-4">
                                    {featuredProducts?.slice(2, 4).map((product, index) => (
                                        <Link key={product.id_produk} href={route('products.show', product.slug)} className="block">
                                            <div className="relative group rounded-2xl bg-white p-2 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                                                    <ImageWithFallback
                                                        src={getProductImage(product)}
                                                        alt={product.nama_produk}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    {index === 0 && (
                                                        <div className="absolute top-2 right-2 flex gap-1">
                                                            <span className="bg-blue-500 text-white p-1 rounded-full shadow-sm"><Zap className="w-3 h-3" /></span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-3 px-1 pb-1">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[120px]">{product.nama_produk}</h3>
                                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{product.category?.name || 'Produk'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
