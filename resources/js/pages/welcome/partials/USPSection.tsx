import React from 'react';
import { Clock, ShieldCheck, Truck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Clock className="h-6 w-6" />,
        title: "Pengerjaan Kilat",
        desc: "Sehari jadi untuk produk tertentu",
        color: "bg-orange-50 text-orange-600",
        delay: 0
    },
    {
        icon: <ShieldCheck className="h-6 w-6" />,
        title: "Jaminan Kualitas",
        desc: "Garansi cetak ulang jika cacat",
        color: "bg-blue-50 text-blue-600",
        delay: 0.1
    },
    {
        icon: <Truck className="h-6 w-6" />,
        title: "Pengiriman Luas",
        desc: "Jangkauan seluruh Indonesia",
        color: "bg-emerald-50 text-emerald-600",
        delay: 0.2
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Harga Kompetitif",
        desc: "Murah tanpa kurangi kualitas",
        color: "bg-purple-50 text-purple-600",
        delay: 0.3
    }
];

export default function USPSection() {
    return (
        <section className="bg-white border-y border-gray-100 py-10 mb-12">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            className="flex items-center gap-4 group cursor-default"
                        >
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-base mb-1">{feature.title}</h4>
                                <p className="text-sm text-gray-500 leading-tight">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
