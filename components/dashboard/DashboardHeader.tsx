import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
    className?: string;
    userName?: string;
}

export function DashboardHeader({ className, userName }: DashboardHeaderProps) {
    return (
        <div className={cn("relative w-full bg-[#161616] border-b border-[#d3cbba]/10", className)}>
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                src="/assets/dashboard/header-bg.png"
                alt="Dashboard background"
                fill
                className="object-cover opacity-90"
                priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#161616] via-[#161616]/90 to-[#161616]/40" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto p-8 md:p-12 flex flex-col justify-center h-full min-h-[300px]">
                
                {/* Small Tagline */}
                <p className="text-[#d3cbba] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
                    Tu proceso de formación comienza aquí
                </p>

                {/* Main Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white uppercase tracking-tight mb-6">
                    Área <span className="text-[#d3cbba]">Académica</span>
                </h1>

                {/* CSS-only Gold Separator */}
                <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-[#d3cbba] to-transparent mb-6 opacity-80" />

                {/* Description */}
                <p className="max-w-xl text-gray-300 text-sm md:text-base leading-relaxed">
                    Espacio oficial de aprendizaje y gestión académica. Accede a tus cursos, 
                    monitoriza tu progreso y perfecciona tu técnica con las herramientas 
                    exclusivas de Xclusive Barber Academy.
                </p>

                {/* User Greeting (Optional) */}
                {userName && (
                    <div className="mt-8 pt-6 border-t border-[#d3cbba]/20 w-fit">
                        <p className="text-[#d3cbba]/80 text-xs tracking-widest uppercase">
                            Bienvenido, {userName}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
