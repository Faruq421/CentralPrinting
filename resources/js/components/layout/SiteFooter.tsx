import React from 'react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight, Printer } from 'lucide-react';

export default function SiteFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Top Footer */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/storage/logo/logo.png"
                                alt="Logo Central Printing"
                                className="h-10 w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Mitra cetak terpercaya Anda untuk segala kebutuhan bisnis dan personal. Kualitas terbaik, harga bersaing, dan pelayanan cepat.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-orange-600 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-orange-600 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-orange-600 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Link 1 */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Layanan Kami</h3>
                        <ul className="space-y-4">
                            {['Digital Printing', 'Offset Printing', 'Large Format', 'Merchandise', 'Desain Grafis'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="flex items-center gap-2 hover:text-orange-500 transition-colors group">
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                                        <span>{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Hubungi Kami</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>Jl. Merdeka No. 123, Jakarta Selatan, 12000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <span>info@centralprinting.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Berlangganan</h3>
                        <p className="text-sm text-gray-400 mb-4">Dapatkan info promo dan penawaran menarik langsung di inbox Anda.</p>
                        <form className="space-y-3">
                            <Input
                                type="email"
                                placeholder="Masukkan email Anda"
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
                            />
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                                Subscribe Sekarang
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Central Printing. All Rights Reserved.
                    </p>
                    <div className="flex gap-6 text-sm font-medium">
                        <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                        <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
