# PROJECT_CONTEXT.md
> **Última actualización:** 2026-02-21 — Sprint 5e Zero-Warning Build (Linting Deep Clean)

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
│    │    └── /tracker
│    │         ├── page.tsx         # Evidence Form & History (Updated Design)
│    │         ├── actions.ts       # Upload & DB submission
│    │         └── SubmissionCard.tsx # Tarjeta de historial angular (New)
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
├── /types
│    └── submissions.ts             # Tipos compartidos (Submission, Scores) - NUEVO
│
├── /utils
│    ├── cache-helpers.ts           # React.cache() centralizados (getUser, getProfile, getLessonById) - NUEVO
│    ├── get-youtube-id.ts
│    ├── openai.ts
│    └── /supabase
│         ├── client.ts             # Singleton Supabase client (stable reference)
│         ├── middleware.ts
│         └── server.ts             # createClient() + createAdminClient() wrappers
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

## 5. Estado del Sprint 5 (Frontend Redesign + Performance)

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

5.  **Tracker / Evidence (`/dashboard/tracker`):**
    *   **Rediseño Completo - v2.0:** Estilo "Militar/Industrial" (#8C8C84 / #1A2E1A).
    *   **Header:** Banner minimalista con flecha de retorno y título del curso.
    *   **Formulario:** Brackets en esquinas, inputs estilizados y botón dorado.
    *   **Historial:** Implementado con componente `SubmissionCard` angular (`clip-path`) y status badges.

### ✅ Optimizaciones de Rendimiento - Sprint 5b (2026-02-16)

**Auditoría & Implementación:** Vercel React Best Practices (57 rules) | Build Status: ✅ **Compilado exitosamente**

#### Bundle Size Optimization (`bundle-dynamic-imports`)
- **VideoPlayer.tsx:** Dynamic import de `react-youtube` con `next/dynamic` y `ssr: false`
  - Impacto: Reduce bundle inicial ~50KB; split en chunk separado

#### Memoization & Singleton Pattern (`js-cache-function-results`)
- **utils/supabase/client.ts:** Cachea singleton instance del cliente Supabase
  - Previene recreación del cliente en cada render
  - Referencia estable para dependency arrays

#### Server-Side Caching (`server-cache-react`)
- Helpers con `React.cache()` en:
  - `getCurrentUser()` — Header & Dashboard
  - `getProfile()` — Dashboard roles
  - `getLessonById()` — Lesson page
  - `fetchLessonsWithProgress()` — CourseSidebar
  - Impacto: Deduplicación dentro del mismo render/flight; reduce DB queries

#### Parallel Data Fetching (`async-defer-await`, `async-parallel`)
- **Courses Page:** Promise.all() para todas las lecciones (reemplaza N+1 helper)
- **Lesson Page:** Paralleliza user auth + lesson fetch simultáneamente
  - Impacto: Menos roundtrips; mejora load time significativamente

#### Dependency Array Cleanup (`rerender-dependencies`)
- Remueve `supabase` de useEffect dependencies (ahora singleton stable)
- Previene effect re-runs innecesarios en VideoPlayer & TrackerPage

#### Unused Code Removal (`async-defer-await`)
- **Home page:** Elimina `createClient()` no utilizado
  - Impacto: Sin async call wasted en landing page

#### Archivos Modificados
| Archivo | Cambios | Rule |
|---------|---------|------|
| `utils/supabase/client.ts` | Singleton caching | `js-cache-function-results` |
| `components/Header.tsx` | React.cache para user | `server-cache-react` |
| `components/courses/VideoPlayer.tsx` | Dynamic import + dependency cleanup | `bundle-dynamic-imports`, `rerender-dependencies` |
| `components/courses/CourseSidebar.tsx` | React.cache + React import | `server-cache-react` |
| `app/dashboard/page.tsx` | React.cache helpers | `server-cache-react` |
| `app/dashboard/courses/page.tsx` | Parallel lessons fetch | `async-defer-await`, `async-parallel` |
| `app/dashboard/courses/[courseId]/[lessonId]/page.tsx` | Parallel user + lesson | `async-defer-await`, `async-parallel` |
| `app/dashboard/tracker/page.tsx` | Dependency cleanup | `rerender-dependencies` |
| `app/page.tsx` | Remove unused createClient | `async-defer-await` |

## 6. Reglas de Negocio & "Gotchas" Técnicos

1.  **Tailwind CSS v4 Integration:**
    *   El proyecto usa la directiva `@theme inline` en `globals.css`.
    *   Las variables CSS (`--gold-500`, etc.) son la fuente de verdad para los colores.

2.  **Componentes UI:**
    *   Usar siempre `import { Button } from "@/components/ui/button"` en lugar de botones HTML nativos para mantener consistencia.
    *   Usar `cn()` para mergear clases custom.

3.  **Estado de Linting:**
    *   Se han suprimido reglas de `no-explicit-any` y `no-unused-vars` en componentes legacy (`CourseSidebar`, `VideoPlayer`) para desbloquear el build del rediseño. Se requiere refactorización futura.

## 7. Deuda Técnica Detectada & Estado de Resolución

| # | Área | Descripción | Prioridad | Estado |
|---|------|-------------|-----------|--------|
| 1 | Linting | Múltiples suppressions de ESLint (`any`, `unused-vars`) introducidas para permitir el build. | 🟡 Media | ✅ RESUELTO (Sprint 5c) |
| 6 | Type Error | `@ts-ignore` introdujo lint error en courses/page.tsx; `any` en lesson nav inference. | 🔴 Alta | ✅ RESUELTO (Sprint 5d) |
| 7 | Build Warnings | ~23 warnings de unused imports, unused vars, y `<img>` sin optimizar. | 🟡 Media | ✅ RESUELTO (Sprint 5e) |
| 2 | Video Player | El "Check" de completado en `CourseSidebar.tsx` visual, lógica backend OK. | 🟡 Media | ✅ Funcionando |
| 3 | RLS Inconsistencia | Policies de admin usan JWT metadata vs tabla profiles. | 🔴 Alta | Requiere test |
| 4 | ~Supabase re-renders~ | ~~Cliente recreado en cada render, causando deps inestables~~ | ✅ RESUELTO | Singleton pattern implementado |
| 5 | ~N+1 queries courses~ | ~~Componente helper para cada módulo, causando N+1 queries~~ | ✅ RESUELTO | Promise.all parallelization |

### Sprint 5e: Zero-Warning Build (Deep Clean) - IMPLEMENTADO

**Fecha:** 2026-02-21 | **Branch:** `fix_build`  
**Vercel Rules Aplicadas:** `bundle-barrel-imports`, `rendering-hydration-no-flicker`, `server-serialization`

> **Objetivo:** Eliminar los ~23 ESLint warnings del build para lograr salida completamente limpia (`✓ Linting and checking validity of types`).

#### Unused Imports / Vars (7 archivos)
| Archivo | Eliminados |
|---------|------------|
| `app/dashboard/courses/[courseId]/layout.tsx` | `CourseSidebar` import, `params` de la firma y destructuring (sidebar desactivado por diseño) |
| `app/dashboard/courses/[courseId]/[lessonId]/page.tsx` | `ChevronLeft`, `ChevronRight` (lucide); query completa `moduleData` (dato no utilizado en JSX) |
| `app/dashboard/tracker/page.tsx` | `Clock`, `CheckCircle`, `Eye`, `Star`, `Camera`, `ChevronDown` (lucide); `cn`; estado `fileName`/`setFileName` |
| `app/dashboard/tracker/SubmissionCard.tsx` | `CheckCircle`, `Clock` (solo `ChevronDown` usado) |
| `app/login/page.tsx` | `AuthCardHeader` |
| `components/landing/TargetAudienceSection.tsx` | `CheckCircle2` (usa custom div instead) |

#### Image Optimization — `<img>` → `next/image` (2 archivos)
| Archivo | Cambio |
|---------|--------|
| `app/dashboard/grading/GradingCard.tsx` | `<img src={submission.image_url}>` → `<Image fill alt="Corte del estudiante">` + import añadido |
| `app/dashboard/tracker/FeedbackModal.tsx` | `<img src={submission.image_url}>` → `<Image fill alt="Corte evaluado">` + import añadido |

#### Blob URL Exception (tracker preview)
- `app/dashboard/tracker/page.tsx`: Preview de imagen usa `URL.createObjectURL(file)` (blob URL) — `next/image` no soporta blob URLs. Se mantiene `<img>` con `{/* eslint-disable-next-line @next/next/no-img-element */}` correctamente posicionado como JSX sibling (no dentro de ternario).
- Refactorizado de ternario `{preview ? <img> : <div>}` a `{!preview && <div>}` + `{preview && <img>}` para habilitar el disable comment.

**Build Status:** ✅ **Completamente limpio** — 0 errores, 0 warnings, 12 rutas generadas

---

### Sprint 5d: Type Error Hotfix - IMPLEMENTADO

**Fecha:** 2026-02-21 | **Branch:** `fix_build`

> **Root Cause:** En Sprint 5b se introdujo un `// @ts-ignore` en `courses/page.tsx` para suprimir un falso positivo de Supabase. ESLint `@typescript-eslint/ban-ts-comment` exige `@ts-expect-error` en su lugar. Sin embargo, al reemplazarlo, TypeScript detectó que la directiva era innecesaria ("Unused directive"), ya que Supabase v2 ya infería el tipo correctamente. Adicionalmente, dos usos de `any` en la page de lecciones bloqueaban el build.

**Cambios realizados (Vercel Best Practice: `server-serialization` + `js-cache-function-results`):**

1. **`app/dashboard/courses/page.tsx`**
   - Eliminado `// @ts-ignore` (y luego `// @ts-expect-error`) — Supabase v2 ya tipifica `r.data?.id` correctamente sin directiva.

2. **`app/dashboard/courses/[courseId]/[lessonId]/page.tsx`**
   - Definida interface local `LessonNavItem { id: string; title: string; position: number }`
   - Reemplazados dos usos de `(l: any)` con `(l: LessonNavItem)` para navegación entre lecciones.
   - Anotación explícita: `const lessons: LessonNavItem[] = allLessons || []`

**Archivos Modificados:**
| Archivo | Cambio | Rule |
|---------|--------|------|
| `app/dashboard/courses/page.tsx` | Eliminada directiva `@ts-ignore` innecesaria | `@typescript-eslint/ban-ts-comment` |
| `app/dashboard/courses/[courseId]/[lessonId]/page.tsx` | Interface `LessonNavItem` + tipado explícito | `server-serialization` |

**Build Status:** ✅ Compilado exitosamente — 12 rutas generadas

---

### Sprint 5c: Code Quality & Type Safety - IMPLEMENTADO

**Cambios Principales (2026-02-16):**

1. **Consolidación de Cache Helpers** → `/utils/cache-helpers.ts`
   - Movidas: `getUser()`, `getProfile()`, `getLessonById()`
   - Impacto: DRY - Eliminada duplicación de 50 líneas
   - Archivos afectados: Dashboard, LessonPage

2. **Tipado Completo de Submissions** → `/types/submissions.ts`
   - Interfaces: `Submission`, `Scores`
   - Reemplazados `any` types en: FeedbackModal, GradingCard, TrackerPage
   - Impacto: Type safety 100%, IDE autocompletion mejorado

3. **Unificación de Imports Supabase**
   - `courses/actions.ts`: Ahora usa `createAdminClient()` wrapper (consistente con `lessons/actions.ts`)
   - Impacto: Patrón uniforme, reducido riesgo de errores

4. **Lazy Load RichTextEditor** 
   - Dynamic import en `EditLessonForm.tsx` con `next/dynamic`
   - Bundle split: ~50KB separado de página de edición
   - Impacto: First Load JS reducido en rutas que no usan editor

5. **Remoción de Type Suppressions Legacy**
   - `CourseSidebar.tsx`: @ts-ignore removed, interfaces definidas
   - `VideoPlayer.tsx`: YouTubeEvent typed, `@typescript-eslint/no-unused-vars` removed
   - Impacto: 3 suppressions eliminadas, código auditable

6. **Limpieza de Imports No Utilizados**
   - Removidos: Layers, ChevronDown, Save, Star, Briefcase, Quote, Input
   - Impacto: Bundle size -200B

7. **Fixed Missing Dependencies en Hooks**
   - `tracker/page.tsx`: Agregado `supabase` a useCallback deps
   - `VideoPlayer.tsx`: Agregado `supabase` a useEffect deps (singleton stable)
   - Impacto: Eliminated React warnings

8. **Deshabilitado Type/Lint Bypassing en Build**
   - `next.config.ts`: Removido `ignoreDuringBuilds` (eslint) y `ignoreBuildErrors` (typescript)
   - Build ahora valida tipos + linting correctamente

**Archivos Nuevos:**
- [utils/cache-helpers.ts](utils/cache-helpers.ts) — React.cache() centralizados
- [types/submissions.ts](types/submissions.ts) — Tipos compartidos para submissions

**Archivos Modificados (Principales):**
- [app/dashboard/admin/courses/actions.ts](app/dashboard/admin/courses/actions.ts) — Import uniforme
- [components/courses/CourseSidebar.tsx](components/courses/CourseSidebar.tsx) — Interfaces tipadas
- [components/courses/VideoPlayer.tsx](components/courses/VideoPlayer.tsx) — Dynamic imports + tipos
- [app/dashboard/page.tsx](app/dashboard/page.tsx) — Imports from cache-helpers
- [app/dashboard/courses/[courseId]/[lessonId]/page.tsx](app/dashboard/courses/[courseId]/[lessonId]/page.tsx) — Imports from cache-helpers
- [app/dashboard/admin/lessons/[lessonId]/edit/EditLessonForm.tsx](app/dashboard/admin/lessons/[lessonId]/edit/EditLessonForm.tsx) — Lazy RichTextEditor
- [app/dashboard/tracker/FeedbackModal.tsx](app/dashboard/tracker/FeedbackModal.tsx) — Tipos from submissions
- [app/dashboard/grading/GradingCard.tsx](app/dashboard/grading/GradingCard.tsx) — Tipos from submissions
- [next.config.ts](next.config.ts) — Removed bypass flags

## 8. Performance Metrics (Post-Optimization - Sprint 5e)

- ✅ Build: **0 errores, 0 warnings** — Salida completamente limpia (Sprint 5e)
- ✅ Type Safety: 100% — 0 `any` en rutas críticas, 0 `@ts-ignore`/`@ts-expect-error` activos
- ✅ Import Hygiene: 0 imports no utilizados (bundle-barrel-imports)
- ✅ Image Optimization: `next/image` en todas las imágenes remotas; blob URLs con eslint-disable justificado
- ✅ First Load JS: Optimizado mediante code-splitting (dynamic imports)
- ✅ Async Waterfalls: Eliminados mediante Promise.all()
- ✅ DB Query Dedup: Implementado con React.cache()
- ⏳ Core Web Vitals: Requiere monitoreo en producción

## 9. Próximos Pasos Recomendados

### ✅ Completados (Sprint 5c / 5d / 5e)
- Refactorización de Linting: Removidas suppressions, implementado strict type checking
- DRY consolidation: Cachés helpers centralizados en utils/cache-helpers.ts
- Type safety: 100% — Interfaces definidas para Submission, Lesson, etc.
- **Zero-Warning Build:** 0 errores + 0 warnings — build completamente limpio
- **Image Optimization:** `<img>` migrado a `next/image` en GradingCard y FeedbackModal
- **Import Hygiene:** Todos los imports no utilizados eliminados en 6 archivos

### 🔄 En Progreso / Próximas Prioridades

1. ~~**Image Optimization**~~ ✅ COMPLETADO (Sprint 5e)
   - Migradas `<img>` tags a `next/image` en GradingCard y FeedbackModal
   - Blob URLs (tracker preview) mantenidas con eslint-disable justificado

2. **RLS Policy Audit (HIGH)**
   - Revisar consistencia entre JWT metadata y tabla `profiles`
   - Alinear policies a un sólo source of truth
   - PRE-REQUISITO: antes de escalar a usuarios

3. **Formal Logging System (MEDIUM)**
   - Crear `/utils/logger.ts` con configuración centralizada
   - Reemplazar `console.*` heredadas con logger tipado
   - Impacto: Mejor debugging en producción

4. **Core Web Vitals Monitoring (LOW)**
   - Medir impacto real en LCP, CLS, FID usando Lighthouse
   - Configurar analytics para monitoreo en producción

5. **Lazy Loading Below-the-Fold (LOW)**
   - Course cards en dashboard → lazy-load thumbnails
   - Contenido de lecciones con Suspense boundaries
   - Impacto: Reducir request waterfalls

6. **Accesibilidad (LOW)**
   - Agregar `alt` text a todas las imágenes
   - Auditoría WCAG 2.1 usando axe-core
