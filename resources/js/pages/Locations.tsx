import React from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/layouts/SiteLayout';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
}

interface Props {
    stores: Store[];
}

// Day name mapping
const DAY_LABELS: Record<string, string> = {
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
    sabtu: 'Sabtu',
    minggu: 'Minggu',
};

// Format days array to readable string
function formatDays(days: string[]): string {
    if (days.length === 0) return '';
    if (days.length === 7) return 'Setiap Hari';

    // Check for consecutive weekdays
    const weekdays = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
    const weekend = ['sabtu', 'minggu'];

    const hasAllWeekdays = weekdays.every(d => days.includes(d));
    const hasNoWeekend = weekend.every(d => !days.includes(d));

    if (hasAllWeekdays && hasNoWeekend) {
        return 'Senin - Jumat';
    }

    // Check for consecutive days
    const allDays = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const sortedDays = days.sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b));

    // Check if consecutive
    let isConsecutive = true;
    for (let i = 1; i < sortedDays.length; i++) {
        const prevIndex = allDays.indexOf(sortedDays[i - 1]);
        const currIndex = allDays.indexOf(sortedDays[i]);
        if (currIndex - prevIndex !== 1) {
            isConsecutive = false;
            break;
        }
    }

    if (isConsecutive && sortedDays.length > 2) {
        return `${DAY_LABELS[sortedDays[0]]} - ${DAY_LABELS[sortedDays[sortedDays.length - 1]]}`;
    }

    // Just list the days
    return sortedDays.map(d => DAY_LABELS[d]).join(', ');
}

export default function Locations({ stores }: Props) {
    return (
        <SiteLayout>
            <Head title="Lokasi Toko" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Lokasi Toko Kami
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Temukan toko Central Printing terdekat dari lokasi Anda. Kami siap melayani kebutuhan cetak dan merchandise Anda.
                        </p>
                    </motion.div>

                    {/* Store Grid */}
                    {stores.length === 0 ? (
                        <div className="text-center py-20">
                            <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Belum ada data toko yang tersedia.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stores.map((store, index) => (
                                <motion.div
                                    key={store.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    {/* Store Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-600">
                                        {store.image_url ? (
                                            <img
                                                src={store.image_url}
                                                alt={store.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <MapPin className="h-16 w-16 text-white/30" />
                                            </div>
                                        )}
                                        {/* Store Name Badge */}
                                        <div className="absolute bottom-0 left-0 right-0">
                                            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-t-3xl mx-4">
                                                <h3 className="font-bold text-lg text-center">{store.name}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Store Info */}
                                    <div className="p-6 space-y-4">
                                        {/* Address */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Find us</p>
                                                <p className="text-sm text-gray-700">{store.address}</p>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        {store.phone && (
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Phone className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Call us</p>
                                                    <a href={`tel:${store.phone}`} className="text-sm text-gray-700 hover:text-orange-600">
                                                        {store.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* WhatsApp */}
                                        {store.whatsapp && (
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <MessageCircle className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">WhatsApp</p>
                                                    <a
                                                        href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-gray-700 hover:text-green-600"
                                                    >
                                                        {store.whatsapp}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Email */}
                                        {store.email && (
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Mail className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                                                    <a href={`mailto:${store.email}`} className="text-sm text-gray-700 hover:text-orange-600">
                                                        {store.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Working Hours - Flexible Format */}
                                        {store.operating_hours && store.operating_hours.length > 0 && (
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <Clock className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Working hours</p>
                                                    <div className="text-sm text-gray-700 space-y-0.5">
                                                        {store.operating_hours.map((schedule, idx) => (
                                                            schedule.days.length > 0 && (
                                                                <p key={idx}>
                                                                    {formatDays(schedule.days)} : {schedule.hours}
                                                                </p>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Google Maps Link */}
                                        {store.google_maps_url && (
                                            <a
                                                href={store.google_maps_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 mt-4 py-3 px-4 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Lihat di Google Maps
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
