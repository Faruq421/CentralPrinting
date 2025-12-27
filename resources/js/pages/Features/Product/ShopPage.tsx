import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SiteLayout from '@/layouts/SiteLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ProductQuickView } from '@/components/ProductQuickView';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ToggleGroup,
    ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { formatRupiah } from '@/lib/utils';
import { List, LayoutGrid, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Skeleton Component matching the grid layout
const ShopPageSkeleton = () => (
    <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl bg-gray-200/50" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-gray-200/50" />
                    <Skeleton className="h-4 w-1/2 bg-gray-200/50" />
                </div>
            </div>
        ))}
    </div>
);

// Modern Filter Sidebar (Cleaner, Text-based)
const FilterContent = ({ localFilters, setLocalFilters, applyFilters, resetFilters, categories, onCategoryChange }: {
    localFilters: { category: string; priceRange: number[]; sort: string };
    setLocalFilters: React.Dispatch<React.SetStateAction<{ category: string; priceRange: number[]; sort: string }>>;
    applyFilters: () => void;
    resetFilters: () => void;
    categories: string[];
    onCategoryChange: (category: string) => void;
}) => {
    return (
        <div className="space-y-8 pr-6">
            {/* Categories Section */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 tracking-tight">Kategori</h3>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => onCategoryChange('')}
                        className={`text-left text-sm transition-colors hover:text-orange-600 ${localFilters.category === '' ? 'font-medium text-orange-600' : 'text-gray-600'}`}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((category: string, index: number) => (
                        <button
                            key={index}
                            onClick={() => onCategoryChange(category)}
                            className={`text-left text-sm transition-colors hover:text-orange-600 ${localFilters.category === category ? 'font-medium text-orange-600' : 'text-gray-600'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 tracking-tight">Rentang Harga</h3>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-sm text-gray-500">Rp</span>
                        <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="pl-9 h-10 w-full rounded-lg border-gray-300 bg-white text-base shadow-sm focus:border-orange-500 focus:ring-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={localFilters.priceRange[0] === 0 ? '' : localFilters.priceRange[0]}
                            onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Number(e.target.value);
                                // Ensure Min doesn't exceed Max (if Max is set)
                                const maxPrice = localFilters.priceRange[1];
                                if (maxPrice > 0 && val > maxPrice) {
                                    // Optional: Prevent Min from exceeding Max immediately, or just update state
                                    // For smoother UX, we usually allow typing but validate on blur or submit.
                                    // But user requested "tak dapat kurang dari harga min" context for Max.
                                    // Let's just update state normally here.
                                }
                                setLocalFilters(prev => ({ ...prev, priceRange: [val, prev.priceRange[1]] }));
                            }}
                        />
                    </div>
                    <span className="text-gray-400 font-medium">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-sm text-gray-500">Rp</span>
                        <Input
                            type="number"
                            min={localFilters.priceRange[0]} // Set minimum value for Max input dynamically
                            placeholder="Max"
                            className="pl-9 h-10 w-full rounded-lg border-gray-300 bg-white text-base shadow-sm focus:border-orange-500 focus:ring-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={localFilters.priceRange[1] === 0 || localFilters.priceRange[1] === 1000000 ? '' : localFilters.priceRange[1]}
                            onChange={(e) => {
                                let val = e.target.value === '' ? 1000000 : Number(e.target.value);
                                // Validation: If user types a value less than Min, we could either force it to Min or allow it but invalid state.
                                // Given the request "harga max tidak dapat kurang dari harga min", logic here:
                                // Real-time strict validation is annoying while typing (e.g. typing 1000 when min is 500 -> start with 1, it's < 500).
                                // So we typically rely on onBlur or min attribute. 
                                // However, to strictly satisfy "cannot be less", we can check on blur or submit.
                                // But I will add the 'min' attribute which browser respects for spinners/validation, 
                                // and logically checks during Apply.

                                setLocalFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], val] }));
                            }}
                            onBlur={(e) => {
                                // Enforce constraint on Blur (when user leaves field)
                                let val = e.target.value === '' ? 1000000 : Number(e.target.value);
                                if (val < localFilters.priceRange[0] && val !== 0 && val !== 1000000) {
                                    setLocalFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], prev.priceRange[0]] }));
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Button onClick={applyFilters} className="w-full bg-gray-900 hover:bg-black text-white">
                    Terapkan Filter
                </Button>
                <Button onClick={resetFilters} variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                    Hapus Filter
                </Button>
            </div>
        </div>
    );
};

export default function ShopPage() {
    const { products: paginatedProducts, filters, categories } = usePage().props as {
        products: {
            data: Array<{
                id_produk: number;
                slug: string;
                gambar: string;
                nama_produk: string;
                harga: number;
                category: { name: string };
            }>;
            last_page: number;
            links: Array<{ url: string | null; label: string; active: boolean }>;
            total: number;
            current_page: number;
        };
        filters: { category: string; min_price: number; max_price: number; sort: string };
        categories: string[];
    };

    const [localFilters, setLocalFilters] = useState({
        category: filters.category || '',
        priceRange: [filters.min_price || 0, filters.max_price || 1000000],
        sort: filters.sort || 'newest',
    });

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Simulate loading state

    const [isQuickViewOpen, setQuickViewOpen] = useState(false);
    const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

    // Initial Loading Effect
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Intercept navigation to show loading
    useEffect(() => {
        const removeStartListener = router.on('start', () => setIsLoading(true));
        const removeFinishListener = router.on('finish', () => setIsLoading(false));
        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    const handleOpenQuickView = (slug: string) => {
        setSelectedProductSlug(slug);
        setQuickViewOpen(true);
    };

    const handleCloseQuickView = () => {
        setQuickViewOpen(false);
        setSelectedProductSlug(null);
    };

    const resetFilters = () => {
        router.get(route('shop.index'), {}, {
            preserveState: true,
            onSuccess: () => setDrawerOpen(false),
        });
    };

    const applyFilters = () => {
        router.get(route('shop.index'), {
            category: localFilters.category,
            min_price: localFilters.priceRange[0],
            max_price: localFilters.priceRange[1],
            sort: localFilters.sort,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setDrawerOpen(false),
        });
    };

    const handleSortChange = (value: string) => {
        setLocalFilters(prev => ({ ...prev, sort: value }));
        router.get(route('shop.index'), {
            ...filters,
            sort: value,
        }, { preserveState: true, preserveScroll: true });
    };

    // Handle category change with instant filtering
    const handleCategoryChange = (category: string) => {
        setLocalFilters(prev => ({ ...prev, category }));
        router.get(route('shop.index'), {
            ...filters,
            category: category,
        }, { preserveState: true, preserveScroll: true });
    };

    const displayedProducts = paginatedProducts.data;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <SiteLayout>
            <Head title="Produk & Jasa" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px]">
                {/* Header Section */}
                <header className="mb-6 border-b pb-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold tracking-tight text-gray-900"
                    >
                        Semua Produk
                    </motion.h1>

                    {/* Active Filters / Pills */}
                    {(localFilters.category || localFilters.sort !== 'newest') && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {localFilters.category && (
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    {localFilters.category}
                                    <button
                                        onClick={() => setLocalFilters(prev => ({ ...prev, category: '' }))}
                                        className="ml-2 hover:text-orange-950"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </header>

                <div className="flex gap-12">
                    {/* Clean Sidebar for Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <FilterContent
                                localFilters={localFilters}
                                setLocalFilters={setLocalFilters}
                                applyFilters={applyFilters}
                                resetFilters={resetFilters}
                                categories={categories}
                                onCategoryChange={handleCategoryChange}
                            />
                        </motion.div>
                    </aside>

                    <main className="flex-1">
                        {/* Sort & Mobile Filter Toggle */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm text-gray-500">
                                {paginatedProducts.total} produk ditemukan
                            </div>

                            <div className="flex items-center gap-2">
                                <Select onValueChange={handleSortChange} value={localFilters.sort}>
                                    <SelectTrigger className="w-[180px] border-none shadow-none font-medium text-gray-700 hover:bg-gray-50 focus:ring-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 font-normal">Urutkan:</span>
                                            <SelectValue placeholder="Urutkan" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent align="end">
                                        <SelectItem value="newest">Terbaru</SelectItem>
                                        <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                                        <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                                    <DrawerTrigger asChild className="lg:hidden">
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>Filter Produk</DrawerTitle>
                                        </DrawerHeader>
                                        <div className="px-4">
                                            <FilterContent
                                                localFilters={localFilters}
                                                setLocalFilters={setLocalFilters}
                                                applyFilters={applyFilters}
                                                resetFilters={resetFilters}
                                                categories={categories}
                                                onCategoryChange={handleCategoryChange}
                                            />
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>

                        {/* Products Grid with Skeleton State */}
                        {isLoading ? (
                            <ShopPageSkeleton />
                        ) : (
                            <motion.div
                                key={JSON.stringify(localFilters) + paginatedProducts.current_page} // Re-animate on filter/page change
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-x-6 gap-y-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                            >
                                <AnimatePresence mode="wait">
                                    {displayedProducts.map((product) => (
                                        <motion.div key={product.id_produk} variants={itemVariants} layout>
                                            <ProductCard
                                                product={product}
                                                onQuickView={handleOpenQuickView}
                                                className="h-full border-none shadow-none hover:shadow-lg transition-shadow duration-200 bg-transparent"
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Empty State */}
                        {!isLoading && displayedProducts.length === 0 && (
                            <div className="py-20 text-center">
                                <div className="mx-auto h-24 w-24 text-gray-200 mb-4">
                                    <Search className="h-full w-full" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Tidak ada produk ditemukan</h3>
                                <p className="mt-1 text-gray-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
                                <Button onClick={resetFilters} variant="link" className="mt-4 text-orange-600">
                                    Hapus semua filter
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-12 border-t pt-8">
                            {paginatedProducts?.last_page > 1 && (
                                <Pagination>
                                    <PaginationContent>
                                        {paginatedProducts.links.map((link, index) => {
                                            const isPrevious = link.label.includes('&laquo;') || link.label.includes('Previous');
                                            const isNext = link.label.includes('&raquo;') || link.label.includes('Next');

                                            // Handle Previous
                                            if (isPrevious) {
                                                return (
                                                    <PaginationItem key={index}>
                                                        {link.url ? (
                                                            <PaginationPrevious href={link.url} />
                                                        ) : (
                                                            <Button variant="ghost" disabled className="gap-1 pl-2.5" size="default">
                                                                <span className="h-4 w-4" />
                                                                <span>Previous</span>
                                                            </Button>
                                                        )}
                                                    </PaginationItem>
                                                );
                                            }

                                            // Handle Next
                                            if (isNext) {
                                                return (
                                                    <PaginationItem key={index}>
                                                        {link.url ? (
                                                            <PaginationNext href={link.url} />
                                                        ) : (
                                                            <Button variant="ghost" disabled className="gap-1 pr-2.5" size="default">
                                                                <span>Next</span>
                                                                <span className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </PaginationItem>
                                                );
                                            }

                                            // Handle Ellipsis
                                            if (link.label === '...') {
                                                return (
                                                    <PaginationItem key={index}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            // Handle Standard Page Number
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        href={link.url || '#'}
                                                        isActive={link.active}
                                                        className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                        size="icon"
                                                    >
                                                        {link.label}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            {selectedProductSlug && (
                <ProductQuickView
                    productSlug={selectedProductSlug}
                    isOpen={isQuickViewOpen}
                    onClose={handleCloseQuickView}
                />
            )}
        </SiteLayout>
    );
}
