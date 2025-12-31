import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import SiteLayout from '@/layouts/SiteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { Filter, ShoppingCart, Eye, Star, X, Search } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/ProductCard';

// --- INTERFACES ---
interface Product {
    id_produk: number;
    nama_produk: string;
    slug: string;
    harga: number;
    gambar: string;
    gambar_url?: string;
    deskripsi?: string;
    category: {
        id: number;
        name: string;
    };
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    search?: string;
    sort?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
}

interface ShopPageProps {
    products: PaginatedProducts;
    filters: Filters;
    categories: string[];
}

// --- SKELETON COMPONENT ---
const ProductCardSkeleton = () => (
    <Card className="overflow-hidden border-0 shadow-sm">
        <div className="aspect-square bg-gray-100 animate-pulse" />
        <CardContent className="p-4 space-y-3">
            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-1/3 bg-gray-100 rounded animate-pulse mt-2" />
        </CardContent>
    </Card>
);

export default function ShopPage() {
    // Get props from Inertia
    const { products: paginatedProducts, filters, categories } = usePage<ShopPageProps>().props;

    // Local state for filters
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        category: filters.category || '',
        priceRange: [filters.min_price || 0, filters.max_price || 2000000],
        sort: filters.sort || 'newest',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        filters.category ? [filters.category] : []
    );

    // Listen for Inertia events to set loading state
    useEffect(() => {
        const removeStart = router.on('start', () => setIsLoading(true));
        const removeFinish = router.on('finish', () => setIsLoading(false));
        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    // Toggle category selection
    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // Apply filters function
    const applyFilters = () => {
        router.get(route('shop.index'), {
            search: localFilters.search || undefined,
            category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
            min_price: localFilters.priceRange[0] > 0 ? localFilters.priceRange[0] : undefined,
            max_price: localFilters.priceRange[1] < 2000000 ? localFilters.priceRange[1] : undefined,
            sort: localFilters.sort !== 'newest' ? localFilters.sort : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle sort change - apply immediately
    const handleSortChange = (value: string) => {
        setLocalFilters(prev => ({ ...prev, sort: value }));
        router.get(route('shop.index'), {
            ...filters,
            sort: value,
        }, { preserveState: true, preserveScroll: true });
    };

    // Reset filters
    const resetFilters = () => {
        setLocalFilters({
            search: '',
            category: '',
            priceRange: [0, 2000000],
            sort: 'newest',
        });
        setSelectedCategories([]);
        router.get(route('shop.index'), {}, { preserveState: true });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    const displayedProducts = paginatedProducts.data;

    return (
        <SiteLayout>
            <Head title="Belanja Sekarang" />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-8 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 py-4 border-b">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Produk & Jasa</p>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{paginatedProducts.total} Produk Ditemukan</span>
                            {filters.search && (
                                <Badge variant="secondary" className="ml-2">
                                    Pencarian: "{filters.search}"
                                    <button
                                        onClick={() => {
                                            setLocalFilters(prev => ({ ...prev, search: '' }));
                                            router.get(route('shop.index'), { ...filters, search: undefined }, { preserveState: true });
                                        }}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Mobile Filter Sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden w-full md:w-auto">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Filter Produk</SheetTitle>
                                    <SheetDescription>Sesuaikan tampilan produk</SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="font-medium text-sm text-gray-900">Kategori</h3>
                                        <div className="grid gap-2">
                                            {categories.map(category => (
                                                <div key={category} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`m-${category}`}
                                                        checked={selectedCategories.includes(category)}
                                                        onCheckedChange={() => toggleCategory(category)}
                                                    />
                                                    <label htmlFor={`m-${category}`} className="text-sm cursor-pointer">{category}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm text-gray-900">Harga</h3>
                                        <Slider
                                            defaultValue={[0, 2000000]}
                                            max={2000000}
                                            step={10000}
                                            value={localFilters.priceRange}
                                            onValueChange={(val) => setLocalFilters(prev => ({ ...prev, priceRange: val }))}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{formatRupiah(localFilters.priceRange[0])}</span>
                                            <span>{formatRupiah(localFilters.priceRange[1])}</span>
                                        </div>
                                    </div>
                                    <Button onClick={applyFilters} className="w-full">Terapkan Filter</Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Sort Dropdown */}
                        <Select value={localFilters.sort} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="price-low">Harga Terendah</SelectItem>
                                <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-8 items-start">
                    {/* --- DESKTOP SIDEBAR --- */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-32">
                        <Card className="border-none shadow-none bg-transparent">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="text-lg">Filter</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 space-y-8">
                                {/* Categories */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-gray-900">Kategori</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <div key={category} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`d-${category}`}
                                                    checked={selectedCategories.includes(category)}
                                                    onCheckedChange={() => toggleCategory(category)}
                                                    className="border-gray-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                                />
                                                <label
                                                    htmlFor={`d-${category}`}
                                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-600 hover:text-gray-900"
                                                >
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Price */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm text-gray-900">Rentang Harga</h3>
                                    <Slider
                                        defaultValue={[0, 2000000]}
                                        max={2000000}
                                        step={10000}
                                        value={localFilters.priceRange}
                                        onValueChange={(val) => setLocalFilters(prev => ({ ...prev, priceRange: val }))}
                                        className="py-4"
                                    />
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="bg-gray-50 rounded px-2 py-1 text-xs text-gray-600 w-24 text-center">
                                            {formatRupiah(localFilters.priceRange[0])}
                                        </div>
                                        <span className="text-gray-400">-</span>
                                        <div className="bg-gray-50 rounded px-2 py-1 text-xs text-gray-600 w-24 text-center">
                                            {formatRupiah(localFilters.priceRange[1])}
                                        </div>
                                    </div>
                                </div>

                                {/* Apply & Reset Buttons */}
                                <div className="space-y-2">
                                    <Button onClick={applyFilters} className="w-full bg-orange-600 hover:bg-orange-700">
                                        Terapkan Filter
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full text-xs h-8"
                                        onClick={resetFilters}
                                    >
                                        Reset Filter
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* --- PRODUCT GRID --- */}
                    <main className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {displayedProducts.map((product) => (
                                        <motion.div key={product.id_produk} variants={itemVariants} layout className="h-full">
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Empty State */}
                                {displayedProducts.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                                    >
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Tidak ada produk ditemukan</h3>
                                        <p className="text-gray-500 text-sm mt-1 mb-4">
                                            {filters.search
                                                ? `Tidak ada hasil untuk "${filters.search}". Coba kata kunci lain.`
                                                : 'Coba sesuaikan filter kategori atau harga Anda.'
                                            }
                                        </p>
                                        <Button variant="outline" onClick={resetFilters}>
                                            Reset Filter
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {paginatedProducts.last_page > 1 && (
                            <div className="mt-12 border-t pt-8">
                                <Pagination>
                                    <PaginationContent>
                                        {paginatedProducts.links.map((link, index) => {
                                            const isPrevious = link.label.includes('&laquo;') || link.label.includes('Previous');
                                            const isNext = link.label.includes('&raquo;') || link.label.includes('Next');

                                            if (isPrevious) {
                                                return (
                                                    <PaginationItem key={index}>
                                                        {link.url ? (
                                                            <PaginationPrevious href={link.url} />
                                                        ) : (
                                                            <Button variant="ghost" disabled className="gap-1 pl-2.5" size="default">
                                                                <span>Previous</span>
                                                            </Button>
                                                        )}
                                                    </PaginationItem>
                                                );
                                            }

                                            if (isNext) {
                                                return (
                                                    <PaginationItem key={index}>
                                                        {link.url ? (
                                                            <PaginationNext href={link.url} />
                                                        ) : (
                                                            <Button variant="ghost" disabled className="gap-1 pr-2.5" size="default">
                                                                <span>Next</span>
                                                            </Button>
                                                        )}
                                                    </PaginationItem>
                                                );
                                            }

                                            if (link.label === '...') {
                                                return (
                                                    <PaginationItem key={index}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

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
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </SiteLayout>
    );
}
