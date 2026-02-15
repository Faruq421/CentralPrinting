import React, { useState, useRef } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
    ImageIcon, Plus, Pencil, Trash2, GripVertical, Eye, EyeOff,
    ExternalLink, ArrowRight, Loader2, Upload, X, Sparkles
} from 'lucide-react';

// === TYPES ===
interface HeroSlide {
    id: number;
    position: 'main_slider' | 'promo_card';
    card_slot: number | null;
    title: string;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    image_url: string | null;
    gradient_from: string;
    gradient_to: string;
    button_enabled: boolean;
    button_text: string | null;
    button_link_type: 'product' | 'category' | 'custom_url' | null;
    button_link_value: string | null;
    is_active: boolean;
    sort_order: number;
}

interface Product {
    id_produk: number;
    nama_produk: string;
    slug: string;
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    mainSlides: HeroSlide[];
    promoCards: HeroSlide[];
    products: Product[];
    categories: Category[];
}

// === COLOR MAP (Tailwind name → HEX) ===
const COLOR_MAP: Record<string, string> = {
    'orange-50': '#fff7ed', 'orange-600': '#ea580c',
    'amber-50': '#fffbeb', 'amber-600': '#d97706',
    'blue-50': '#eff6ff', 'blue-600': '#2563eb',
    'indigo-600': '#4f46e5',
    'emerald-50': '#ecfdf5', 'emerald-600': '#059669',
    'teal-600': '#0d9488',
    'purple-50': '#faf5ff', 'purple-600': '#7c3aed',
    'violet-600': '#7c3aed',
    'red-600': '#dc2626',
    'rose-50': '#fff1f2', 'rose-600': '#e11d48',
    'gray-700': '#374151', 'gray-900': '#111827',
};
function getHex(name: string): string { return COLOR_MAP[name] || '#ea580c'; }

// === GRADIENT OPTIONS ===
const GRADIENT_PRESETS = [
    { label: 'Oranye', from: 'orange-600', to: 'amber-600' },
    { label: 'Biru', from: 'blue-600', to: 'indigo-600' },
    { label: 'Hijau', from: 'emerald-600', to: 'teal-600' },
    { label: 'Ungu', from: 'purple-600', to: 'violet-600' },
    { label: 'Merah', from: 'red-600', to: 'rose-600' },
    { label: 'Abu-abu', from: 'gray-700', to: 'gray-900' },
];

const CARD_COLOR_PRESETS = [
    { label: 'Oranye Muda', from: 'orange-50', to: 'orange-50' },
    { label: 'Biru Muda', from: 'blue-50', to: 'blue-50' },
    { label: 'Hijau Muda', from: 'emerald-50', to: 'emerald-50' },
    { label: 'Ungu Muda', from: 'purple-50', to: 'purple-50' },
    { label: 'Merah Muda', from: 'rose-50', to: 'rose-50' },
    { label: 'Kuning Muda', from: 'amber-50', to: 'amber-50' },
];

