import React from 'react';
import { Zap, ShieldCheck, Clock, FileCheck } from 'lucide-react';

export default function FeaturesSection({ isInView }: { isInView: boolean }) {
    return (
        <section className={`relative transition-all duration-1000 ease-out py-20 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
                {/* Top feature chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Card 1 */}
                    <div className="flex flex-col h-48 sm:h-56 lg:h-64 rounded-3xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow justify-between">
                        <div className="flex items-center">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                <Zap className="h-6 w-6" />
                            </span>
                        </div>
                        <div>
                            <h3 className="mt-2 text-lg font-bold text-gray-900">Cetak Kilat</h3>
                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                Pesanan selesai dalam hitungan jam untuk kebutuhan mendesak Anda.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col h-48 sm:h-56 lg:h-64 rounded-3xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow justify-between">
                        <div className="flex items-center">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <ShieldCheck className="h-6 w-6" />
                            </span>
                        </div>
                        <div>
                            <h3 className="mt-2 text-lg font-bold text-gray-900">Garansi 100%</h3>
                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                Jaminan cetak ulang gratis jika hasil tidak sesuai standar kualitas kami.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col h-48 sm:h-56 lg:h-64 rounded-3xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow justify-between">
                        <div className="flex items-center">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                <Clock className="h-6 w-6" />
                            </span>
                        </div>
                        <div>
                            <h3 className="mt-2 text-lg font-bold text-gray-900">Layanan 24 Jam</h3>
                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                Pesan kapan saja secara online, kami proses pesanan Anda non-stop.
                            </p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="flex flex-col h-48 sm:h-56 lg:h-64 rounded-3xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow justify-between">
                        <div className="flex items-center">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                <FileCheck className="h-6 w-6" />
                            </span>
                        </div>
                        <div>
                            <h3 className="mt-2 text-lg font-bold text-gray-900">Bantuan Desain</h3>
                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                Tim desainer profesional siap membantu memastikan file Anda siap cetak.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hero / Big Visual */}
                <div className="grid md:grid-cols-2 gap-6 bg-white border border-gray-100 p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    {/* Visual */}
                    <div className="relative overflow-hidden rounded-2xl min-h-[300px] md:min-h-[400px]">
                        <img
                            src="https://placehold.co/800x600/F3F4F6/1F2937?text=Teknologi+Cetak+Terbaru"
                            alt="Mesin Cetak Modern"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute left-6 bottom-6 flex items-center gap-2">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur text-white border border-white/30">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <p className="text-sm font-medium text-white">Teknologi Offset & Digital Terbaru</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col p-6 md:p-10 justify-center">
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-600 mb-4">
                            <span className="px-3 py-1 bg-orange-50 rounded-full">New Machine 2024</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                            Kualitas Warna <br /> Yang Presisi.
                        </h2>
                        <p className="mt-6 text-gray-600 leading-relaxed">
                            Kami menggunakan mesin cetak terbaru untuk memastikan setiap detail warna pada desain Anda tercetak dengan sempurna dan konsisten, dari lembar pertama hingga terakhir.
                        </p>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-2xl font-bold text-gray-900">50K+</p>
                                <p className="text-xs text-gray-500 mt-1">Pesanan Selesai</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                                <p className="text-xs text-gray-500 mt-1">Akurasi Warna</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-2xl font-bold text-gray-900">24/7</p>
                                <p className="text-xs text-gray-500 mt-1">Layanan Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
