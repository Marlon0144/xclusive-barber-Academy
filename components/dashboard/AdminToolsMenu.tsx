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
                    px-4 h-[44px]
                    bg-[#1e3a27]/30 hover:bg-[#1e3a27]/50
                    border border-[#1e3a27]/50
                    transition-colors duration-200
                    cursor-pointer
                "
            >
                <span className="font-sans font-extrabold text-[11px] uppercase tracking-[0.18em] text-[#d3cbba]">
                    Panel de Gestión
                </span>
                <ChevronDown
                    size={14}
                    strokeWidth={2.5}
                    className={`text-[#d3cbba] transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
                />
            </button>

            {/* ─── Collapsible cards ───────────────────────────────── */}
            <div
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${open ? "max-h-[300px] opacity-100 mt-3" : "max-h-0 opacity-0"}
                `}
            >
                <div className="flex flex-col gap-3">
                    {isInstructor && (
                        <DashboardCard
                            title="Evaluar Estudiantes"
                            description="Revisar entregas, calificar cortes y proporcionar retroalimentación técnica."
                            href="/dashboard/grading"
                        />
                    )}
                    {isAdmin && (
                        <DashboardCard
                            title="Gestión de Cursos"
                            description="Administrar catálogo, editar lecciones y configurar módulos de aprendizaje."
                            href="/dashboard/admin/courses"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
