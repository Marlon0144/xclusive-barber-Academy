# PROJECT_CONTEXT.md
> **Última actualización:** 2026-02-11 — Frontend Redesign v0.1 (Premium Dark)

## 1. Project Identity
**Nombre:** Xclusive Barber Academy (LMS)
**Fase:** Sprint 5 (Frontend Redesign & Polish)
**Objetivo:** Plataforma educativa de barbería con roles (Estudiante/Instructor/Admin), feedback por IA y diseño "Premium Dark".
**Supabase Project:** `xmyqswwitqlhrzznrscy` | Postgres 17.6 | Region: us-east-2

## 2. Tech Stack (Versiones Verificadas)
* **Framework:** Next.js 15.1.6 (App Router)
* **Lenguaje:** TypeScript
* **React:** 19.0.0-rc (Release Candidate)
* **Styling:** 
  * Tailwind CSS v4 (`@tailwindcss/postcss: ^4`)
  * Lucide React 0.563.x (Iconos)
  * **Design System Utils:** `clsx`, `tailwind-merge`, `cva` (Class Variance Authority)
  * **Fonts:** `Cinzel` (Serif Headers), `Montserrat` (Sans Body)
* **Backend as a Service:** Supabase
  * `@supabase/ssr: ^0.8.0` — Cliente de servidor y navegador (cookies)
  * `@supabase/supabase-js: ^2.91.0` — Cliente Admin (Service Role)
* **AI:** OpenAI API (`openai: ^6.17.0`) — Integración en `utils/openai.ts`
* **Rich Text Editor:** Tiptap (7 paquetes)
* **Video:** `react-youtube: ^10.1.0` (YouTube wrapper)
* **Sanitización:** `isomorphic-dompurify: ^2.35.0`, `jsdom: ^28.0.0`

## 3. Estructura de Carpetas (Verificada)
> Patrón: **Co-located components** — componentes específicos de una ruta viven junto a su `page.tsx`.

```
/
├── /app
│    ├── globals.css                # Configuración Global: Variables CSS, @theme Tailwind v4
│    ├── layout.tsx                 # Root Layout (Fuentes Google Fonts, Metadata)
│    ├── page.tsx                   # Landing Page (Premium Dark Design)
│    ├── favicon.ico
│    │
│    ├── /apply
│    │    └── page.tsx              # Página de Aplicación/Activación (Formulario)
│    │
│    ├── /auth
│    │    └── actions.ts            # Server Actions de Auth
│    │
│    ├── /login
│    │    ├── page.tsx              # Login Page
│    │    └── actions.ts
│    │
│    ├── /signup
│    │    ├── page.tsx              # Signup Page
│    │    └── actions.ts
│    │
│    ├── /dashboard
│    │    ├── page.tsx              # Dashboard Hub
│    │    │
│    │    ├── /admin
│    │    │    ├── /courses ...
│    │    │    └── /lessons ...
│    │    │
│    │    ├── /courses ...
│    │    ├── /grading ...
│    │    └── /tracker ...
│
├── /components                     # Componentes COMPARTIDOS
│    ├── Header.tsx                 # Navegación principal (Actualizado con diseño Gold/Dark)
│    ├── /ui                        # UI Kit Reutilizable (Shadcn-like)
│    │    ├── button.tsx            # Botones con variantes (Default Gold, Outline, Ghost)
│    │    └── input.tsx             # Inputs estilizados
│    │
│    ├── /admin ...
│    └── /courses ...
│
├── /lib
│    └── utils.ts                   # Utility functions: cn() (clsx + tailwind-merge)
│
├── /utils ...
│
├── middleware.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 4. Database Schema (Verificado contra Supabase MCP)

### Enum Personalizado
* **`user_role`**: `'admin'` | `'student'` | `'instructor'`

### Tablas Core
(Sin cambios estructurales recientes en DB - Ver versión anterior para detalles de tablas)
* `profiles`
* `modules`
* `lessons`
* `submissions`
* `lesson_progress`
* `invitations`

### Políticas RLS
(Sin cambios recientes - Ver versión anterior para inventario de policies)

## 5. Estado del Sprint 5 (Frontend Redesign)

### ✅ Funcionalidades Activas & Rediseño - v0.1
1.  **Design System "Premium Dark":**
    *   Paleta de colores: `#D4AF37` (Gold), `#050505` (Background), `#0A1F0A` (Deep Green).
    *   Tipografía: `Cinzel` (Títulos) y `Montserrat` (Cuerpo).
    *   Componentes Base: `Button` y `Input` implementados en `/components/ui`.
    *   Utilidades: `cn()` para manejo de clases condicionales.

2.  **Landing Page (`/app/page.tsx`):**
    *   Secciones implementadas: Hero, Metodología, Features, Misión/Visión, Instructor, CTA.
    *   Diseño responsive con efectos de glassmorphism y texturas.

3.  **Application Page (`/app/apply/page.tsx`):**
    *   Nueva página para "Activar Acceso".
    *   Formulario visualmente alineado con el diseño premium.

4.  **Header:**
    *   Actualizado para usar el nuevo logo (texto + svg) y componentes de UI.

### 🚧 En Progreso / Pendiente de Verificación
*   **Build Verification:** El proceso de build (`npm run build`) se detuvo para revisar integridad.
    *   Se aplicaron parches de linting en `VideoPlayer.tsx` y `CourseSidebar.tsx`.
    *   La verificación final del build limpio está pendiente.

## 6. Reglas de Negocio & "Gotchas" Técnicos

1.  **Tailwind CSS v4 Integration:**
    *   El proyecto usa la directiva `@theme inline` en `globals.css`.
    *   Las variables CSS (`--gold-500`, etc.) son la fuente de verdad para los colores.

2.  **Componentes UI:**
    *   Usar siempre `import { Button } from "@/components/ui/button"` en lugar de botones HTML nativos para mantener consistencia.
    *   Usar `cn()` para mergear clases custom.

3.  **Estado de Linting:**
    *   Se han suprimido reglas de `no-explicit-any` y `no-unused-vars` en componentes legacy (`CourseSidebar`, `VideoPlayer`) para desbloquear el build del rediseño. Se requiere refactorización futura.

## 7. Deuda Técnica Detectada

| # | Área | Descripción | Prioridad |
|---|------|-------------|-----------|
| 1 | Linting | Múltiples suppressions de ESLint (`any`, `unused-vars`) introducidas para permitir el build. | 🟡 Media |
| 2 | Video Player | El "Check" de completado en `CourseSidebar.tsx` visual, lógica backend OK. | 🟡 Media |
| 3 | RLS Inconsistencia | Policies de admin usan JWT metadata vs tabla profiles. | 🔴 Alta |
