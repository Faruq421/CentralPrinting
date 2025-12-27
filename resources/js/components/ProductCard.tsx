import { Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { cn, formatRupiah } from '@/lib/utils';
import { route } from 'ziggy-js';

interface Product {
    id_produk: number;
    slug: string;
    gambar_url?: string;
    gambar?: string; // Handle both cases
    nama_produk: string;
    category: {
        name: string;
    };
    harga: number;
}

interface ProductCardProps {
    product: Product;
    className?: string;
    onQuickView?: (slug: string) => void;
}

export function ProductCard({ product, className, onQuickView }: ProductCardProps) {
    // Determine image source: strict URL or storage path
    const imageSrc = product.gambar_url || (product.gambar ? `/storage/${product.gambar}` : '/placeholder.png');

    return (
        <Card className={cn("overflow-hidden group transition-all duration-300 hover:shadow-xl h-full flex flex-col", className)}>
            <CardContent className="p-0 flex-1">
                <Link href={route('products.show', product.slug)} className="block h-full">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <ImageWithFallback
                            src={imageSrc}
                            alt={product.nama_produk}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">{product.category.name}</p>
                        <h3 className="font-semibold truncate text-foreground group-hover:text-orange-600 transition-colors">
                            {product.nama_produk}
                        </h3>
                        <p className="text-lg font-bold text-primary mt-2">
                            {formatRupiah(product.harga)}
                        </p>
                    </div>
                </Link>
            </CardContent>

            <CardFooter
                className="p-4 pt-0 overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 ease-in-out"
            >
                <Button
                    className="w-full"
                    variant="default"
                    onClick={(e) => {
                        e.preventDefault(); // Prevent Link click if nested (though it's not nested here)
                        if (onQuickView) onQuickView(product.slug);
                        else window.location.href = route('products.show', product.slug);
                    }}
                >
                    Pesan Sekarang
                </Button>
            </CardFooter>
        </Card>
    );
}
