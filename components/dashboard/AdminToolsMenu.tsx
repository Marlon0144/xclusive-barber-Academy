"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface AdminToolsMenuProps {
    isInstructor: boolean;
    isAdmin: boolean;
}

export function AdminToolsMenu({ isInstructor, isAdmin }: AdminToolsMenuProps) {
    const [open, setOpen] = useState(false);

    // REQ-FUNC-006: textos del menú admin desde el diccionario tipado.
    const { dictionary } = useLanguage()
    const adminMenu = dictionary.dashboard.adminMenu

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
                    {adminMenu.panel}
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
                            title={adminMenu.gradeStudents.title}
                            description={adminMenu.gradeStudents.description}
                            href="/dashboard/grading"
                        />
                    )}
                    {isAdmin && (
                        <>
                            <DashboardCard
                                title={adminMenu.manageCourses.title}
                                description={adminMenu.manageCourses.description}
                                href="/dashboard/admin/courses"
                            />
                            <DashboardCard
                                title={adminMenu.manageUsers.title}
                                description={adminMenu.manageUsers.description}
                                href="/dashboard/admin/gestion_users"
                            />
                            <DashboardCard
                                title={adminMenu.manageLeads.title}
                                description={adminMenu.manageLeads.description}
                                href="/dashboard/admin/leads"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
