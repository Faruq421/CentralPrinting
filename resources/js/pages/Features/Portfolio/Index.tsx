import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/layouts/SiteLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    image: string;
    desc: string;
}

interface PortfolioIndexProps {
    portfolioItems: PortfolioItem[];
}

export default function PortfolioIndex({ portfolioItems }: PortfolioIndexProps) {
    const [activeFilter, setActiveFilter] = useState('Semua');

    // Ambil daftar kategori unik
    const categories = ['Semua', ...Array.from(new Set(portfolioItems.map(item => item.category)))];

    // Filter item yang ditampilkan
    const filteredItems = activeFilter === 'Semua'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeFilter);

    return (
        <SiteLayout>
            <Head title="Portofolio Kami" />

            {/* Hero Section */}
            <div className="relative bg-neutral-900 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1572521166609-0c6a5bb17208?q=80&w=2070&auto=format&fit=crop"
                        alt="Creative Studio"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>

                <div className="relative container mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-sm font-medium mb-6">
                            Showcase Project
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-geist tracking-tight">
                            Karya Terbaik <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Central Printing</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-gray-300 mb-8 leading-relaxed">
                            Koleksi proyek pilihan yang menunjukkan dedikasi kami pada kualitas, presisi, dan kreativitas dalam setiap cetakan.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6">

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === category
                                    ? 'bg-neutral-900 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Masonry Grid-like Layout */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <AnimatePresence>
                            {filteredItems.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={item.id}
                                    className="group relative cursor-pointer"
                                    onClick={() => {/* Bisa ditambahkan modal preview */ }}
                                >
                                    {/* Card Container */}
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-200">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />

                                        {/* Overlay Content */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <span className="text-orange-400 text-xs font-bold tracking-wider uppercase mb-2 block translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                                {item.category}
                                            </span>
                                            <h3 className="text-white text-xl font-bold leading-tight mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-300 text-sm line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Call to Action (CTA) */}
                    <div className="mt-20 text-center">
                        <div className="bg-orange-50 rounded-3xl p-8 sm:p-12 border border-orange-100 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Punya Proyek Serupa?</h2>
                            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                                Konsultasikan kebutuhan cetak Anda dengan tim ahli kami dan dapatkan penawaran terbaik.
                            </p>
                            <Link href={route('shop.index')}>
                                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8">
                                    Mulai Proyek Anda <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </SiteLayout>
    );
}
