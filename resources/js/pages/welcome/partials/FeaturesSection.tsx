import React from 'react';
import { Zap, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
    return (
        <section className="relative py-20 overflow-hidden">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
                {/* Hero / Big Visual */}
                <div className="grid md:grid-cols-2 gap-6 bg-white border border-gray-100 p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative overflow-hidden rounded-2xl min-h-[300px] md:min-h-[400px]"
                    >
                        <img
                            src="/storage/images/printing_tech.png"
                            alt="Mesin Cetak Modern"
                            className="absolute inset-0 h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute left-6 bottom-6 flex items-center gap-2"
                        >
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur text-white border border-white/30">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <p className="text-sm font-medium text-white">Teknologi Offset & Digital Terbaru</p>
                        </motion.div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col p-6 md:p-10 justify-center"
                    >
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
                            {[
                                { val: "50K+", label: "Pesanan Selesai" },
                                { val: "99.9%", label: "Akurasi Warna" },
                                { val: "24/7", label: "Layanan Support" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 + (i * 0.1) }}
                                    className="p-4 bg-gray-50 rounded-2xl"
                                >
                                    <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
