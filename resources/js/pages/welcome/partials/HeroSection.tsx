import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Star, Package, Gift, Sparkles, Zap, Printer, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Autoplay from "embla-carousel-autoplay"

export default function HeroSection() {
    const plugin = useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
    );

    // Variabel animasi tersentralisasi & halus
    const anim = {
        container: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, ease: "easeOut" }
            }
        },
        heroLeft: {
            hidden: { opacity: 0, y: 30 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Custom bezier for premium feel
            }
        },
        cardRight: {
            hidden: { opacity: 0, x: 20, scale: 0.98 },
            visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: { duration: 0.7, ease: "easeOut" }
            }
        }
    };

    const slides = [
        {
            id: 1,
            title: "Cetak Spanduk Kilat",
            subtitle: "Promo Terbatas",
            description: "Kualitas tajam, tahan cuaca, bisa ditunggu. Pesan sekarang, besok langsung jadi!",
            color: "bg-gradient-to-r from-orange-600 to-amber-600",
            textColor: "text-white",
            buttonStyle: "bg-white text-orange-600 hover:bg-orange-50",
            icon: <Printer className="w-full h-full text-white/10" />
        },
        {
            id: 2,
            title: "Merchandise Kantor",
            subtitle: "Solusi Branding",
            description: "Tingkatkan citra perusahaan dengan merchandise eksklusif dan berkualitas tinggi.",
            color: "bg-gradient-to-r from-blue-600 to-indigo-600",
            textColor: "text-white",
            buttonStyle: "bg-white text-blue-600 hover:bg-blue-50",
            icon: <Gift className="w-full h-full text-white/10" />
        },
        {
            id: 3,
            title: "Diskon Member Baru",
            subtitle: "Spesial Member",
            description: "Bergabung sekarang dan nikmati potongan harga spesial untuk transaksi pertama Anda.",
            color: "bg-gradient-to-r from-emerald-600 to-teal-600",
            textColor: "text-white",
            buttonStyle: "bg-white text-emerald-600 hover:bg-emerald-50",
            icon: <Package className="w-full h-full text-white/10" />
        }
    ];

    return (
        <section className="container mx-auto px-4 lg:px-6 mb-0 py-5">
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[550px]"
                variants={anim.container}
                initial="hidden"
                animate="visible"
            >
                {/* --- HERO UTAMA (KIRI - 8 Kolom) --- */}
                <motion.div
                    className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-md group h-[450px] lg:h-full"
                    variants={anim.heroLeft}
                >
                    <Carousel
                        plugins={[plugin.current]}
                        opts={{ loop: true }}
                        className="w-full h-full"
                    >
                        <CarouselContent className="h-full ml-0">
                            {slides.map((slide, index) => (
                                <CarouselItem key={index} className="pl-0 h-full">
                                    <div className={`w-full h-full ${slide.color} flex items-center relative overflow-hidden`}>

                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                                        <div className="container px-8 lg:px-12 flex items-center justify-between h-full relative z-10 w-full">
                                            {/* Text Content */}
                                            <div className="max-w-2xl py-35">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2, duration: 0.5 }}
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white mb-6"
                                                >
                                                    <Sparkles className="w-3 h-3" />
                                                    {slide.subtitle}
                                                </motion.div>

                                                <motion.h2
                                                    initial={{ opacity: 0, y: 15 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.6 }}
                                                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
                                                >
                                                    {slide.title}
                                                </motion.h2>

                                                <motion.p
                                                    initial={{ opacity: 0, y: 15 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4, duration: 0.6 }}
                                                    className="text-lg text-white/90 mb-8 max-w-lg font-medium leading-relaxed"
                                                >
                                                    {slide.description}
                                                </motion.p>

                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    {index === 0 && (
                                                        <button className="group hover:shadow-orange-500/50 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white border-2 border-white/20 rounded-full pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-lg">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-400/20 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                            <div className="relative z-10 flex items-center gap-3">
                                                                <div className="flex-1 text-left">
                                                                    <p className="transition-colors duration-300 text-sm font-bold text-orange-600 group-hover:text-orange-700 font-geist">
                                                                        Lihat Penawaran
                                                                    </p>
                                                                </div>
                                                                <div className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                                                    <ArrowRight className="w-4 h-4 text-orange-600 group-hover:text-orange-700" />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )}
                                                    {index === 1 && (
                                                        <button className="group hover:shadow-blue-500/50 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white border-2 border-white/20 rounded-full pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-lg">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/20 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                            <div className="relative z-10 flex items-center gap-3">
                                                                <div className="flex-1 text-left">
                                                                    <p className="transition-colors duration-300 text-sm font-bold text-blue-600 group-hover:text-blue-700 font-geist">
                                                                        Lihat Penawaran
                                                                    </p>
                                                                </div>
                                                                <div className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                                                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )}
                                                    {index === 2 && (
                                                        <button className="group hover:shadow-emerald-500/50 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white border-2 border-white/20 rounded-full pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-lg">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-400/20 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                            <div className="relative z-10 flex items-center gap-3">
                                                                <div className="flex-1 text-left">
                                                                    <p className="transition-colors duration-300 text-sm font-bold text-emerald-600 group-hover:text-emerald-700 font-geist">
                                                                        Lihat Penawaran
                                                                    </p>
                                                                </div>
                                                                <div className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                                                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )}
                                                </motion.div>
                                            </div>

                                            {/* Icon Illustration (Desktop) */}
                                            <div className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-20 w-[500px] h-[500px] pointer-events-none rotate-12">
                                                {slide.icon}
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="absolute bottom-6 right-8 flex gap-3">
                            <CarouselPrevious className="static translate-y-0 bg-white/10 border-0 text-white hover:bg-white/20 h-10 w-10" />
                            <CarouselNext className="static translate-y-0 bg-white/10 border-0 text-white hover:bg-white/20 h-10 w-10" />
                        </div>
                    </Carousel>
                </motion.div>

                {/* --- PROMO CARDS (KANAN - 4 Kolom) --- */}
                <div className="lg:col-span-4 flex flex-col gap-4 h-full">

                    {/* Card 1 */}
                    <motion.div
                        variants={anim.cardRight}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="flex-1 bg-orange-50 rounded-3xl p-8 relative overflow-hidden border border-orange-100/50 shadow-sm cursor-pointer group"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-center items-start">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                                <Zap className="w-3 h-3" /> Best Seller
                            </span>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                Kartu Nama
                            </h3>
                            <p className="text-gray-500 text-sm font-medium mb-auto">
                                Premium quality, mulai <span className="text-orange-600 font-bold">25rb</span>
                            </p>
                            <div className="mt-4 flex items-center text-sm font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                                Pesan Sekarang <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                        <Star className="absolute -right-6 -bottom-6 w-40 h-40 text-orange-200/40 group-hover:rotate-12 transition-transform duration-500 ease-out" />
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        variants={anim.cardRight}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="flex-1 bg-blue-50 rounded-3xl p-8 relative overflow-hidden border border-blue-100/50 shadow-sm cursor-pointer group"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-center items-start">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                                <CheckCircle className="w-3 h-3" /> New Arrival
                            </span>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                Custom Pack
                            </h3>
                            <p className="text-gray-500 text-sm font-medium mb-auto">
                                Kemasan unik untuk brandmu
                            </p>
                            <div className="mt-4 flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                Lihat Katalog <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                        <Package className="absolute -right-6 -bottom-6 w-40 h-40 text-blue-200/40 group-hover:rotate-12 transition-transform duration-500 ease-out" />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
