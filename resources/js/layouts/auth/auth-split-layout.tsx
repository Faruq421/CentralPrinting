import { welcome } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            {/* Left Side - Form Area */}
            <div className="flex w-full flex-col items-center justify-center bg-[#F8F9FA] px-4 py-12 lg:w-1/2 lg:px-8">
                <div className="w-full max-w-[480px]">
                    <div className="rounded-2xl bg-white px-8 py-10 shadow-xl sm:px-10 border border-gray-100">
                        {/* Header: Logo & Title */}
                        <div className="mb-8 flex flex-col items-center text-center">
                            <Link href={welcome()} className="mb-6 flex items-center justify-center">
                                <div className="flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 p-2">
                                    <img src="/storage/logo/logo.png" alt="Logo" className="h-8 w-auto" />
                                </div>
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
                            <p className="mt-2 text-sm text-gray-500">{description}</p>
                        </div>

                        {/* Form Content */}
                        {children}

                        <div className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
                            By continuing, you agree to Central Printing's <br />
                            <Link href="#" className="underline hover:text-orange-600">Terms of Service</Link> and <Link href="#" className="underline hover:text-orange-600">Privacy Policy</Link>.
                        </div>
                    </div>

                    {/* Mobile Footer branding */}
                    <div className="mt-8 text-center lg:hidden">
                        <span className="text-sm font-semibold text-gray-400">© {new Date().getFullYear()} {name}</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Image Area */}
            <div className="relative hidden w-0 flex-1 lg:block bg-gray-900">
                <img
                    src="/storage/images/printing_tech.png"
                    alt="Printing Factory"
                    className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-gray-900/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
                    <div className="max-w-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="text-xs font-bold uppercase tracking-wider bg-orange-500 px-3 py-1 rounded text-white shadow-lg shadow-orange-500/20">
                                Industry Leader
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight drop-shadow-lg">
                            Solusi Percetakan Modern & Terpercaya.
                        </h2>
                        <p className="text-lg text-gray-200 mb-8 leading-relaxed drop-shadow-md">
                            Bergabunglah dengan ribuan bisnis yang mempercayakan kebutuhan branding mereka kepada Central Printing. Kualitas terbaik, tepat waktu.
                        </p>


                    </div>
                </div>
            </div>
        </div>
    );
}
