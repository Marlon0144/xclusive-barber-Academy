'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Star, AlertCircle } from "lucide-react";
import { useFormState } from "react-dom";
import { applyAccess } from "./actions";

export default function ApplyPage() {
    const [state, formAction] = useFormState(applyAccess, { success: false, error: null })

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#0A1F0A]/90 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1599351431202-6e0005a7837f?q=80&w=1788&auto=format&fit=crop"
                    alt="Barber Background"
                    className="w-full h-full object-cover grayscale opacity-20"
                />
            </div>

            <div className="relative z-20 w-full max-w-md space-y-8">

                {/* Header del Formulario */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="text-gold-500 border border-gold-500 p-3 rounded-full bg-black/50 backdrop-blur-md">
                            <Star className="w-8 h-8 fill-current" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-serif text-gold-500 tracking-widest uppercase">
                        Xclusive<br />Barber<br />Academy
                    </h1>

                    <div className="pt-4">
                        <h2 className="text-3xl font-bold text-white font-serif">ACTIVA TU ACCESO</h2>
                        <h3 className="text-xl text-gold-500 font-serif">A LA ACADEMIA</h3>
                    </div>

                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">
                        Este paso solo se realiza una vez
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-black/40 backdrop-blur-md p-8 border-t border-b border-white/10 space-y-6">
                    <div className="text-center mb-6">
                        <p className="text-zinc-300 text-sm">
                            ¡Ya haces parte de Xclusive Barber Academy!
                        </p>
                        <p className="text-zinc-500 text-xs mt-2">
                            Completa tus datos para acceder por primera vez a la plataforma académica.
                        </p>
                    </div>

                {/* Error Message */}
                {state.error && (
                    <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-sm flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-sm">{state.error}</p>
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Nombre</label>
                        <Input 
                            name="fullName" 
                            placeholder="Tu nombre completo" 
                            className="text-center"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
                        <Input 
                            name="email" 
                            type="email" 
                            placeholder="ejemplo@email.com" 
                            className="text-center"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Código de Acceso</label>
                        <Input 
                            name="inviteCode" 
                            type="text" 
                            placeholder="XXXX-XXXX" 
                            className="text-center uppercase"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Crear Contraseña</label>
                        <Input 
                            name="password" 
                            type="password" 
                            placeholder="Mínimo 6 caracteres" 
                            className="text-center"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <Button 
                            type="submit"
                            disabled={state.success}
                            className="w-full text-lg py-6 font-bold tracking-widest bg-[#ededed] text-black hover:bg-white border-none disabled:opacity-50"
                        >
                            {state.success ? '✓ CUENTA ACTIVADA' : 'ACTIVAR CUENTA'}
                        </Button>
                    </div>
                </form>

                    <div className="text-center pt-4">
                        <p className="text-xs text-zinc-600">
                            ¿Ya activaste tu acceso? <Link href="/login" className="text-gold-500 hover:underline">Continuar tu formación</Link>
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
                    <span>@xclusivebarberau</span>
                    <span>+61 413 891 977</span>
                </div>
                <div className="text-center text-[10px] text-zinc-600 uppercase tracking-widest">
                    Formación profesional para construir una carrera real
                </div>

            </div>
        </div>
    );
}
