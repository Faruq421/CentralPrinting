import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ProductCard } from '@/components/ProductCard';
import { ProductQuickView } from '@/components/ProductQuickView';
import { motion } from 'framer-motion';

interface Product {
    id_produk: number;
    nama_produk: string;
    slug: string;
    harga: number;
    gambar_url?: string;
    gambar?: string;
    category: {
        name: string;
    };
}

interface CollectionSectionProps {
    products: Product[];
}

export default function CollectionSection({ products }: CollectionSectionProps) {
    const [activeFilter, setActiveFilter] = useState('Newest');
    const filters = ['Newest', 'Top Sell', 'Popular', 'Trending'];

    const [isQuickViewOpen, setQuickViewOpen] = useState(false);
    const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

    const handleOpenQuickView = (slug: string) => {
        setSelectedProductSlug(slug);
        setQuickViewOpen(true);
    };

    const handleCloseQuickView = () => {
        setQuickViewOpen(false);
        setSelectedProductSlug(null);
    };

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
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
                >
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Koleksi Terbaru</h2>
                        <p className="mt-2 text-gray-600">Pilihan terbaik untuk kebutuhan promosi Anda.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${activeFilter === filter
                                    ? 'bg-gray-900 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <motion.div key={product.id_produk} variants={itemVariants}>
                                <ProductCard
                                    product={product}
                                    onQuickView={handleOpenQuickView}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            <p>Belum ada produk untuk kategori ini.</p>
                        </div>
                    )}
                </motion.div>

                <div className="mt-16 text-center">
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 h-12 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all font-semibold"
                    >
                        Lihat Semua Koleksi
                    </Button>
                </div>
            </div>

            {selectedProductSlug && (
                <ProductQuickView
                    productSlug={selectedProductSlug}
                    isOpen={isQuickViewOpen}
                    onClose={handleCloseQuickView}
                />
            )}
        </section>
    );
}
