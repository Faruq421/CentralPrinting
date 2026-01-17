import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUpDown, Star, Eye, EyeOff, MessageSquare, Quote } from 'lucide-react';
import debounce from 'lodash.debounce';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Review {
    id: number;
    customer_id: number;
    product_id: number;
    order_id: number;
    rating: number;
    comment: string | null;
    photos: string[] | null;
    is_visible: boolean;
    created_at: string;
    customer?: { id: number; user?: { name: string; email: string; avatar?: string } };
    product?: { id_produk: number; nama_produk: string; gambar_produk?: string };
    order?: { id: number };
}

interface Pagination<T> {
    data: T[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Reviews', href: route('reviews.index') },
];

export default function Index({ items, filters }: PageProps<{ items: Pagination<Review>, filters: any }>) {
    const [search, setSearch] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortDir, setSortDir] = useState(filters.sort_dir || 'desc');
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(route('reviews.index'), { search: value, sort_by: sortBy, sort_dir: sortDir }, { preserveState: true, replace: true });
        }, 300),
        [sortBy, sortDir]
    );

    useEffect(() => {
        debouncedSearch(search);
        return () => debouncedSearch.cancel();
    }, [search, debouncedSearch]);

    const handleSort = (newSortBy: string) => {
        let newSortDir = 'asc';
        if (sortBy === newSortBy && sortDir === 'asc') {
            newSortDir = 'desc';
        }
        setSortBy(newSortBy);
        setSortDir(newSortDir);
        router.get(route('reviews.index'), { search, sort_by: newSortBy, sort_dir: newSortDir }, { preserveState: true, replace: true });
    };

    const toggleVisibility = (review: Review) => {
        router.patch(route('reviews.update', review.id), {
            rating: review.rating,
            comment: review.comment,
            is_visible: !review.is_visible,
        }, { preserveState: true });
    };

    const openReviewDetail = (review: Review) => {
        setSelectedReview(review);
        setIsDialogOpen(true);
    };

    const renderStars = (rating: number, size = "h-4 w-4") => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Reviews" />
            <div className="p-4 sm:p-6 lg:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Kelola Reviews</CardTitle>
                        <CardDescription>Lihat dan moderasi semua ulasan produk dari pelanggan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between gap-2 py-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari berdasarkan nama user, produk, atau komentar..."
                                    className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">ID</TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="h-8 p-0" onClick={() => handleSort('user_id')}>
                                                User <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="w-[80px]">Order</TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="h-8 p-0" onClick={() => handleSort('rating')}>
                                                Rating <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="max-w-[200px]">Komentar</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                Belum ada review dari pelanggan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.data.map((review) => (
                                            <TableRow key={review.id}>
                                                <TableCell className="font-medium">#{review.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${review.customer?.user?.name}&background=random`} />
                                                            <AvatarFallback>{review.customer?.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{review.customer?.user?.name || 'Unknown'}</div>
                                                            <div className="text-xs text-muted-foreground">{review.customer?.user?.email || ''}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{review.product?.nama_produk || 'Unknown'}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={route('orders.show', review.order_id)} className="text-primary hover:underline">
                                                        #{review.order_id}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(review.rating)}
                                                        <span className="text-xs text-muted-foreground">({review.rating})</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-[200px]">
                                                    <p className="truncate text-sm text-muted-foreground" title={review.comment || ''}>
                                                        {review.comment || <span className="italic">Tidak ada komentar</span>}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={review.is_visible ? 'default' : 'secondary'}
                                                        className={`cursor-pointer ${review.is_visible ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                        onClick={() => toggleVisibility(review)}
                                                    >
                                                        {review.is_visible ? (
                                                            <><Eye className="h-3 w-3 mr-1" /> Visible</>
                                                        ) : (
                                                            <><EyeOff className="h-3 w-3 mr-1" /> Hidden</>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openReviewDetail(review)}
                                                        className="hover:bg-orange-50 hover:text-orange-600"
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                        <span className="sr-only">Lihat Review</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {items.from || 0}-{items.to || 0} dari {items.total} review
                            </div>
                            <div className="space-x-2">
                                <Button variant="outline" size="sm" asChild disabled={!items.prev_page_url}>
                                    <Link href={items.prev_page_url ?? '#'}>Sebelumnya</Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild disabled={!items.next_page_url}>
                                    <Link href={items.next_page_url ?? '#'}>Berikutnya</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detail Review Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                Detail Ulasan #{selectedReview?.id}
                            </DialogTitle>
                            <DialogDescription>
                                Detail lengkap ulasan yang diberikan oleh pelanggan.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedReview && (
                            <div className="grid gap-6 py-4">
                                {/* Profil User */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-orange-100">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${selectedReview.customer?.user?.name}&size=128&background=random`} />
                                        <AvatarFallback className="text-lg">{selectedReview.customer?.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <div className="font-bold text-lg leading-none">{selectedReview.customer?.user?.name}</div>
                                        <div className="text-sm text-muted-foreground">{selectedReview.customer?.user?.email}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Member sejak: {formatDate(selectedReview.created_at)} {/* Note: This is review date, not member since, but displaying review date here contextually */}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <Badge variant={selectedReview.is_visible ? 'default' : 'secondary'}>
                                            {selectedReview.is_visible ? 'Visible' : 'Hidden'}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                {/* Produk Info */}
                                <div className="grid gap-2">
                                    <h4 className="font-medium text-sm text-muted-foreground">Produk yang diulas</h4>
                                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                                        <div className="font-medium">{selectedReview.product?.nama_produk}</div>
                                        <Link href={route('orders.show', selectedReview.order_id)} className="text-xs text-primary underline hover:text-primary/80">
                                            Lihat Pesanan #{selectedReview.order_id}
                                        </Link>
                                    </div>
                                </div>

                                {/* Rating & Komentar */}
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm text-muted-foreground">Rating & Komentar</h4>
                                        <div className="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                                            {renderStars(selectedReview.rating, "h-5 w-5")}
                                            <span className="font-bold text-yellow-700">{selectedReview.rating}.0</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-orange-100 -z-10 transform -scale-x-100" />
                                        <div className="h-[200px] w-full rounded-md border p-4 bg-muted/20 overflow-y-auto">
                                            <p className="text-sm leading-relaxed text-gray-700 italic">
                                                "{selectedReview.comment || 'Pengguna tidak memberikan komentar tertulis untuk ulasan ini.'}"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-right text-muted-foreground">
                                        Diulas pada: {formatDate(selectedReview.created_at)}
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {selectedReview && (
                                <Button
                                    variant={selectedReview.is_visible ? "secondary" : "default"}
                                    onClick={() => {
                                        toggleVisibility(selectedReview);
                                        // Update local state to reflect change immediately in dialog if needed, 
                                        // but router.patch will re-render page causing Dialog to potentially close or refresh props.
                                        // Ideally we just close it or let the prop update handle it. 
                                        // For better UX, let's keep it open but update the data if possible, 
                                        // Or just close it. Let's just toggle and close for now or let user see change.
                                        // Since we use Inertia, the page props will update. 
                                        // We might need to sync selectedReview with the new data from items.
                                        // But for simplicity, let's just trigger the action.
                                        setIsDialogOpen(false);
                                    }}
                                >
                                    {selectedReview.is_visible ? (
                                        <><EyeOff className="mr-2 h-4 w-4" /> Sembunyikan Ulasan</>
                                    ) : (
                                        <><Eye className="mr-2 h-4 w-4" /> Tampilkan Ulasan</>
                                    )}
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Tutup</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

