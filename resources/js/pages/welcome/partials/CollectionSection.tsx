import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ProductCard } from '@/components/ProductCard';

interface Product {
    id_produk: number;
    nama_produk: string;
    slug: string;
    harga: number;
    gambar_url: string;
    category: {
        name: string;
    };
}

interface CollectionSectionProps {
    isInView: boolean;
    products: Product[];
}

export default function CollectionSection({ isInView, products }: CollectionSectionProps) {
    const [activeFilter, setActiveFilter] = useState('Newest');
    const filters = ['Newest', 'Top Sell', 'Popular', 'Trending'];

    return (
        <section className={`py-20 bg-slate-50 transition-all duration-1000 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id_produk} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            <p>Belum ada produk untuk kategori ini.</p>
                        </div>
                    )}
                </div>

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
        </section>
    );
}
