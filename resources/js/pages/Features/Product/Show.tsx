import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { PageProps as InertiaPageProps } from '@/types';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

// --- UI Components ---
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, Plus, Minus, Star, StarHalf, UploadCloud, X, CheckCircle2, Heart, Share2, ChevronDown, ChevronUp, NotebookPen } from 'lucide-react';

import SiteLayout from '@/layouts/SiteLayout';
import { ProductCard } from '@/components/ProductCard'; // Import ProductCard

// --- Tipe Data ---
interface ProductData extends BaseProduct {
    id_produk: number;
    deskripsi: string;
    attribute_values: AttributeValue[];
    allow_custom_design: boolean;
    design_templates: DesignTemplate[];
    enable_design_feature: boolean;
    harga: number;
    stok: number;
    reviews: ReviewData[];
}
interface ReviewData {
    id: number;
    rating: number;
    comment: string;
    photos: string[] | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
}
interface PageProps extends InertiaPageProps {
    product: ProductData;
    related_products: ProductData[]; // Tambahkan tipe untuk produk terkait
}

// --- Tipe untuk Item Galeri ---
type GalleryItem = {
    type: 'image' | 'template';
    thumb: string;
    full: string;
    id: number | string;
};

// --- Komponen Fungsional Terkecil ---

const StarRating = ({ rating = 4.5, totalReviews = 120 }: { rating?: number; totalReviews?: number }) => (
    <div className="flex items-center gap-2">
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                if (ratingValue <= rating) return <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />;
                if (ratingValue - 0.5 <= rating) return <StarHalf key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />;
                return <Star key={i} className="h-5 w-5 text-gray-300" />;
            })}
        </div>
        <span className="text-sm text-gray-500">({totalReviews} ulasan)</span>
    </div>
);

