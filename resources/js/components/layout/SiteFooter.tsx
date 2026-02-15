import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:block">
            {/* Mobile: accordion header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-between w-full py-4 border-b border-gray-800"
            >
                <h3 className="text-white font-bold text-base">{title}</h3>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Desktop: always visible title */}
            <h3 className="hidden lg:block text-white font-bold text-lg mb-6">{title}</h3>

            {/* Content: collapsible on mobile, always visible on desktop */}
            <div className={cn(
                "lg:block overflow-hidden transition-all duration-300",
                isOpen ? "max-h-[500px] py-4 lg:py-0" : "max-h-0 lg:max-h-none"
            )}>
                {children}
            </div>
        </div>
    );
}

export default function SiteFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300 mb-16 lg:mb-0">
            {/* Top Footer */}
            <div className="container mx-auto px-4 lg:px-6 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-12">
                    {/* Brand Column - Always visible */}
                    <div className="space-y-4 lg:space-y-6 pb-6 lg:pb-0 border-b border-gray-800 lg:border-0">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/storage/logo/logo.png"
                                alt="Logo Central Printing"
                                className="h-8 lg:h-10 w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Mitra cetak terpercaya Anda untuk segala kebutuhan bisnis dan personal.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-orange-600 hover:text-white transition-all">
                                <Facebook className="w-4 h-4 lg:w-5 lg:h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-orange-600 hover:text-white transition-all">
                                <Instagram className="w-4 h-4 lg:w-5 lg:h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-orange-600 hover:text-white transition-all">
                                <Twitter className="w-4 h-4 lg:w-5 lg:h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links - Accordion on mobile */}
                    <FooterAccordion title="Layanan Kami">
                        <ul className="space-y-3 lg:space-y-4">
                            {['Digital Printing', 'Offset Printing', 'Large Format', 'Merchandise', 'Desain Grafis'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="flex items-center gap-2 hover:text-orange-500 transition-colors group text-sm">
                                        <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                                        <span>{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </FooterAccordion>

                    {/* Contact Info - Accordion on mobile */}
                    <FooterAccordion title="Hubungi Kami">
                        <ul className="space-y-3 lg:space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>Jl. Merdeka No. 123, Jakarta Selatan, 12000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500 flex-shrink-0" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500 flex-shrink-0" />
                                <span>info@centralprinting.com</span>
                            </li>
                        </ul>
                    </FooterAccordion>

                    {/* Newsletter - Accordion on mobile */}
                    <FooterAccordion title="Berlangganan">
                        <p className="text-sm text-gray-400 mb-3 lg:mb-4">Dapatkan info promo dan penawaran menarik langsung di inbox Anda.</p>
                        <form className="space-y-3">
                            <Input
                                type="email"
                                placeholder="Masukkan email Anda"
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 h-10"
                            />
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold h-10">
                                Subscribe Sekarang
                            </Button>
                        </form>
                    </FooterAccordion>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
                    <p className="text-xs lg:text-sm text-gray-500 text-center">
                        &copy; {new Date().getFullYear()} Central Printing. All Rights Reserved.
                    </p>
                    <div className="flex gap-4 lg:gap-6 text-xs lg:text-sm font-medium">
                        <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                        <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
