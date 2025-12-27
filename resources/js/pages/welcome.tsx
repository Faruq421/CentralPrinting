import React from 'react';
import { Head, usePage } from '@inertiajs/react';

// Import layout utama
import SiteLayout from '@/layouts/SiteLayout';

// Import semua komponen parsial Anda
import HeroSection from '@/pages/welcome/partials/HeroSection';
import FeaturesSection from '@/pages/welcome/partials/FeaturesSection';
import CategoriesSection from '@/pages/welcome/partials/CategoriesSection';
import CollectionSection from '@/pages/welcome/partials/CollectionSection';

// Definisikan tipe data Product di sini agar sesuai dengan data dari backend
interface Product {
    id_produk: number;
    nama_produk: string;
    slug: string; // Pastikan slug ada di sini
    harga: number;
    gambar: string;
    gambar_url: string;
    category: {
        name: string;
    };
}

// Definisikan tipe data Category
interface Category {
    id: number;
    name: string;
}

// Gunakan tipe Product yang sudah didefinisikan
export default function Welcome() {
    const { products, featuredProducts, categories } = usePage<{
        products: Product[],
        featuredProducts: Product[],
        categories: Category[]
    }>().props;

    return (
        <SiteLayout>
            <Head title="Selamat Datang di Central Printing" />

            {/*
                Render HANYA konten halaman. Header & Footer
                sudah diurus oleh SiteLayout.
            */}
            <div className="bg-gray-50 text-gray-800 font-sans">
                <main>
                    <HeroSection featuredProducts={featuredProducts} />
                    <FeaturesSection />
                    <CategoriesSection categories={categories} />
                    {/* Kirim prop 'products' ke CollectionSection */}
                    <CollectionSection products={products} />
                </main>
            </div>
        </SiteLayout>
    );
}
