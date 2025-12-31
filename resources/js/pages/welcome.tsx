import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/layouts/SiteLayout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { route } from 'ziggy-js';
import { motion } from 'framer-motion';

// Partials
import HeroSection from './welcome/partials/HeroSection';
import USPSection from './welcome/partials/USPSection';
import CategoriesSection from './welcome/partials/CategoriesSection';
import FlashSaleSection from './welcome/partials/FlashSaleSection';

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
    products?: Product[]; // Added optional products relationship
}

export default function Welcome() {
    const { products, featuredProducts, categories } = usePage<{
        products: Product[],
        featuredProducts: Product[],
        categories: Category[]
    }>().props;

    return (
        <SiteLayout headerPadding={false}>
            <Head title="Pusat Cetak & Merchandise Terlengkap" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 min-h-screen font-sans pb-8"
            >

                {/* 1. HERO SECTION */}
                <HeroSection />

                {/* 2. USP SECTION */}
                <USPSection />

                {/* 3. CATEGORY GRID */}
                <CategoriesSection categories={categories} />

                {/* 4. PRODUCTS BY CATEGORY (Grouped Sections) */}
                {categories && categories.map((category) => (
                    category.products && category.products.length > 0 && (
                        <motion.section
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="container mx-auto px-4 lg:px-8 mb-16 py-8 "
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-orange-600 rounded-full inline-block"></span>
                                        {category.name}
                                    </h2>
                                </div>
                                <Link
                                    href={route('shop.index', { category: category.name })}
                                    className="group text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center bg-orange-50 px-4 py-2 rounded-full transition-colors"
                                >
                                    Lihat Semua <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {category.products.map((product) => (
                                    <ProductCard key={product.id_produk} product={product} />
                                ))}
                            </div>
                        </motion.section>
                    )
                ))}

            </motion.div>
        </SiteLayout>
    );
}
