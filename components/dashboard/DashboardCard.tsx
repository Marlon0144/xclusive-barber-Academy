'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/i18n/LanguageProvider';

interface DashboardCardProps {
    title: string;
    description: string;
    href?: string;
    disabled?: boolean;
    isInstructor?: boolean;
    isAdmin?: boolean;
    /** First card in Figma is taller: h-[88px] vs h-[80px] */
    tall?: boolean;
    /** "La Academia" style: even lower opacity (opacity-45 in Figma) */
    dimmed?: boolean;
    className?: string;
}

export function DashboardCard({
    title,
    description,
    href,
    disabled = false,
    isInstructor = false,
    isAdmin = false,
    tall = false,
    dimmed = false,
    className,
}: DashboardCardProps) {

    // REQ-FUNC-006: badge de rol localizado vía contexto (este componente corre
    // tanto dentro de la page RSC como del menú admin cliente).
    const { dictionary } = useLanguage()
    const adminMenu = dictionary.dashboard.adminMenu

    const inner = (
        <div
            className={cn(
                // Layout — mobile-first, Tailwind breakpoints for tablet/desktop
                'relative flex flex-col items-center justify-center w-full px-3 py-1.5',
                'md:px-6 md:py-4 lg:py-5',
                // Height — mobile preserves Figma pixel values; h-full lets grid stretch equalize rows
                'h-full',
                tall
                    ? 'min-h-[88px] md:min-h-[100px] lg:min-h-[110px]'
                    : 'min-h-[80px] md:min-h-[90px] lg:min-h-[100px]',
                // Appearance
                dimmed ? 'bg-[#d3cbba] opacity-45' : 'bg-[#d3cbba] opacity-60',
                'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
                'rounded-sm',
                // Interaction
                disabled
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer transition-opacity duration-200 hover:opacity-80',
                className,
            )}
        >
            {/* Role badge */}
            {(isAdmin || isInstructor) && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#1E3A27] text-[#d3cbba] text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded">
                    {isAdmin ? adminMenu.roleBadgeAdmin : adminMenu.roleBadgeInstructor}
                </span>
            )}

            {/* Title — 17px mobile → 24px desktop (controlled via breakpoints, not vw) */}
            <h3
                style={{ color: '#1E3A27' }}
                className="font-sans font-extrabold text-center uppercase leading-tight pt-1
                           text-[17px] md:text-xl lg:text-[22px] xl:text-2xl"
            >
                {title}
            </h3>

            {/* Description — 10px mobile → 14px desktop */}
            <p
                className="font-sans font-light text-[#1E3A27] text-center leading-[1.3] mt-1 pb-1
                           text-[10px] md:text-xs lg:text-[13px] xl:text-sm
                           max-w-[260px] md:max-w-full"
            >
                {description}
            </p>
        </div>
    );

    if (href && !disabled) {
        return (
            <Link href={href} className="block w-full h-full">
                {inner}
            </Link>
        );
    }

    return inner;
}
