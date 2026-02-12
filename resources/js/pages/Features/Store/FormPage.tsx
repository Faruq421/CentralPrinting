import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Upload, MapPin, Phone, Mail, Clock, Globe, Plus, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface OperatingHour {
    days: string[];
    hours: string;
}

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
    operating_hours: OperatingHour[] | null;
    google_maps_url: string | null;
    is_active: boolean;
}

interface Props {
    store: Store | null;
}

const DAYS = [
    { id: 'senin', label: 'Senin' },
    { id: 'selasa', label: 'Selasa' },
    { id: 'rabu', label: 'Rabu' },
    { id: 'kamis', label: 'Kamis' },
    { id: 'jumat', label: 'Jumat' },
    { id: 'sabtu', label: 'Sabtu' },
    { id: 'minggu', label: 'Minggu' },
];

export default function FormPage({ store }: Props) {
    const isEditing = store !== null;
    const [imagePreview, setImagePreview] = useState<string | null>(store?.image_url || null);

    // Default operating hours - all days same time
    const defaultOperatingHours: OperatingHour[] = [
        { days: ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'], hours: '08.00 - 22.00' }
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: store?.name || '',
        address: store?.address || '',
        phone: store?.phone || '',
        whatsapp: store?.whatsapp || '',
        email: store?.email || '',
        operating_hours: store?.operating_hours || defaultOperatingHours,
        google_maps_url: store?.google_maps_url || '',
        is_active: store?.is_active ?? true,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            post(route('stores.update', store.id), {
                forceFormData: true,
                _method: 'PUT',
            } as any);
        } else {
            post(route('stores.store'), {
                forceFormData: true,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error('Ukuran gambar terlalu besar. Maksimal 2MB.');
                e.target.value = '';
                return;
            }
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add new operating hour group
    const addOperatingHourGroup = () => {
        const newGroup: OperatingHour = { days: [], hours: '08.00 - 17.00' };
        setData('operating_hours', [...data.operating_hours, newGroup]);
    };

    // Remove operating hour group
    const removeOperatingHourGroup = (index: number) => {
        const updated = data.operating_hours.filter((_, i) => i !== index);
        setData('operating_hours', updated.length > 0 ? updated : [{ days: [], hours: '' }]);
    };

    // Update hours for a group
    const updateGroupHours = (index: number, hours: string) => {
        const updated = [...data.operating_hours];
        updated[index] = { ...updated[index], hours };
        setData('operating_hours', updated);
    };

    // Toggle day in a group
    const toggleDayInGroup = (groupIndex: number, dayId: string) => {
        const updated = [...data.operating_hours];
        const group = updated[groupIndex];

        if (group.days.includes(dayId)) {
            // Remove day from this group
            group.days = group.days.filter(d => d !== dayId);
        } else {
            // Remove day from all other groups first
            updated.forEach((g, i) => {
                if (i !== groupIndex) {
                    g.days = g.days.filter(d => d !== dayId);
                }
            });
            // Add day to this group
            group.days = [...group.days, dayId];
        }

        setData('operating_hours', updated);
    };

    // Check if day is selected in any group
    const isDayInGroup = (groupIndex: number, dayId: string) => {
        return data.operating_hours[groupIndex]?.days.includes(dayId) || false;
    };

    // Get which group a day belongs to (for visual feedback)
    const getDayGroupIndex = (dayId: string): number | null => {
        for (let i = 0; i < data.operating_hours.length; i++) {
            if (data.operating_hours[i].days.includes(dayId)) {
                return i;
            }
        }
        return null;
    };

    return (
        <AppLayout>
            <Toaster richColors position="top-center" />
            <Head title={isEditing ? `Edit: ${store.name}` : 'Tambah Toko Baru'} />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href={route('stores.index')} className="inline-flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Toko
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {isEditing ? 'Edit Toko' : 'Tambah Toko Baru'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Store Image */}
                            <div className="space-y-2">
                                <Label>Gambar Toko</Label>
                                <div className="flex items-start gap-6">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-40 h-28 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <div className="w-40 h-28 bg-gray-100 rounded-lg border flex items-center justify-center">
                                            <MapPin className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <Label htmlFor="image" className="cursor-pointer">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                                <Upload className="h-4 w-4" />
                                                Pilih Gambar
                                            </div>
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, WebP. Maks 2MB</p>
                                    </div>
                                </div>
                                {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                            </div>

                            {/* Store Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Toko *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Central Printing Ciputat"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat Lengkap *</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Ir. Juanda Komp. Ruko Mega Mall Blok A No. 1, Ciputat - Tangerang"
                                    rows={3}
                                    required
                                />
                                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                            </div>

                            {/* Contact Info Grid */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Telepon
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="(+62) 21 741 8002"
                                    />
                                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-green-600" /> WhatsApp
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        placeholder="0812-1942-3365"
                                    />
                                    {errors.whatsapp && <p className="text-sm text-red-600">{errors.whatsapp}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="store@centralprinting.co.id"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Flexible Operating Hours */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-base font-semibold">
                                        <Clock className="h-4 w-4" /> Jam Operasional
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addOperatingHourGroup}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Tambah Jadwal
                                    </Button>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Pilih hari-hari yang memiliki jam operasional sama, lalu atur jamnya. Tambahkan jadwal baru untuk hari dengan jam berbeda.
                                </p>

                                <div className="space-y-4">
                                    {data.operating_hours.map((group, groupIndex) => (
                                        <div key={groupIndex} className="p-4 bg-gray-50 rounded-lg border space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Jadwal {groupIndex + 1}
                                                </span>
                                                {data.operating_hours.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeOperatingHourGroup(groupIndex)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Day Selection */}
                                            <div className="flex flex-wrap gap-2">
                                                {DAYS.map((day) => {
                                                    const isSelected = isDayInGroup(groupIndex, day.id);
                                                    const otherGroupIndex = getDayGroupIndex(day.id);
                                                    const isInOtherGroup = otherGroupIndex !== null && otherGroupIndex !== groupIndex;

                                                    return (
                                                        <label
                                                            key={day.id}
                                                            className={`
                                                                flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
                                                                ${isSelected
                                                                    ? 'bg-orange-100 border-orange-500 text-orange-700'
                                                                    : isInOtherGroup
                                                                        ? 'bg-gray-100 border-gray-300 text-gray-400'
                                                                        : 'bg-white border-gray-200 hover:border-orange-300'
                                                                }
                                                            `}
                                                        >
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() => toggleDayInGroup(groupIndex, day.id)}
                                                                className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                                            />
                                                            <span className="text-sm font-medium">{day.label}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            {/* Hours Input */}
                                            <div className="flex items-center gap-4">
                                                <Label className="text-sm text-gray-600 whitespace-nowrap">Jam Buka:</Label>
                                                <Input
                                                    value={group.hours}
                                                    onChange={(e) => updateGroupHours(groupIndex, e.target.value)}
                                                    placeholder="08.00 - 22.00"
                                                    className="max-w-48"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Google Maps URL */}
                            <div className="space-y-2">
                                <Label htmlFor="google_maps_url" className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Link Google Maps
                                </Label>
                                <Input
                                    id="google_maps_url"
                                    type="url"
                                    value={data.google_maps_url}
                                    onChange={(e) => setData('google_maps_url', e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                />
                                {errors.google_maps_url && <p className="text-sm text-red-600">{errors.google_maps_url}</p>}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <Label htmlFor="is_active" className="font-medium">Status Aktif</Label>
                                    <p className="text-sm text-gray-500">Toko aktif akan ditampilkan di halaman lokasi</p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button type="submit" disabled={processing} className="min-w-32">
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                            Menyimpan...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            {isEditing ? 'Simpan Perubahan' : 'Tambah Toko'}
                                        </span>
                                    )}
                                </Button>
                                <Link href={route('stores.index')}>
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
