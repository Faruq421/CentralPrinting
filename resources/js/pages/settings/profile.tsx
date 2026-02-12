import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import SiteLayout from '@/layouts/SiteLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Lock, Mail, MapPin, User, Phone, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Define Customer type
interface Customer {
    id?: number;
    user_id?: number;
    phone_number?: string;
    address?: string;
    city?: string;
    province?: string;
}

// Password Form Component
function PasswordForm() {
    const { data, setData, put, processing, recentlySuccessful, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={handlePasswordSubmit}>
            <Card className="border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                    <CardTitle>Keamanan Akun</CardTitle>
                    <CardDescription>Ganti kata sandi untuk melindungi akun Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Success Message */}
                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Kata sandi berhasil diperbarui!
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="current_password">Kata Sandi Saat Ini</Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                className="pr-10"
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.current_password && (
                            <p className="text-sm text-red-600">{errors.current_password}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Kata Sandi Baru</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="pr-10"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="pr-10"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t border-gray-100 flex justify-end py-4">
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={processing}>
                        {processing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Lock className="mr-2 h-4 w-4" />
                        )}
                        {processing ? 'Menyimpan...' : 'Update Kata Sandi'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

export default function Profile({ auth, mustVerifyEmail, status, customer }: PageProps<{ mustVerifyEmail: boolean, status?: string, customer?: Customer }>) {
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('profile');

    // Form state using Inertia useForm
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        phone_number: customer?.phone_number || '',
        address: customer?.address || '',
        city: customer?.city || '',
        province: customer?.province || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <SiteLayout>
            <Head title="Pengaturan Akun" />

            <div className="bg-gray-50 min-h-screen py-10">
                <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Akun</h1>
                        <p className="text-gray-500 mt-2">Kelola informasi profil dan keamanan akun Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Avatar & Basic Info */}
                        <div className="space-y-8">
                            <Card className="border-gray-200 shadow-sm overflow-hidden">
                                <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                                <div className="px-6 relative">
                                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                                        <div className="relative group cursor-pointer">
                                            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=ffedd5&color=ea580c`} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="pt-20 pb-8 text-center">
                                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <div className="mt-6 flex flex-col gap-2">
                                        <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold inline-block mx-auto border border-orange-100">
                                            Member
                                        </div>
                                        <span className="text-xs text-gray-400">Bergabung sejak {new Date().getFullYear()}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions / Navigation */}
                            <div className="hidden lg:block">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-2">Menu</h3>
                                <div className="space-y-1">
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start font-medium ${activeTab === 'profile' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        <User className="mr-3 h-4 w-4" /> Informasi Pribadi
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start font-medium ${activeTab === 'security' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                                        onClick={() => setActiveTab('security')}
                                    >
                                        <Lock className="mr-3 h-4 w-4" /> Keamanan Akun
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Forms */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* 1. PERSONAL INFO CARD */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleSubmit}>
                                    <Card className="border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <CardHeader>
                                            <CardTitle>Informasi Pribadi</CardTitle>
                                            <CardDescription>Perbarui data diri dan alamat pengiriman Anda.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">

                                            {/* Success Message */}
                                            {recentlySuccessful && (
                                                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Profil berhasil diperbarui!
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">No. Handphone</Label>
                                                <Input
                                                    id="phone"
                                                    placeholder="Contoh: 081234567890"
                                                    value={data.phone_number}
                                                    onChange={(e) => setData('phone_number', e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address">Alamat Lengkap</Label>
                                                <Input
                                                    id="address"
                                                    placeholder="Nama jalan, nomor rumah, RT/RW..."
                                                    className="h-auto py-3"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                />
                                                <p className="text-xs text-gray-500">Alamat ini akan digunakan sebagai tujuan pengiriman default.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">Kota / Kabupaten</Label>
                                                    <Input
                                                        id="city"
                                                        placeholder="Masukkan kota..."
                                                        value={data.city}
                                                        onChange={(e) => setData('city', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="province">Provinsi</Label>
                                                    <Input
                                                        id="province"
                                                        placeholder="Masukkan provinsi..."
                                                        value={data.province}
                                                        onChange={(e) => setData('province', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-gray-50/50 border-t border-gray-100 flex justify-end py-4">
                                            <Button type="submit" className="bg-gray-900 hover:bg-black text-white" disabled={processing}>
                                                {processing ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="mr-2 h-4 w-4" />
                                                )}
                                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            )}

                            {/* 2. SECURITY CARD (Password Only) */}
                            {activeTab === 'security' && (
                                <PasswordForm />
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
