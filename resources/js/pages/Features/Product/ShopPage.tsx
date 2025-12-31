import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
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
import { Filter, ShoppingCart, Heart, Eye, ArrowRight, X, Star } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// --- MOCK DATA ---
const MOCK_CATEGORIES = [
    "Print A3+", "Banner & Spanduk", "Merchandise", "Stempel", "Kartu Nama", "Brosur & Flyer", "Stiker & Label"
];

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Cetak A3+ Premium Art Paper",
        slug: "cetak-a3-premium",
        price: 5000,
        category: "Print A3+",
        image: "https://images.unsplash.com/photo-1626785774583-b61d526e156d?q=80&w=800&auto=format&fit=crop",
        is_new: false,
        rating: 4.8,
        sold: 1200,
        description: "Cetak A3+ dengan kualitas terbaik menggunakan mesin terbaru."
    },
    {
        id: 2,
        name: "X-Banner Standar 60x160cm",
        slug: "x-banner-standar",
        price: 85000,
        category: "Banner & Spanduk",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
        is_new: true,
        rating: 4.9,
        sold: 450,
        description: "Banner praktis untuk promosi indoor Anda."
    },
    {
        id: 3,
        name: "Kartu Nama 1 Sisi (Box)",
        slug: "kartu-nama-1-sisi",
        price: 35000,
        category: "Kartu Nama",
        image: "https://images.unsplash.com/photo-1596073419667-9d77d59f033f?q=80&w=800&auto=format&fit=crop",
        is_new: false,
        rating: 4.7,
        sold: 2300,
        description: "Kartu nama profesional, bahan Art Carton 260gr."
    },
    {
        id: 4,
        name: "Custom Mug Keramik",
        slug: "custom-mug",
        price: 25000,
        category: "Merchandise",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop",
        is_new: false,
        rating: 4.6,
        sold: 890,
        description: "Mug keramik berkualitas untuk kado atau souvenir."
    },
    {
        id: 5,
        name: "Stiker Vinyl A3+ (Kiss Cut)",
        slug: "stiker-vinyl",
        price: 15000,
        category: "Stiker & Label",
        image: "https://images.unsplash.com/photo-1572375992501-a6b525040d89?q=80&w=800&auto=format&fit=crop",
        is_new: true,
        rating: 4.9,
        sold: 3400,
        description: "Stiker vinyl tahan air, sudah termasuk cutting."
    },
    {
        id: 6,
        name: "Brosur A5 Art Paper 150gsm",
        slug: "brosur-a5",
        price: 500,
        category: "Brosur & Flyer",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
        is_new: false,
        rating: 4.5,
        sold: 5000,
        description: "Media promosi efektif dan ekonomis."
    },
    {
        id: 7,
        name: "Roll Up Banner 60x160cm",
        slug: "roll-up-banner",
        price: 250000,
        category: "Banner & Spanduk",
        image: "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?q=80&w=800&auto=format&fit=crop",
        is_new: false,
        rating: 5.0,
        sold: 120,
        description: "Banner premium dengan rangka aluminium yang kokoh."
    },
    {
        id: 8,
        name: "Stempel Flash Warna",
        slug: "stempel-flash",
        price: 65000,
        category: "Stempel",
        image: "https://images.unsplash.com/photo-1633534571026-62187d9f75fe?q=80&w=800&auto=format&fit=crop",
        is_new: true,
        rating: 4.8,
        sold: 210,
        description: "Stempel otomatis tanpa bantalan, praktis digunakan."
    },
];

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
    // State
    const [isLoading, setIsLoading] = useState(true);
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('newest');

    // Mimic loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter(product => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            return matchesCategory && matchesPrice;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0; // newest/default
        });
    }, [selectedCategories, priceRange, sortBy]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

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

    return (
        <SiteLayout>
            <Head title="Belanja Sekarang" />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 min-h-screen">
                {/* Simplified Header - No big title, straight to controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 py-4 border-b">
                    <div>
                        {/* Breadcrumb-like or simple indicator */}
                        <p className="text-sm text-gray-500 mb-1">Produk & Jasa</p>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{filteredProducts.length} Produk Ditampilkan</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
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
                                {/* Reusing Sidebar Logic for Mobile */}
                                <div className="mt-6 space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="font-medium text-sm text-gray-900">Kategori</h3>
                                        <div className="grid gap-2">
                                            {MOCK_CATEGORIES.map(category => (
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
                                            defaultValue={[0, 1000000]}
                                            max={2000000}
                                            step={10000}
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{formatRupiah(priceRange[0])}</span>
                                            <span>{formatRupiah(priceRange[1])}</span>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="price-asc">Harga Terendah</SelectItem>
                                <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
                                <SelectItem value="rating">Rating Tertinggi</SelectItem>
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
                                        {MOCK_CATEGORIES.map((category) => (
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
                                        defaultValue={[0, 1000000]}
                                        max={2000000}
                                        step={10000}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className="py-4"
                                    />
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="bg-gray-50 rounded px-2 py-1 text-xs text-gray-600 w-24 text-center">
                                            {formatRupiah(priceRange[0])}
                                        </div>
                                        <span className="text-gray-400">-</span>
                                        <div className="bg-gray-50 rounded px-2 py-1 text-xs text-gray-600 w-24 text-center">
                                            {formatRupiah(priceRange[1])}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full text-xs h-8"
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setPriceRange([0, 1000000]);
                                    }}
                                    disabled={selectedCategories.length === 0 && priceRange[0] === 0 && priceRange[1] === 1000000}
                                >
                                    Reset Filter
                                </Button>
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
                                    {filteredProducts.map((product) => (
                                        <motion.div key={product.id} variants={itemVariants} layout>
                                            <Card className="group h-full flex flex-col overflow-hidden border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                                                {/* Image Section */}
                                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />

                                                    {/* Floating Badge */}
                                                    {product.is_new && (
                                                        <Badge className="absolute top-3 left-3 bg-orange-600 hover:bg-orange-700">
                                                            Baru
                                                        </Badge>
                                                    )}

                                                    {/* Quick Actions (Slide Up) */}
                                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center gap-2">
                                                        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white text-gray-900 hover:bg-orange-50 hover:text-orange-600">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">Quick View</span>
                                                        </Button>
                                                        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white text-gray-900 hover:bg-orange-50 hover:text-orange-600">
                                                            <ShoppingCart className="h-4 w-4" />
                                                            <span className="sr-only">Add to Cart</span>
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <CardHeader className="p-4 pb-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-medium text-orange-600 truncate max-w-[70%]">
                                                            {product.category}
                                                        </span>
                                                        {/* Rating */}
                                                        <div className="flex items-center text-xs text-yellow-500">
                                                            <Star className="h-3 w-3 fill-current mr-1" />
                                                            {product.rating}
                                                        </div>
                                                    </div>
                                                    <Link href={`/products/${product.slug}`} className="hover:underline decoration-orange-500 underline-offset-4">
                                                        <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                                                            {product.name}
                                                        </CardTitle>
                                                    </Link>
                                                </CardHeader>

                                                <CardContent className="p-4 pt-2 flex-grow">
                                                    <CardDescription className="line-clamp-2 text-xs mb-3">
                                                        {product.description}
                                                    </CardDescription>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {formatRupiah(product.price)}
                                                    </div>
                                                </CardContent>

                                                <CardFooter className="p-4 pt-0">
                                                    <Button className="w-full bg-gray-900 hover:bg-orange-600 text-white transition-colors group-hover:shadow-md">
                                                        Lihat Detail
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Empty State */}
                                {filteredProducts.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                                    >
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <Filter className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Tidak ada produk ditemukan</h3>
                                        <p className="text-gray-500 text-sm mt-1 mb-4">
                                            Coba sesuaikan filter kategori atau harga Anda.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedCategories([]);
                                                setPriceRange([0, 1000000]);
                                            }}
                                        >
                                            Reset Filter
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </SiteLayout>
    );
}
