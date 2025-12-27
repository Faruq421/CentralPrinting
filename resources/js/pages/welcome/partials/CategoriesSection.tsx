import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Printer, Sticker, CreditCard, Store, Image as ImageIcon, Shirt, PenTool, Gift, Package, Frame, LucideIcon, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
    id: number;
    name: string;
}

interface CategoriesSectionProps {
    categories: Category[];
}

// Mapping ikon dan warna berdasarkan nama kategori
const getCategoryMeta = (categoryName: string): { icon: LucideIcon; color: string; desc: string } => {
    const mapping: Record<string, { icon: LucideIcon; color: string; desc: string }> = {
        'Digital Printing': { icon: Printer, color: 'bg-blue-50 text-blue-600', desc: 'Brosur, Flyer, Dokumen' },
        'Sticker': { icon: Sticker, color: 'bg-green-50 text-green-600', desc: 'Vinyl, Chromo, Transparan' },
        'NameCard & Invitation': { icon: CreditCard, color: 'bg-purple-50 text-purple-600', desc: 'Premium, Spot UV, Matte' },
        'Display Promotion': { icon: Store, color: 'bg-orange-50 text-orange-600', desc: 'X-Banner, Roll Up Banner' },
        'Large Format': { icon: ImageIcon, color: 'bg-red-50 text-red-600', desc: 'Spanduk, Baliho, Billboard' },
        'Garment & Textile': { icon: Shirt, color: 'bg-indigo-50 text-indigo-600', desc: 'Kaos, Jersey, Tote Bag' },
        'Stationary': { icon: PenTool, color: 'bg-yellow-50 text-yellow-600', desc: 'Kop Surat, Amplop, Map' },
        'Merchandise': { icon: Gift, color: 'bg-pink-50 text-pink-600', desc: 'Mug, Tumbler, USB, Pin' },
        'Packaging': { icon: Package, color: 'bg-teal-50 text-teal-600', desc: 'Box Makanan, Paper Bag' },
        'Home Decor & Photo': { icon: Frame, color: 'bg-cyan-50 text-cyan-600', desc: 'Kanvas, Foto Blok, Poster' },
    };

    // Default jika kategori tidak ditemukan di mapping
    return mapping[categoryName] || { icon: Box, color: 'bg-gray-50 text-gray-600', desc: 'Produk berkualitas' };
};

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-orange-600 font-semibold tracking-wide uppercase text-sm">Layanan Lengkap</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Solusi Cetak untuk Semua Kebutuhan</h2>
                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        Dari kebutuhan bisnis hingga personal, kami menyediakan layanan cetak berkualitas tinggi dengan teknologi terbaru.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                >
                    {categories?.map((category, index) => {
                        const meta = getCategoryMeta(category.name);
                        const IconComponent = meta.icon;
                        return (
                            <motion.div key={index} variants={itemVariants}>
                                <Link
                                    href={route('shop.index', { category: category.name })}
                                    className="group relative block p-6 rounded-2xl border border-gray-100 hover:border-orange-200 bg-white hover:shadow-lg transition-all duration-300 h-full"
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${meta.color} group-hover:bg-orange-600 group-hover:text-white`}>
                                        <IconComponent className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{category.name}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{meta.desc}</p>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