// === SLIDE FORM COMPONENT ===
function SlideFormDialog({
    open,
    onClose,
    slide,
    products,
    categories,
    isPromoCard = false,
}: {
    open: boolean;
    onClose: () => void;
    slide: HeroSlide | null;
    products: Product[];
    categories: Category[];
    isPromoCard?: boolean;
}) {
    const isEditing = !!slide;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(slide?.image_url || null);
    const [removeImage, setRemoveImage] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: slide?.title || '',
        subtitle: slide?.subtitle || '',
        description: slide?.description || '',
        image: null as File | null,
        gradient_from: slide?.gradient_from || (isPromoCard ? 'orange-50' : 'orange-600'),
        gradient_to: slide?.gradient_to || (isPromoCard ? 'orange-50' : 'amber-600'),
        button_enabled: slide?.button_enabled ?? false,
        button_text: slide?.button_text || '',
        button_link_type: slide?.button_link_type || 'category',
        button_link_value: slide?.button_link_value || '',
        is_active: slide?.is_active ?? true,
        remove_image: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('subtitle', data.subtitle || '');
        formData.append('description', data.description || '');
        formData.append('gradient_from', data.gradient_from);
        formData.append('gradient_to', data.gradient_to);
        formData.append('button_enabled', data.button_enabled ? '1' : '0');
        formData.append('button_text', data.button_text || '');
        formData.append('button_link_type', data.button_link_type || '');
        formData.append('button_link_value', data.button_link_value || '');
        formData.append('is_active', data.is_active ? '1' : '0');
        if (data.image) {
            formData.append('image', data.image);
        }
        if (removeImage) {
            formData.append('remove_image', '1');
        }

        if (isEditing && slide) {
            router.post(route('hero-slides.update', slide.id), formData, {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            router.post(route('hero-slides.store'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setRemoveImage(false);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData('image', null);
        setImagePreview(null);
        setRemoveImage(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const colorPresets = isPromoCard ? CARD_COLOR_PRESETS : GRADIENT_PRESETS;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit' : 'Tambah'} {isPromoCard ? 'Kartu Promo' : 'Slide'}
                    </DialogTitle>
                    <DialogDescription>
                        {isPromoCard
                            ? 'Atur konten kartu promo yang tampil di sisi kanan hero section.'
                            : 'Atur konten slide carousel yang tampil di hero section.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Gambar */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Gambar</Label>
                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-xl border"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer transition-colors"
                            >
                                <Upload className="h-8 w-8" />
                                <p className="text-sm">Klik untuk unggah gambar</p>
                                <p className="text-xs">Maks 2MB • JPG, PNG, WebP</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {!imagePreview && (
                            <p className="text-xs text-gray-500">
                                Jika tidak ada gambar, warna gradient akan digunakan sebagai latar belakang.
                            </p>
                        )}
                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                    </div>

                    {/* Warna Gradient (jika tanpa gambar) */}
                    {!imagePreview && (
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold">Warna Latar Belakang</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {colorPresets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => {
                                            setData(prev => ({ ...prev, gradient_from: preset.from, gradient_to: preset.to }));
                                        }}
                                        className={`h-12 rounded-lg border-2 transition-all ${data.gradient_from === preset.from && data.gradient_to === preset.to
                                            ? 'border-gray-900 ring-2 ring-gray-900/20 scale-105'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                        style={{ background: `linear-gradient(to right, ${getHex(preset.from)}, ${getHex(preset.to)})` }}
                                        title={preset.label}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Konten Teks */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Cetak Spanduk Kilat"
                                maxLength={100}
                                required
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Label Badge</Label>
                            <Input
                                id="subtitle"
                                value={data.subtitle || ''}
                                onChange={(e) => setData('subtitle', e.target.value)}
                                placeholder="Promo Terbatas"
                                maxLength={100}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Kualitas tajam, tahan cuaca, bisa ditunggu..."
                            maxLength={500}
                            rows={2}
                        />
                    </div>

                    <Separator />

                    {/* Tombol CTA */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-semibold">Tombol Aksi (CTA)</Label>
                                <p className="text-xs text-gray-500 mt-0.5">Tampilkan tombol di slide ini</p>
                            </div>
                            <Switch
                                checked={data.button_enabled}
                                onCheckedChange={(v) => setData('button_enabled', v)}
                            />
                        </div>

                        {data.button_enabled && (
                            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border">
                                <div className="space-y-2">
                                    <Label htmlFor="button_text">Teks Tombol</Label>
                                    <Input
                                        id="button_text"
                                        value={data.button_text || ''}
                                        onChange={(e) => setData('button_text', e.target.value)}
                                        placeholder="Lihat Penawaran"
                                        maxLength={50}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Target Link</Label>
                                    <Select
                                        value={data.button_link_type || 'category'}
                                        onValueChange={(v) => {
                                            setData(prev => ({
                                                ...prev,
                                                button_link_type: v as 'product' | 'category' | 'custom_url',
                                                button_link_value: '',
                                            }));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="category">Kategori Produk</SelectItem>
                                            <SelectItem value="product">Produk Tertentu</SelectItem>
                                            <SelectItem value="custom_url">URL Kustom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.button_link_type === 'category' && (
                                    <div className="space-y-2">
                                        <Label>Pilih Kategori</Label>
                                        <Select
                                            value={data.button_link_value || ''}
                                            onValueChange={(v) => setData('button_link_value', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.name}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {data.button_link_type === 'product' && (
                                    <div className="space-y-2">
                                        <Label>Pilih Produk</Label>
                                        <Select
                                            value={data.button_link_value || ''}
                                            onValueChange={(v) => setData('button_link_value', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih produk..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id_produk} value={product.slug}>
                                                        {product.nama_produk}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {data.button_link_type === 'custom_url' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="custom_url">URL</Label>
                                        <Input
                                            id="custom_url"
                                            value={data.button_link_value || ''}
                                            onChange={(e) => setData('button_link_value', e.target.value)}
                                            placeholder="https://example.com atau /register"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Status Aktif */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-semibold">Status</Label>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {data.is_active ? 'Slide ini aktif dan tampil di beranda' : 'Slide ini nonaktif dan disembunyikan'}
                            </p>
                        </div>
                        <Switch
                            checked={data.is_active}
                            onCheckedChange={(v) => setData('is_active', v)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Slide'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// === SLIDE PREVIEW CARD ===
function SlidePreviewCard({
    slide,
    onEdit,
    onDelete,
    isPromoCard = false,
}: {
    slide: HeroSlide;
    onEdit: () => void;
    onDelete?: () => void;
    isPromoCard?: boolean;
}) {
    const gradientStyle = { background: `linear-gradient(to right, ${getHex(slide.gradient_from)}, ${getHex(slide.gradient_to)})` };

    return (
        <div className={`relative rounded-xl overflow-hidden border shadow-sm group transition-all hover:shadow-md ${!slide.is_active ? 'opacity-60' : ''}`}>
            {/* Preview */}
            <div className="h-40 relative" style={!slide.image_url ? gradientStyle : undefined}>
                {slide.image_url ? (
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full" style={gradientStyle} />
                )}

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                    <div className="text-white">
                        {slide.subtitle && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider mb-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                {slide.subtitle}
                            </span>
                        )}
                        <h4 className="text-lg font-bold leading-tight">{slide.title}</h4>
                        {slide.description && (
                            <p className="text-xs text-white/80 mt-0.5 line-clamp-1">{slide.description}</p>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant={slide.is_active ? 'default' : 'secondary'} className="text-[10px]">
                        {slide.is_active ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {slide.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="h-7 w-7 p-0" onClick={onEdit}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    {onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" className="h-7 w-7 p-0">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Slide?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Slide "{slide.title}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={onDelete}>Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-3 bg-white">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        {slide.button_enabled ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <ExternalLink className="h-3 w-3" />
                                Tombol aktif
                            </span>
                        ) : (
                            <span className="text-gray-400">Tanpa tombol</span>
                        )}
                    </div>
                    <span className="text-gray-400">
                        {slide.image_url ? '🖼 Gambar' : '🎨 Gradient'}
                    </span>
                </div>
            </div>
        </div>
    );
}

// === MAIN PAGE ===
export default function Index({ mainSlides, promoCards, products, categories }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [isPromoCardForm, setIsPromoCardForm] = useState(false);

    const handleAddSlide = () => {
        setEditingSlide(null);
        setIsPromoCardForm(false);
        setFormOpen(true);
    };

    const handleEditSlide = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setIsPromoCardForm(slide.position === 'promo_card');
        setFormOpen(true);
    };

    const handleDeleteSlide = (id: number) => {
        router.delete(route('hero-slides.destroy', id));
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingSlide(null);
    };

    return (
        <AppLayout>
            <Head title="Kelola Hero Section" />

            <div className="p-6 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ImageIcon className="h-6 w-6 text-orange-600" />
                        Kelola Hero Section
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Atur tampilan hero section yang ditampilkan di halaman beranda.
                    </p>
                </div>

                {/* === BAGIAN 1: CAROUSEL UTAMA === */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                Slide Carousel Utama
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Slide yang ditampilkan di carousel besar sisi kiri hero section. Anda bisa menambah, mengedit, atau menghapus slide.
                            </CardDescription>
                        </div>
                        <Button onClick={handleAddSlide}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Slide
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {mainSlides.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Belum ada slide carousel.</p>
                                <button onClick={handleAddSlide} className="text-orange-600 hover:underline mt-2 inline-block">
                                    Tambah slide pertama
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mainSlides.map((slide, index) => (
                                    <SlidePreviewCard
                                        key={slide.id}
                                        slide={slide}
                                        onEdit={() => handleEditSlide(slide)}
                                        onDelete={() => handleDeleteSlide(slide.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* === BAGIAN 2: KARTU PROMO === */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Kartu Promo
                        </CardTitle>
                        <CardDescription>
                            2 kartu promo yang tampil di sisi kanan hero section. Anda bisa mengubah kontennya, tapi tidak bisa menambah atau menghapus kartu.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {promoCards.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Kartu promo belum dikonfigurasi.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {promoCards.map((card) => (
                                    <SlidePreviewCard
                                        key={card.id}
                                        slide={card}
                                        onEdit={() => handleEditSlide(card)}
                                        isPromoCard
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Form Dialog */}
            <SlideFormDialog
                key={editingSlide?.id || 'new'}
                open={formOpen}
                onClose={handleCloseForm}
                slide={editingSlide}
                products={products}
                categories={categories}
                isPromoCard={isPromoCardForm}
            />
        </AppLayout>
    );
}
