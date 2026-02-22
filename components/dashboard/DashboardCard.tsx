import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
    dimmed = false,
    className,
}: DashboardCardProps) {

    const inner = (
        <div
            className={cn(
                // Layout — Figma node 2065:14
                'relative flex flex-col items-center justify-center w-full px-4',
                // Appearance
                dimmed ? 'bg-[#d3cbba] opacity-45' : 'bg-[#d3cbba] opacity-60',
                'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
                // Interaction
                disabled
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer transition-opacity duration-200 hover:opacity-80',
                className,
            )}
        >
            {/* Role badge */}
            {(isAdmin || isInstructor) && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#1E3A27] text-[#d3cbba] text-[8px] font-bold uppercase tracking-widest rounded">
                    {isAdmin ? 'Admin' : 'Instructor'}
                </span>
            )}

            {/* Title — Poppins ExtraBold 17px */}
            <h3 style= {{color: '#1E3A27'}} className="font-sans font-extrabold text-[17px] text-[#1E3A27] text-center uppercase leading-tight pt-1" >
                {title}
            </h3>

            {/* Description — Poppins Light 7px */}
            <p className="font-sans font-light text-[10px] text-[#1E3A27] text-center leading-[1.3] mt-1 max-w-[260px] pb-1">
                {description}
            </p>
        </div>
    );

    if (href && !disabled) {
        return (
            <Link href={href} className="block w-full">
                {inner}
            </Link>
        );
    }

    return inner;
}
