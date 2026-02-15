import React, { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

// === TYPES ===
interface HeroSlideData {
    id: number;
    position: 'main_slider' | 'promo_card';
    title: string;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    image_url: string | null;
    gradient_from: string;
    gradient_to: string;
    button_enabled: boolean;
    button_text: string | null;
    button_link_type: 'product' | 'category' | 'custom_url' | null;
    button_link_value: string | null;
    is_active: boolean;
}

interface HeroSectionProps {
    heroSlides: HeroSlideData[];
    promoCards: HeroSlideData[];
}

// === COLOR MAPPING: Tailwind name → HEX ===
// Needed because Tailwind CSS v4 purges dynamic class names.
// We use inline styles with actual hex colors instead.
const COLOR_MAP: Record<string, string> = {
    'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-200': '#fed7aa',
    'orange-400': '#fb923c', 'orange-500': '#f97316', 'orange-600': '#ea580c', 'orange-700': '#c2410c',
    'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-400': '#fbbf24',
    'amber-500': '#f59e0b', 'amber-600': '#d97706',
    'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-200': '#bfdbfe',
    'blue-400': '#60a5fa', 'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8',
    'indigo-500': '#6366f1', 'indigo-600': '#4f46e5',
    'emerald-50': '#ecfdf5', 'emerald-100': '#d1fae5', 'emerald-200': '#a7f3d0',
    'emerald-400': '#34d399', 'emerald-500': '#10b981', 'emerald-600': '#059669', 'emerald-700': '#047857',
    'teal-500': '#14b8a6', 'teal-600': '#0d9488',
    'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-200': '#e9d5ff',
    'purple-400': '#a78bfa', 'purple-500': '#8b5cf6', 'purple-600': '#7c3aed', 'purple-700': '#6d28d9',
    'violet-500': '#8b5cf6', 'violet-600': '#7c3aed',
    'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-200': '#fecaca',
    'red-400': '#f87171', 'red-500': '#ef4444', 'red-600': '#dc2626', 'red-700': '#b91c1c',
    'rose-50': '#fff1f2', 'rose-100': '#ffe4e6', 'rose-200': '#fecdd3',
    'rose-400': '#fb7185', 'rose-500': '#f43f5e', 'rose-600': '#e11d48',
    'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb',
    'gray-400': '#9ca3af', 'gray-500': '#6b7280', 'gray-600': '#4b5563',
    'gray-700': '#374151', 'gray-800': '#1f2937', 'gray-900': '#111827',
};

function getHex(colorName: string): string {
    return COLOR_MAP[colorName] || '#ea580c'; // fallback to orange-600
}

// === ACCENT COLOR for buttons (using solid colors from gradient_from) ===
function getAccentHex(gradientFrom: string): string {
    return getHex(gradientFrom);
}

// === HELPER: Build button link URL ===
function buildButtonHref(slide: HeroSlideData): string {
    if (!slide.button_link_type || !slide.button_link_value) return '#';

    switch (slide.button_link_type) {
        case 'product':
            return route('products.show', slide.button_link_value);
        case 'category':
            return route('shop.index', { category: slide.button_link_value });
        case 'custom_url':
            return slide.button_link_value;
        default:
            return '#';
    }
}

// === PROMO CARD STYLES using inline colors ===
function getPromoCardInlineStyles(gradientFrom: string) {
    const hex = getHex(gradientFrom);
    const base = gradientFrom.split('-')[0];

    // Light background variations
    const bgHex = getHex(`${base}-50`) || hex + '10';
    const borderHex = getHex(`${base}-100`) || hex + '30';
    const badgeBgHex = getHex(`${base}-100`) || hex + '20';

    return { bgHex, borderHex, badgeBgHex, accentHex: hex };
}

export default function HeroSection({ heroSlides, promoCards }: HeroSectionProps) {
    const plugin = useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
    );

    const anim = {
        container: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
            }
        },
        heroLeft: {
            hidden: { opacity: 0, y: 30 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8 }
            }
        },
        cardRight: {
            hidden: { opacity: 0, x: 20, scale: 0.98 },
            visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: { duration: 0.7 }
            }
        }
    };

    if (heroSlides.length === 0 && promoCards.length === 0) {
        return null;
    }

    return (
        <section className="container mx-auto px-4 lg:px-6 mb-0 py-5">
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[550px]"
                variants={anim.container}
                initial="hidden"
                animate="visible"
            >
                {/* --- HERO UTAMA (KIRI) --- */}
                {heroSlides.length > 0 && (
                    <motion.div
                        className={`${promoCards.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} relative rounded-3xl overflow-hidden shadow-md group h-[450px] lg:h-full`}
                        variants={anim.heroLeft}
                    >
                        <Carousel
                            plugins={[plugin.current]}
                            opts={{ loop: true }}
                            className="w-full h-full"
                        >
                            <CarouselContent className="h-full ml-0">
                                {heroSlides.map((slide) => {
                                    const fromHex = getHex(slide.gradient_from);
                                    const toHex = getHex(slide.gradient_to);
                                    const accentHex = getAccentHex(slide.gradient_from);
                                    const href = buildButtonHref(slide);

                                    return (
                                        <CarouselItem key={slide.id} className="pl-0 h-full">
                                            <div className="w-full h-full flex items-center relative overflow-hidden">

                                                {/* Background: Image or Gradient */}
                                                {slide.image_url ? (
                                                    <img
                                                        src={slide.image_url}
                                                        alt={slide.title}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="absolute inset-0 w-full h-full"
                                                        style={{
                                                            background: `linear-gradient(to right, ${fromHex}, ${toHex})`
                                                        }}
                                                    />
                                                )}

                                                {/* Dark overlay for text readability (images) */}
                                                {slide.image_url && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                                                )}

                                                {/* Decorative Elements (gradient only) */}
                                                {!slide.image_url && (
                                                    <>
                                                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                                                    </>
                                                )}

                                                <div className="container px-8 lg:px-12 flex items-center justify-between h-full relative z-10 w-full">
                                                    <div className="max-w-2xl py-35">
                                                        {slide.subtitle && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2, duration: 0.5 }}
                                                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white mb-6"
                                                            >
                                                                <Sparkles className="w-3 h-3" />
                                                                {slide.subtitle}
                                                            </motion.div>
                                                        )}

                                                        <motion.h2
                                                            initial={{ opacity: 0, y: 15 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3, duration: 0.6 }}
                                                            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
                                                        >
                                                            {slide.title}
                                                        </motion.h2>

                                                        {slide.description && (
                                                            <motion.p
                                                                initial={{ opacity: 0, y: 15 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.4, duration: 0.6 }}
                                                                className="text-lg text-white/90 mb-8 max-w-lg font-medium leading-relaxed"
                                                            >
                                                                {slide.description}
                                                            </motion.p>
                                                        )}

                                                        {slide.button_enabled && slide.button_text && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                whileInView={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.5 }}
                                                            >
                                                                <Link
                                                                    href={href}
                                                                    className="group/btn hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white border-2 border-white/20 rounded-full pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-lg inline-flex items-center gap-3"
                                                                >
                                                                    <span
                                                                        className="text-sm font-bold font-geist transition-colors duration-300"
                                                                        style={{ color: accentHex }}
                                                                    >
                                                                        {slide.button_text}
                                                                    </span>
                                                                    <ArrowRight
                                                                        className="w-4 h-4 opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300"
                                                                        style={{ color: accentHex }}
                                                                    />
                                                                </Link>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            {heroSlides.length > 1 && (
                                <div className="absolute bottom-6 right-8 flex gap-3">
                                    <CarouselPrevious className="static translate-y-0 bg-white/10 border-0 text-white hover:bg-white/20 h-10 w-10" />
                                    <CarouselNext className="static translate-y-0 bg-white/10 border-0 text-white hover:bg-white/20 h-10 w-10" />
                                </div>
                            )}
                        </Carousel>
                    </motion.div>
                )}

                {/* --- PROMO CARDS (KANAN) --- */}
                {promoCards.length > 0 && (
                    <div className={`${heroSlides.length > 0 ? 'lg:col-span-4' : 'lg:col-span-12'} flex flex-col gap-4 h-full`}>
                        {promoCards.map((card) => {
                            const cardStyles = getPromoCardInlineStyles(card.gradient_from);
                            const href = buildButtonHref(card);

                            const Wrapper = card.button_enabled ? Link : 'div';
                            const wrapperProps = card.button_enabled ? { href } : {};

                            return (
                                <motion.div
                                    key={card.id}
                                    variants={anim.cardRight}
                                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                    className="flex-1 rounded-3xl relative overflow-hidden shadow-sm cursor-pointer group"
                                    style={!card.image_url ? {
                                        backgroundColor: cardStyles.bgHex,
                                        borderColor: cardStyles.borderHex,
                                        borderWidth: '1px',
                                    } : { borderWidth: '1px', borderColor: '#e5e7eb' }}
                                >
                                    <Wrapper {...wrapperProps as any} className="block w-full h-full">
                                        {/* Background Image */}
                                        {card.image_url && (
                                            <img
                                                src={card.image_url}
                                                alt={card.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}

                                        {/* Overlay for image readability */}
                                        {card.image_url && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                        )}

                                        <div className="relative z-10 flex flex-col h-full justify-center items-start p-8">
                                            {card.subtitle && (
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3"
                                                    style={card.image_url
                                                        ? { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff' }
                                                        : { backgroundColor: cardStyles.badgeBgHex, color: cardStyles.accentHex }
                                                    }
                                                >
                                                    <Sparkles className="w-3 h-3" />
                                                    {card.subtitle}
                                                </span>
                                            )}
                                            <h3
                                                className="text-2xl font-black mb-2 transition-colors"
                                                style={{ color: card.image_url ? '#fff' : '#111827' }}
                                            >
                                                {card.title}
                                            </h3>
                                            {card.description && (
                                                <p
                                                    className="text-sm font-medium mb-auto"
                                                    style={{ color: card.image_url ? 'rgba(255,255,255,0.8)' : '#6b7280' }}
                                                >
                                                    {card.description}
                                                </p>
                                            )}
                                            {card.button_enabled && card.button_text && (
                                                <div
                                                    className="mt-4 flex items-center text-sm font-bold group-hover:translate-x-1 transition-transform"
                                                    style={{ color: card.image_url ? '#fff' : cardStyles.accentHex }}
                                                >
                                                    {card.button_text} <ArrowRight className="w-4 h-4 ml-1" />
                                                </div>
                                            )}
                                        </div>
                                    </Wrapper>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </section>
    );
}
