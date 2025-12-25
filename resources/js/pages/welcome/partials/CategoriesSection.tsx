import React from 'react';
import { Link } from '@inertiajs/react';
import { Printer, Sticker, CreditCard, Store, Image as ImageIcon, Shirt, PenTool, Gift, Package, Frame } from 'lucide-react';

const categories = [
    { name: 'Digital Printing', icon: <Printer className="w-8 h-8" />, desc: 'Brosur, Flyer, Dokumen', color: 'bg-blue-50 text-blue-600' },
    { name: 'Sticker & Label', icon: <Sticker className="w-8 h-8" />, desc: 'Vinyl, Chromo, Transparan', color: 'bg-green-50 text-green-600' },
    { name: 'Kartu Nama', icon: <CreditCard className="w-8 h-8" />, desc: 'Premium, Spot UV, Matte', color: 'bg-purple-50 text-purple-600' },
    { name: 'Display Promosi', icon: <Store className="w-8 h-8" />, desc: 'X-Banner, Roll Up Banner', color: 'bg-orange-50 text-orange-600' },
    { name: 'Large Format', icon: <ImageIcon className="w-8 h-8" />, desc: 'Spanduk, Baliho, Billboard', color: 'bg-red-50 text-red-600' },
    { name: 'Tekstil & Garment', icon: <Shirt className="w-8 h-8" />, desc: 'Kaos, Jersey, Tote Bag', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Stationery', icon: <PenTool className="w-8 h-8" />, desc: 'Kop Surat, Amplop, Map', color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Merchandise', icon: <Gift className="w-8 h-8" />, desc: 'Mug, Tumbler, USB, Pin', color: 'bg-pink-50 text-pink-600' },
    { name: 'Packaging', icon: <Package className="w-8 h-8" />, desc: 'Box Makanan, Paper Bag', color: 'bg-teal-50 text-teal-600' },
    { name: 'Dekorasi & Foto', icon: <Frame className="w-8 h-8" />, desc: 'Kanvas, Foto Blok, Poster', color: 'bg-cyan-50 text-cyan-600' },
];

export default function CategoriesSection({ isInView }: { isInView: boolean }) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="text-orange-600 font-semibold tracking-wide uppercase text-sm">Layanan Lengkap</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Solusi Cetak untuk Semua Kebutuhan</h2>
                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        Dari kebutuhan bisnis hingga personal, kami menyediakan layanan cetak berkualitas tinggi dengan teknologi terbaru.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            href="#"
                            key={category.name}
                            className={`group relative p-6 rounded-2xl border border-gray-100 hover:border-orange-200 bg-white hover:shadow-lg transition-all duration-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${category.color} group-hover:bg-orange-600 group-hover:text-white`}>
                                {category.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{category.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{category.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
