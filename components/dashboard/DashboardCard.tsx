import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface DashboardCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href?: string;
    actionText?: string;
    disabled?: boolean;
    isInstructor?: boolean;
    isAdmin?: boolean;
    className?: string;
}

export function DashboardCard({
    title,
    description,
    icon: Icon,
    href,
    actionText = "Ver más",
    disabled = false,
    isInstructor = false,
    isAdmin = false,
    className
}: DashboardCardProps) {
    const cardContent = (
        <>
            <div>
                <div className="flex justify-between items-start mb-4">
                     <div className={cn(
                        "p-3 rounded-lg w-fit transition-colors duration-300",
                        "bg-[#1e3a27]/10 text-[#1e3a27]",
                        !disabled && "group-hover:bg-[#1e3a27] group-hover:text-[#d3cbba]"
                    )}>
                        <Icon size={28} strokeWidth={1.5} />
                    </div>
                    
                    {(isInstructor || isAdmin) && (
                        <span className="px-2 py-1 bg-[#1e3a27] text-[#d3cbba] text-[10px] font-bold uppercase tracking-widest rounded">
                            {isInstructor ? "Instructor" : "Admin"}
                        </span>
                    )}
                </div>
               
                <h3 className="font-sans font-bold text-lg md:text-xl uppercase tracking-wide text-[#1e3a27] mb-2">
                    {title}
                </h3>
                <p className="font-sans text-sm font-light text-[#1e3a27]/80 leading-relaxed">
                    {description}
                </p>
            </div>
            
            {!disabled && (
                <div className="mt-6 flex items-center text-[#1e3a27] text-xs font-bold uppercase tracking-widest gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span>{actionText}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
            )}
            
            {disabled && (
                <div className="mt-6 flex items-center text-[#1e3a27] text-xs font-bold uppercase tracking-widest gap-2 opacity-60">
                   <span>{actionText}</span>
                </div>
            )}
        </>
    );

    const containerClasses = cn(
        "group relative flex flex-col justify-between h-full p-6 rounded-xl",
        "bg-[#d3cbba] backdrop-blur-sm transition-all duration-300 ease-in-out",
        "shadow-md",
        disabled 
            ? "opacity-75 cursor-not-allowed hover:bg-[#d3cbba] hover:shadow-md" 
            : "hover:bg-[#c5bdac] hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        (isInstructor || isAdmin) && "border-[#1e3a27]/20 border-2",
        className
    );

    if (disabled || !href) {
        return (
            <div className={containerClasses}>
                {cardContent}
            </div>
        );
    }

    return (
        <Link href={href} className={containerClasses}>
            {cardContent}
        </Link>
    );
}