const ProductGallery = ({ product }: {
    product: ProductData;
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const galleryItems: GalleryItem[] = useMemo(() => {
        const items: GalleryItem[] = [];
        items.push({ type: 'image', thumb: product.gambar_url, full: product.gambar_url, id: 'main' });
        (product.design_templates || []).forEach(tmpl => items.push({ type: 'template', thumb: `/storage/${tmpl.thumbnail_path}`, full: `/storage/${tmpl.thumbnail_path}`, id: tmpl.id }));
        return items;
    }, [product]);

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    const handleThumbClick = (index: number) => {
        api?.scrollTo(index);
    };


    return (
        <div className="sticky top-24 flex flex-col gap-4">
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {galleryItems.map((item, index) => (
                        <CarouselItem key={index} className="aspect-square">
                            <div className="w-full h-full overflow-hidden rounded-2xl border bg-white flex items-center justify-center">
                                <img src={item.full} alt={`${product.nama_produk} - Gambar ${index + 1}`} className="h-full w-full object-cover" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
            <div className="grid grid-cols-5 gap-3">
                {galleryItems.map((item, index) => (
                    <button key={index} onClick={() => handleThumbClick(index)} className={cn("overflow-hidden rounded-lg aspect-square border-2 transition-all", current === index ? "border-orange-500" : "border-transparent hover:border-gray-300")}>
                        <img src={item.thumb} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Komponen Utama Halaman ---

export default function ProductShowPage({ product, related_products }: PageProps) {
    // --- State Manajemen ---
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
    const [note, setNote] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('all'); // State untuk filter ulasan
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // State untuk slide deskripsi

    // --- Logika Atribut & Harga ---
    const attributeGroups = useMemo(() => (product.attribute_values || []).reduce((acc, value) => {
        const { name } = value.attribute;
        if (!acc[name]) acc[name] = [];
        acc[name].push(value);
        return acc;
    }, {} as Record<string, AttributeValue[]>), [product.attribute_values]);

    const handleOptionChange = (attributeId: string, valueId: number) => {
        setSelectedOptions(prev => ({ ...prev, [attributeId]: valueId }));
    };

    const additionalPrice = useMemo(() => Object.values(selectedOptions).reduce((total, valueId) => {
        const selectedValue = product.attribute_values.find(v => v.id === valueId);
        return total + (selectedValue ? selectedValue.pivot.price : 0);
    }, 0), [selectedOptions, product.attribute_values]);

    const totalPrice = useMemo(() => (product.harga + additionalPrice) * quantity, [product.harga, additionalPrice, quantity]);

    // --- Logika Opsi Desain ---
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFile(file);
            setSelectedTemplate(null);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }, [previewUrl]);

    useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    const removeUploadedFile = () => {
        setUploadedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const handleSelectTemplate = (template: DesignTemplate) => {
        setSelectedTemplate(template);
        setUploadedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const { data, setData, post, errors, processing } = useForm({
        product_id: product.id_produk,
        quantity: 1,
        variant: {} as Record<string, number>,
        design: null as { type: 'template' | 'upload', value: number | File | null },
        note: "",
    });

    useEffect(() => {
        setData('quantity', quantity);
    }, [quantity]);

    useEffect(() => {
        setData('variant', selectedOptions);
    }, [selectedOptions]);

    useEffect(() => {
        if (selectedTemplate) {
            setData('design', { type: 'template', value: selectedTemplate.id });
        } else if (uploadedFile) {
            setData('design', { type: 'upload', value: uploadedFile });
        } else {
            setData('design', null);
        }
    }, [selectedTemplate, uploadedFile]);

    useEffect(() => {
        setData('note', note);
    }, [note]);


    // --- Logika Tombol Aksi & Tooltip ---
    const hasAttributes = Object.keys(attributeGroups).length > 0;
    const areAllOptionsSelected = hasAttributes ? Object.keys(selectedOptions).length === Object.keys(attributeGroups).length : true;
    const isDesignSelected = !product.enable_design_feature || !!selectedTemplate || !!uploadedFile;
    const isActionDisabled = !areAllOptionsSelected || !isDesignSelected || processing;

    const getTooltipMessage = () => {
        if (!areAllOptionsSelected) return "Harap pilih semua varian produk (misal: Ukuran, Bahan).";
        if (product.enable_design_feature && !isDesignSelected) return "Harap unggah desain Anda atau pilih salah satu template kami.";
        return "";
    };

    const handleAddToCart = () => {
        post(route('cart.store'), {
            onSuccess: () => {
                toast.success(`${product.nama_produk} berhasil ditambahkan ke keranjang.`);
            },
            onError: (errors) => {
                toast.error('Gagal menambahkan produk, periksa kembali pilihan Anda.');
                console.error("Cart Error:", errors);
            }
        });
    };
    const handleBuyNow = () => toast.info(`Proses checkout untuk ${product.nama_produk}...`);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <SiteLayout>
            <Head title={product.nama_produk} />
            <Toaster richColors position="top-center" />
            <div className="bg-gray-50 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                <main>
                    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        {/* Bagian Atas: Galeri & Panel Aksi */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16"
                        >
                            <motion.div variants={itemVariants}>
                                <ProductGallery product={product} />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <motion.div variants={itemVariants} className="h-fit space-y-8">
                                    {/* Header Produk */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold uppercase tracking-wider text-orange-500 text-sm">{product.category?.name ?? 'Uncategorized'}</p>
                                            </div>
                                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl leading-tight">{product.nama_produk}</h1>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                                Rp {totalPrice.toLocaleString('id-ID')}
                                            </div>

                                            {product.reviews && product.reviews.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-orange-500">
                                                        {(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)}
                                                    </span>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={cn("h-5 w-5", i < Math.round(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length) ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-500 text-sm font-medium">({product.reviews.length} ulasan)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Pilihan Atribut (Accordion) */}
                                    <div className="space-y-6">
                                        <Accordion type="multiple" defaultValue={Object.keys(attributeGroups)} className="w-full space-y-3">
                                            {(Object.entries(attributeGroups) as [string, AttributeValue[]][]).map(([name, values]) => {
                                                const attributeId = values[0].attribute.id;
                                                const selectedValueId = selectedOptions[attributeId];
                                                const selectedValue = values.find(v => v.id === selectedValueId)?.value;

                                                return (
                                                    <AccordionItem
                                                        key={name}
                                                        value={name}
                                                        className="rounded-xl border border-gray-100 bg-white px-4 shadow-sm transition-all hover:border-orange-200 hover:shadow-md dark:bg-gray-800 dark:border-gray-700 data-[state=open]:ring-1 data-[state=open]:ring-orange-100"
                                                    >
                                                        <AccordionTrigger className="hover:no-underline py-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-base font-bold text-gray-900 dark:text-gray-100">{name}</span>
                                                                {selectedValue && (
                                                                    <span className="rounded-md bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                                        {selectedValue}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="pb-4 pt-1">
                                                            <RadioGroup
                                                                onValueChange={(valueId) => handleOptionChange(attributeId.toString(), Number(valueId))}
                                                                className='flex flex-wrap gap-3'
                                                            >
                                                                {values.map((value) => {
                                                                    const isSelected = selectedOptions[attributeId] === value.id;
                                                                    return (
                                                                        <Label
                                                                            key={value.id}
                                                                            htmlFor={`attr_${value.id}`}
                                                                            className={cn(
                                                                                "group relative flex cursor-pointer items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200 select-none",
                                                                                isSelected
                                                                                    ? "border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500 shadow-sm"
                                                                                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-orange-300 hover:bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                                                            )}
                                                                        >
                                                                            <RadioGroupItem value={value.id.toString()} id={`attr_${value.id}`} className="sr-only" />
                                                                            <span>{value.value}</span>
                                                                            {value.pivot.price > 0 && (
                                                                                <span className={cn("ml-2 text-xs", isSelected ? "text-orange-600 font-semibold" : "text-gray-500 font-normal")}>
                                                                                    (+{value.pivot.price.toLocaleString('id-ID')})
                                                                                </span>
                                                                            )}
                                                                        </Label>
                                                                    );
                                                                })}
                                                            </RadioGroup>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                );
                                            })}
                                        </Accordion>
                                    </div>

                                    {/* Opsi Desain */}
                                    {product.enable_design_feature && (
                                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 dark:bg-gray-800/50 dark:border-gray-700">
                                            <Label className="mb-4 block text-base font-semibold text-gray-900 dark:text-gray-100">Personalisasi Desain</Label>
                                            <Tabs defaultValue={product.design_templates?.length > 0 ? "template" : "upload"} className="w-full">
                                                <TabsList className={cn("grid w-full gap-2 bg-transparent p-0", (product.design_templates?.length > 0 && product.allow_custom_design) ? "grid-cols-2" : "grid-cols-1")}>
                                                    {product.design_templates?.length > 0 && <TabsTrigger value="template" className="rounded-lg border bg-white data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:ring-1 data-[state=active]:ring-orange-500 shadow-sm">Pilih Template</TabsTrigger>}
                                                    {product.allow_custom_design && <TabsTrigger value="upload" className="rounded-lg border bg-white data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:ring-1 data-[state=active]:ring-orange-500 shadow-sm">Upload Sendiri</TabsTrigger>}
                                                </TabsList>

                                                <div className="mt-4">
                                                    {product.design_templates?.length > 0 && (
                                                        <TabsContent value="template" className="mt-0">
                                                            <div className='grid grid-cols-4 gap-3'>
                                                                {product.design_templates.map(template => (
                                                                    <div key={template.id} className="relative group/template">
                                                                        <button onClick={() => handleSelectTemplate(template)} className={cn('overflow-hidden rounded-lg aspect-square border-2 transition-all w-full relative', selectedTemplate?.id === template.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300 dark:border-gray-600')}>
                                                                            <img src={`/storage/${template.thumbnail_path}`} alt={template.name} className='aspect-square w-full object-cover transition-transform group-hover/template:scale-105' />
                                                                            {selectedTemplate?.id === template.id && (
                                                                                <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                                                                                    <div className="bg-orange-500 text-white rounded-full p-1 shadow-sm"><CheckCircle2 className="h-4 w-4" /></div>
                                                                                </div>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TabsContent>
                                                    )}
                                                    {product.allow_custom_design && (
                                                        <TabsContent value="upload" className="mt-0">
                                                            {uploadedFile ? (
                                                                <div className='relative w-full rounded-xl border border-dashed border-green-500 bg-green-50/50 p-6 text-center'>
                                                                    <img src={previewUrl!} alt="Preview" className='mx-auto h-32 object-contain rounded-lg shadow-sm' />
                                                                    <p className='mt-3 font-medium text-green-700 truncate'>{uploadedFile.name}</p>
                                                                    <p className='text-xs text-green-600'>Siap untuk dicetak</p>
                                                                    <Button variant="ghost" size="icon" className='absolute top-2 right-2 text-green-600 hover:bg-green-100 hover:text-green-700' onClick={removeUploadedFile}><X className='h-5 w-5' /></Button>
                                                                </div>
                                                            ) : (
                                                                <div {...getRootProps()} className={cn('group flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all hover:scale-[1.01] active:scale-[0.99]', isDragActive ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/30 dark:border-gray-600')}>
                                                                    <input {...getInputProps()} />
                                                                    <div className="rounded-full bg-gray-100 p-3 group-hover:bg-white group-hover:shadow-sm transition-colors">
                                                                        <UploadCloud className='h-6 w-6 text-gray-500 group-hover:text-orange-500' />
                                                                    </div>
                                                                    <div className="mt-3 text-center">
                                                                        <p className='font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600'>Klik atau letakkan file di sini</p>
                                                                        <p className="text-xs text-gray-500 mt-1">Mendukung JPG, PNG, PDF</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </TabsContent>
                                                    )}
                                                </div>
                                            </Tabs>
                                        </div>
                                    )}

                                    {/* Aksi & Kalkulasi */}
                                    <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                                                    <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-10 w-10 text-gray-500 hover:text-orange-600"><Minus className="h-4 w-4" /></Button>
                                                    <Input
                                                        type="number"
                                                        value={quantity}
                                                        max={product.stok}
                                                        onChange={(e) => setQuantity(Math.min(product.stok, Math.max(1, parseInt(e.target.value) || 1)))}
                                                        className="h-10 w-12 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    />
                                                    <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(product.stok, q + 1))} className="h-10 w-10 text-gray-500 hover:text-orange-600"><Plus className="h-4 w-4" /></Button>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Total Estimasi</p>
                                                <p className="text-2xl font-bold text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <NotebookPen className="h-4 w-4 text-orange-500" />
                                                <Label htmlFor="note" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    Catatan Pesanan
                                                    <span className="ml-1 text-xs font-normal text-gray-500">(Opsional)</span>
                                                </Label>
                                            </div>
                                            <div className="relative">
                                                <Textarea
                                                    id="note"
                                                    value={note}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    placeholder="Tulis detail khusus atau instruksi pengemasan untuk pesanan Anda..."
                                                    className="min-h-[100px] w-full resize-none rounded-xl border-gray-200 bg-gray-50/50 p-4 text-sm transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-200 dark:bg-gray-800 dark:border-gray-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="lg" onClick={handleAddToCart} disabled={isActionDisabled} className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] hover:shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none">
                                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                                            Tambah ke Keranjang
                                                        </Button>
                                                    </TooltipTrigger>
                                                    {isActionDisabled && <TooltipContent side="bottom" className="max-w-xs">{getTooltipMessage()}</TooltipContent>}
                                                </Tooltip>
                                            </TooltipProvider>
                                            <Button variant="outline" size="lg" onClick={handleBuyNow} disabled={isActionDisabled} className="w-full h-12 text-base font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                Beli Langsung
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Bagian Bawah: Informasi Tambahan (Full Width) */}
                        {/* Bagian Bawah: Informasi Tambahan (Full Width) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mt-24"
                        >
                            <Tabs defaultValue="description">
                                <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto">
                                    <TabsTrigger value="description">Deskripsi Lengkap</TabsTrigger>
                                    <TabsTrigger value="reviews">Ulasan</TabsTrigger>
                                </TabsList>
                                <TabsContent value="description" className="mt-6">
                                    <div className="relative">
                                        <motion.div
                                            initial={false}
                                            animate={{ height: isDescriptionExpanded ? "auto" : 200 }} // Tinggi awal 200px
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                                <p className="whitespace-pre-line leading-relaxed">{product.deskripsi}</p>
                                            </div>
                                        </motion.div>

                                        {/* Gradient Overlay saat collapse */}
                                        {!isDescriptionExpanded && (
                                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900" />
                                        )}
                                    </div>

                                    {/* Tombol Toggle */}
                                    <div className="mt-4 text-center">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium"
                                        >
                                            {isDescriptionExpanded ? (
                                                <span className="flex items-center gap-2">Sembunyikan <ChevronUp className="h-4 w-4" /></span>
                                            ) : (
                                                <span className="flex items-center gap-2">Baca Selengkapnya <ChevronDown className="h-4 w-4" /></span>
                                            )}
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="reviews" className="mt-8">
                                    <div className="space-y-8">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Penilaian Produk</h3>

                                        {/* Header Ringkasan & Filter */}
                                        <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-8 dark:border-gray-700 dark:bg-gray-800/50">
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                                                {/* Skor Rating */}
                                                <div className="text-center min-w-[120px]">
                                                    <div className="text-5xl font-medium text-orange-500">
                                                        {(product.reviews && product.reviews.length > 0 ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length) : 0).toFixed(1)} <span className="text-2xl text-orange-500">dari 5</span>
                                                    </div>
                                                    <div className="flex justify-center mt-2 gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={cn("h-6 w-6", i < Math.round(product.reviews && product.reviews.length > 0 ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length) : 0) ? "text-orange-500 fill-orange-500" : "text-gray-300")} />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Tombol Filter */}
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap gap-3">
                                                        <button
                                                            onClick={() => setActiveFilter('all')}
                                                            className={cn(
                                                                "px-4 py-2 rounded border text-sm font-medium transition-colors bg-white hover:border-orange-500 hover:text-orange-500 dark:bg-gray-800",
                                                                activeFilter === 'all'
                                                                    ? "border-orange-500 text-orange-500"
                                                                    : "border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-300"
                                                            )}
                                                        >
                                                            Semua
                                                        </button>

                                                        {[5, 4, 3, 2, 1].map((star) => {
                                                            const count = product.reviews ? product.reviews.filter(r => Math.round(r.rating) === star).length : 0;
                                                            return (
                                                                <button
                                                                    key={star}
                                                                    onClick={() => count > 0 && setActiveFilter(star.toString())}
                                                                    disabled={count === 0}
                                                                    className={cn(
                                                                        "px-4 py-2 rounded border text-sm font-medium transition-colors bg-white hover:border-orange-500 hover:text-orange-500 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400",
                                                                        activeFilter === star.toString()
                                                                            ? "border-orange-500 text-orange-500"
                                                                            : "border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-300"
                                                                    )}
                                                                >
                                                                    {star} Bintang ({count})
                                                                </button>
                                                            )
                                                        })}

                                                        {['media', 'comment'].map((type) => {
                                                            const count = product.reviews ? product.reviews.filter(r => type === 'media' ? (r.photos && r.photos.length > 0) : r.comment).length : 0;
                                                            const label = type === 'media' ? 'Dengan Media' : 'Dengan Komentar';
                                                            return (
                                                                <button
                                                                    key={type}
                                                                    onClick={() => count > 0 && setActiveFilter(type)}
                                                                    disabled={count === 0}
                                                                    className={cn(
                                                                        "px-4 py-2 rounded border text-sm font-medium transition-colors bg-white hover:border-orange-500 hover:text-orange-500 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400",
                                                                        activeFilter === type
                                                                            ? "border-orange-500 text-orange-500"
                                                                            : "border-gray-200 text-gray-600 dark:border-gray-600 dark:text-gray-300"
                                                                    )}
                                                                >
                                                                    {label} ({count})
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Daftar Ulasan */}
                                        <div className="space-y-8">
                                            {product.reviews && product.reviews.length > 0 ? (
                                                product.reviews
                                                    .filter(r => {
                                                        if (activeFilter === 'all') return true;
                                                        if (activeFilter === 'media') return r.photos && r.photos.length > 0;
                                                        if (activeFilter === 'comment') return r.comment && r.comment.length > 0;
                                                        return Math.round(r.rating) === parseInt(activeFilter);
                                                    })
                                                    .map((review) => (
                                                        <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 dark:border-gray-700">
                                                            <div className="flex gap-4">
                                                                <div className="flex-shrink-0">
                                                                    {review.user.avatar ? (
                                                                        <img src={review.user.avatar} alt={review.user.name} className="h-10 w-10 rounded-full object-cover" />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A7.5 7.5 0 014.501 20.118z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 space-y-2">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{review.user.name}</div>
                                                                    <div className="flex items-center gap-1">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "text-orange-500 fill-orange-500" : "text-gray-200")} />
                                                                        ))}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')} {new Date(review.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>

                                                                    {review.comment && (
                                                                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">{review.comment}</p>
                                                                    )}

                                                                    {review.photos && review.photos.length > 0 && (
                                                                        <div className="flex gap-2 pt-2">
                                                                            {review.photos.map((photo, idx) => (
                                                                                <div key={idx} className="h-20 w-20 overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90">
                                                                                    <img src={`/storage/${photo}`} alt="Review" className="h-full w-full object-cover" />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="py-12 text-center text-gray-500">Belum ada ulasan</div>
                                            )}

                                            {product.reviews && product.reviews.length > 0 && product.reviews.filter(r => {
                                                if (activeFilter === 'all') return true;
                                                if (activeFilter === 'media') return r.photos && r.photos.length > 0;
                                                if (activeFilter === 'comment') return r.comment && r.comment.length > 0;
                                                return Math.round(r.rating) === parseInt(activeFilter);
                                            }).length === 0 && (
                                                    <div className="py-12 text-center text-gray-500">
                                                        Tidak ada ulasan untuk filter ini.
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>

                        {/* Bagian Bawah: Rekomendasi Produk (Full Width) */}
                        {related_products && related_products.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                                className="mt-24"
                            >
                                <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900 dark:text-gray-100">
                                    Anda Mungkin Juga Suka
                                </h2>
                                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                    {related_products.map((related_product) => (
                                        <ProductCard key={related_product.slug} product={related_product} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </SiteLayout>
    );
}