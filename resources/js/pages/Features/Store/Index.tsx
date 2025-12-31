import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Store {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    image_url: string | null;
    address: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    hours_weekday: string | null;
    hours_saturday: string | null;
    hours_sunday: string | null;
    is_active: boolean;
}

interface Props {
    items: {
        data: Store[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ items }: Props) {
    const handleDelete = (id: number) => {
        router.delete(route('stores.destroy', id));
    };

    return (
        <AppLayout>
            <Head title="Kelola Lokasi Toko" />

            <div className="p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Lokasi Toko
                        </CardTitle>
                        <Link href={route('stores.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Toko
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {items.data.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Belum ada data toko.</p>
                                <Link href={route('stores.create')} className="text-orange-600 hover:underline mt-2 inline-block">
                                    Tambah toko pertama
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Gambar</TableHead>
                                        <TableHead>Nama Toko</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.data.map((store) => (
                                        <TableRow key={store.id}>
                                            <TableCell>
                                                {store.image_url ? (
                                                    <img
                                                        src={store.image_url}
                                                        alt={store.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <MapPin className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{store.name}</TableCell>
                                            <TableCell className="max-w-xs truncate">{store.address}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    {store.phone && (
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <Phone className="h-3 w-3" />
                                                            {store.phone}
                                                        </div>
                                                    )}
                                                    {store.email && (
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <Mail className="h-3 w-3" />
                                                            {store.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={store.is_active ? 'default' : 'secondary'}>
                                                    {store.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('stores.edit', store.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus Toko?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Toko "{store.name}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(store.id)}>
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Pagination */}
                        {items.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-gray-600">
                                    Menampilkan {items.data.length} dari {items.total} toko
                                </p>
                                <div className="flex gap-2">
                                    {Array.from({ length: items.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={route('stores.index', { page })}
                                            className={`px-3 py-1 rounded ${page === items.current_page
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
