
import { useState, useMemo, useCallback, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { motion, Variants } from 'framer-motion';

// --- UI Components ---
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { ShoppingCart, Plus, Minus, UploadCloud, X, CheckCircle2, Loader2, RefreshCw, Star, ArrowRight, NotebookPen } from 'lucide-react';

// --- Tipe Data ---
interface ProductData {
    id_produk: number;
    nama_produk: string;
    slug: string;
    deskripsi: string;
    harga: number;
    gambar_url: string;
    attribute_values: AttributeValue[];
    allow_custom_design: boolean;
    design_templates: DesignTemplate[];
    enable_design_feature: boolean;
    category?: { name: string };
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

interface AttributeValue {
    id: number;
    attribute_id: number;
    value: string;
    attribute: { id: number; name: string };
    pivot: { price: number };
}

interface DesignTemplate {
    id: number;
    name: string;
    thumbnail_path: string;
}

type GalleryItem = {
    type: 'image' | 'template';
    thumb: string;
    full: string;
    id: number | string;
};

// --- Props Komponen ---
interface ProductQuickViewProps {
    productSlug?: string | null;
    cartItemId?: string | null;
    isOpen: boolean;
    onClose: () => void;
}

// --- Komponen Galeri Internal ---
const ProductGallery = ({ product }: {
    product: ProductData;
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const galleryItems: GalleryItem[] = useMemo(() => {
        const items: GalleryItem[] = [];
        if (product.gambar_url) items.push({ type: 'image', thumb: product.gambar_url, full: product.gambar_url, id: 'main' });
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

    if (galleryItems.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl bg-gray-100 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {galleryItems.map((item, index) => (
                            <CarouselItem key={index} className="aspect-square">
                                <div className="flex h-full w-full items-center justify-center p-2">
                                    <img src={item.full} alt={`${product.nama_produk} ${index + 1}`} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {galleryItems.length > 1 && (
                        <>
                            <CarouselPrevious className="left-4 h-8 w-8 bg-white/80 hover:bg-white text-gray-800 shadow-sm backdrop-blur-sm" />
                            <CarouselNext className="right-4 h-8 w-8 bg-white/80 hover:bg-white text-gray-800 shadow-sm backdrop-blur-sm" />
                        </>
                    )}
                </Carousel>
            </div>
            {galleryItems.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {galleryItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbClick(index)}
                            className={cn(
                                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all bg-white dark:bg-gray-800",
                                current === index ? "border-orange-500 ring-2 ring-orange-200 ring-offset-1" : "border-gray-100 hover:border-gray-300 dark:border-gray-700"
                            )}
                        >
                            <img src={item.thumb} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Komponen Utama ---
export function ProductQuickView({ productSlug, cartItemId, isOpen, onClose }: ProductQuickViewProps) {
    const [product, setProduct] = useState<ProductData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!cartItemId;

    // --- State Manajemen ---
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
    const [note, setNote] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [existingDesign, setExistingDesign] = useState<{ value: string; original_filename: string } | null>(null);

    // Track processing state for button disable
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetState = useCallback(() => {
        setQuantity(1);
        setSelectedOptions({});
        setNote("");
        setSelectedTemplate(null);
        setUploadedFile(null);
        setExistingDesign(null);
        setPreviewUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    }, []); // No dependencies - stable function reference

    useEffect(() => {
        if (!isOpen) {
            setProduct(null);
            return;
        }

        setIsLoading(true);
        const url = isEditMode ? `/api/cart/${cartItemId}` : `/api/products/${productSlug}`;

        if (!productSlug && !isEditMode) return;

        axios.get(url)
            .then(response => {
                if (isEditMode) {
                    const { product: productData, selectedOptions: itemOptions } = response.data;
                    setProduct(productData);

                    // Pre-populate state from cart item data
                    setQuantity(itemOptions.quantity || 1);
                    setSelectedOptions(itemOptions.variant || {});
                    setNote(itemOptions.note || "");

                    if (itemOptions.design?.type === 'template' && productData.design_templates) {
                        const foundTemplate = productData.design_templates.find(
                            (t: DesignTemplate) => t.id == itemOptions.design.value
                        );
                        if (foundTemplate) setSelectedTemplate(foundTemplate);
                    } else if (itemOptions.design?.type === 'upload') {
                        setExistingDesign(itemOptions.design);
                    }

                } else {
                    setProduct(response.data);
                    resetState();
                }
            })
            .catch(error => {
                console.error("Gagal memuat data:", error);
                toast.error("Gagal memuat data untuk ditampilkan.");
                onClose();
            })
            .finally(() => setIsLoading(false));
    }, [isOpen, productSlug, cartItemId, isEditMode, onClose]); // Removed resetState to prevent re-fetch on file upload


    // --- Logika Atribut & Harga ---
    const attributeGroups = useMemo(() => {
        if (!product) return {};
        return (product.attribute_values || []).reduce((acc, value) => {
            const { name } = value.attribute;
            if (!acc[name]) acc[name] = [];
            acc[name].push(value);
            return acc;
        }, {} as Record<string, AttributeValue[]>);
    }, [product]);

    const handleOptionChange = (attributeId: string, valueId: number) => {
        setSelectedOptions(prev => ({ ...prev, [attributeId]: valueId }));
    };

    const additionalPrice = useMemo(() => {
        if (!product) return 0;
        return Object.values(selectedOptions).reduce((total, valueId) => {
            const selectedValue = product.attribute_values.find(v => v.id === valueId);
            return total + (selectedValue ? selectedValue.pivot.price : 0);
        }, 0);
    }, [selectedOptions, product]);

    const totalPrice = useMemo(() => {
        if (!product) return 0;
        return (product.harga + additionalPrice) * quantity;
    }, [product, additionalPrice, quantity]);


    // --- Logika Opsi Desain ---
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFile(file);
            setSelectedTemplate(null);
            setExistingDesign(null);
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
        setExistingDesign(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    // --- Logika Tombol Aksi & Tooltip ---
    const hasAttributes = Object.keys(attributeGroups).length > 0;
    const areAllOptionsSelected = hasAttributes ? Object.keys(selectedOptions).length === Object.keys(attributeGroups).length : true;

    const isDesignSelected = !product?.enable_design_feature ||
        !!selectedTemplate ||
        !!uploadedFile ||
        !!existingDesign;

    const isActionDisabled = !areAllOptionsSelected || !isDesignSelected || isSubmitting || !product;

    const getTooltipMessage = () => {
        if (!product) return "Memuat data...";
        if (!areAllOptionsSelected) return "Harap pilih semua varian produk.";
        if (product.enable_design_feature && !isDesignSelected) return "Harap unggah desain atau pilih template.";
        return "";
    };

    const handleSubmit = () => {
        if (!product) return;

        setIsSubmitting(true);

        const data: any = {
            product_id: product.id_produk,
            quantity: quantity,
            variant: selectedOptions,
            note: note,
            design: null,
        };

        if (selectedTemplate) {
            data.design = { type: 'template', value: selectedTemplate.id };
        } else if (uploadedFile) {
            data.design = { type: 'upload', value: uploadedFile };
        } else if (isEditMode && existingDesign) {
            data.design = { type: 'upload', value: existingDesign.value, original_filename: existingDesign.original_filename };
        }

        if (isEditMode) {
            data._method = 'PATCH';
        }

        const routeName = isEditMode ? 'cart.update' : 'cart.store';
        const routeParams = isEditMode ? { cartItemId } : {};

        router.post(route(routeName, routeParams), data, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success(isEditMode ? 'Keranjang berhasil diperbarui.' : `${product.nama_produk} berhasil ditambahkan.`);
                setIsSubmitting(false);
                onClose();
            },
            onError: (errors) => {
                console.error("Cart Action Error:", errors);
                toast.error(isEditMode ? 'Gagal memperbarui keranjang.' : 'Gagal menambahkan produk, periksa kembali pilihan Anda.');
                setIsSubmitting(false);
            },
        });
    };

    // --- Logika Render Konten Dialog ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex h-96 w-full items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                </div>
            );
        }

        if (!product) {
            return (
                <div className="flex h-96 w-full flex-col items-center justify-center gap-4 text-center">
                    <p className="text-gray-500">Produk tidak ditemukan atau gagal dimuat.</p>
                    <Button onClick={onClose} variant="outline">Tutup</Button>
                </div>
            )
        }

        // --- Variant Logic ---
        const attributeGroups = (product.attribute_values || []).reduce((acc, value) => {
            const { name } = value.attribute;
            if (!acc[name]) acc[name] = [];
            acc[name].push(value);
            return acc;
        }, {} as Record<string, AttributeValue[]>);

        const hasAttributes = Object.keys(attributeGroups).length > 0;
        const areAllOptionsSelected = hasAttributes ? Object.keys(selectedOptions).length === Object.keys(attributeGroups).length : true;

        const isDesignSelected = !product?.enable_design_feature ||
            !!selectedTemplate ||
            !!uploadedFile ||
            !!existingDesign;

        const isActionDisabled = !areAllOptionsSelected || !isDesignSelected || isSubmitting;

        return (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 h-full overflow-y-auto p-1">
                {/* Kolom Kiri: Galeri */}
                <div>
                    <ProductGallery product={product} />
                </div>

                {/* Kolom Kanan: Detail & Form */}
                <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                {product.category?.name ?? 'Uncategorized'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl leading-tight">{product.nama_produk}</h2>

                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </h3>
                            {product.reviews && product.reviews.length > 0 && (
                                <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                                    <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                                        {(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)}
                                    </span>
                                    <div className="flex items-center gap-0.5">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <span className="text-sm text-gray-500">({product.reviews.length} ulasan)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-4" />

                    {/* Attribute Selection */}
                    {hasAttributes && (
                        <div className="space-y-5">
                            {(Object.entries(attributeGroups) as [string, AttributeValue[]][]).map(([name, values]) => (
                                <div key={name} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                                            {name}
                                            {selectedOptions[values[0].attribute.id] && (
                                                <span className="ml-2 text-orange-600 font-medium">
                                                    : {values.find(v => v.id === selectedOptions[values[0].attribute.id])?.value}
                                                </span>
                                            )}
                                        </Label>
                                    </div>
                                    <RadioGroup onValueChange={(valueId) => handleOptionChange(values[0].attribute.id.toString(), Number(valueId))} className='flex flex-wrap gap-2'>
                                        {values.map((value) => {
                                            const isSelected = selectedOptions[values[0].attribute.id] === value.id;
                                            return (
                                                <Label
                                                    key={value.id}
                                                    htmlFor={`quick_attr_${value.id}`}
                                                    className={cn(
                                                        "group relative flex cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                                                        isSelected
                                                            ? "border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500 dark:bg-orange-950/30 dark:text-orange-400"
                                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                                                    )}
                                                >
                                                    <RadioGroupItem value={value.id.toString()} id={`quick_attr_${value.id}`} className="sr-only" />
                                                    {value.value}
                                                    {value.pivot.price > 0 && (
                                                        <span className="ml-1 text-xs opacity-70">
                                                            (+{value.pivot.price.toLocaleString('id-ID')})
                                                        </span>
                                                    )}
                                                </Label>
                                            );
                                        })}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Design Section */}
                    {product.enable_design_feature && (
                        <div className="space-y-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:bg-gray-800/20 dark:border-gray-700">
                            <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Personalisasi Desain</Label>
                            <Tabs defaultValue={existingDesign ? "upload" : (product.design_templates?.length > 0 ? "template" : "upload")} className="w-full">
                                <TabsList className={cn("grid w-full h-9 p-1 bg-gray-200/50 dark:bg-gray-800 rounded-lg", (product.design_templates?.length > 0 && product.allow_custom_design) ? "grid-cols-2" : "grid-cols-1")}>
                                    {product.design_templates?.length > 0 && <TabsTrigger value="template" className="rounded-md text-xs data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">Template</TabsTrigger>}
                                    {product.allow_custom_design && <TabsTrigger value="upload" className="rounded-md text-xs data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">Upload File</TabsTrigger>}
                                </TabsList>

                                <div className="mt-3">
                                    {product.design_templates?.length > 0 && (
                                        <TabsContent value="template" className="mt-0 space-y-2">
                                            <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto p-1 custom-scrollbar">
                                                {product.design_templates.map(template => (
                                                    <button key={template.id} onClick={() => handleSelectTemplate(template)} className={cn('overflow-hidden rounded-md aspect-square border-2 transition-all w-full relative group', selectedTemplate?.id === template.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-gray-200')}>
                                                        <img src={`/storage/${template.thumbnail_path}`} alt={template.name} className='aspect-square w-full object-cover' />
                                                        {selectedTemplate?.id === template.id && (
                                                            <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                                                                <div className="bg-orange-500 text-white rounded-full p-0.5"><CheckCircle2 className="h-3 w-3" /></div>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            {selectedTemplate && <p className="text-xs text-orange-600 font-medium">Terpilih: {selectedTemplate.name}</p>}
                                        </TabsContent>
                                    )}

                                    {product.allow_custom_design && (
                                        <TabsContent value="upload" className="mt-0">
                                            {isEditMode && existingDesign && !uploadedFile && !selectedTemplate ? (
                                                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                            FILE
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">{existingDesign.original_filename}</p>
                                                            <p className="text-xs text-blue-600 dark:text-blue-300">File saat ini</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => setExistingDesign(null)} className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"><RefreshCw className="h-4 w-4" /></Button>
                                                </div>
                                            ) : uploadedFile ? (
                                                <div className='relative w-full rounded-lg border border-dashed border-green-500 bg-green-50/50 p-3 flex items-center gap-3'>
                                                    <img src={previewUrl!} alt="Preview" className='h-12 w-12 object-contain rounded bg-white' />
                                                    <div className="flex-1 min-w-0">
                                                        <p className='text-sm font-medium text-green-700 truncate'>{uploadedFile.name}</p>
                                                        <p className='text-xs text-green-600'>Siap unggah</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className='h-8 w-8 text-green-600 hover:bg-green-100' onClick={removeUploadedFile}><X className='h-4 w-4' /></Button>
                                                </div>
                                            ) : (
                                                <div {...getRootProps()} className={cn('flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all hover:bg-gray-50', isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-200 dark:border-gray-700')}>
                                                    <input {...getInputProps()} />
                                                    <UploadCloud className='h-8 w-8 text-gray-400 group-hover:text-orange-500' />
                                                    <p className='mt-2 text-xs text-gray-500 text-center'>Klik / Drop file di sini</p>
                                                </div>
                                            )}
                                        </TabsContent>
                                    )}
                                </div>
                            </Tabs>
                        </div>
                    )}

                    {/* Quantity & Action */}
                    <div className="flex items-end gap-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah</Label>
                            <div className="flex items-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm h-11 w-fit">
                                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-full w-10 rounded-l-lg text-gray-500 hover:text-orange-600"><Minus className="h-4 w-4" /></Button>
                                <Input
                                    type="number"
                                    value={quantity}
                                    max={product.stok}
                                    onChange={(e) => setQuantity(Math.min(product.stok, Math.max(1, parseInt(e.target.value) || 1)))}
                                    className="h-full w-12 border-none bg-transparent p-0 text-center font-bold focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(product.stok, q + 1))} className="h-full w-10 rounded-r-lg text-gray-500 hover:text-orange-600"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex-1">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isActionDisabled}
                                            className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
                                            ) : isEditMode ? (
                                                "Simpan Perubahan"
                                            ) : (
                                                "Tambah ke Keranjang"
                                            )}
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                {isActionDisabled && <TooltipContent><p>{getTooltipMessage()}</p></TooltipContent>}
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Simple Note Input */}
                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <NotebookPen className="h-4 w-4 text-orange-500" />
                            <Label htmlFor="note_modal" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Catatan Pesanan
                                <span className="ml-1 text-xs font-normal text-gray-500">(Opsional)</span>
                            </Label>
                        </div>
                        <div className="relative">
                            <Textarea
                                id="note_modal"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Tulis detail khusus atau instruksi pengemasan..."
                                className="min-h-[80px] w-full resize-none rounded-xl border-gray-200 bg-gray-50/50 p-4 text-sm transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-200 dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader className="sr-only">
                    <DialogTitle>Detail Cepat Produk</DialogTitle>
                </DialogHeader>
                <div className="absolute right-4 top-4 z-50">
                    <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
}
