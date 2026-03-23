"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

interface AdminToolsMenuProps {
    isInstructor: boolean;
    isAdmin: boolean;
}

export function AdminToolsMenu({ isInstructor, isAdmin }: AdminToolsMenuProps) {
    const [open, setOpen] = useState(false);

    // Only render for privileged roles
    if (!isInstructor && !isAdmin) return null;

    return (
        <div className="w-full">
            {/* ─── Trigger ─────────────────────────────────────────── */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                className="
                    w-full flex items-center justify-between
                    px-4 md:px-6 h-[44px] md:h-[48px] lg:h-[52px]
                    bg-[#1e3a27]/30 hover:bg-[#1e3a27]/50
                    border border-[#1e3a27]/50
                    rounded-sm
                    transition-colors duration-200
                    cursor-pointer
                "
            >
                <span className="font-sans font-extrabold text-[11px] md:text-xs lg:text-sm uppercase tracking-[0.18em] text-[#d3cbba]">
                    Panel de Gestión
                </span>
                <ChevronDown
                    size={14}
                    strokeWidth={2.5}
                    className={`text-[#d3cbba] transition-transform duration-300 md:size-4 lg:size-5 ${open ? "rotate-180" : "rotate-0"}`}
                />
            </button>

            {/* ─── Collapsible cards ───────────────────────────────── */}
            <div
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${open ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"}
                `}
            >
                <div className="flex flex-col md:flex-row gap-3 md:gap-5">
                    {isInstructor && (
                        <DashboardCard
                            title="Evaluar Estudiantes"
                            description="Revisar entregas, calificar cortes y proporcionar retroalimentación técnica."
                            href="/dashboard/grading"
                        />
                    )}
                    {isAdmin && (
                        <>
                            <DashboardCard
                                title="Gestión de Cursos"
                                description="Administrar catálogo, editar lecciones y configurar módulos de aprendizaje."
                                href="/dashboard/admin/courses"
                            />
                            <DashboardCard
                                title="Gestión de Usuarios"
                                description="Crear codigos de acceso de un solo uso y administrar roles de usuarios."
                                href="/dashboard/admin/gestion_users"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
