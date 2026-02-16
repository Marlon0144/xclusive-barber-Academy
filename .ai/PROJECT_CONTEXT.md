# PROJECT_CONTEXT.md
> **Última actualización:** 2026-02-16 — Sprint 5b Performance Optimization (Vercel React Best Practices)

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
| 1 | Linting | Múltiples suppressions de ESLint (`any`, `unused-vars`) introducidas para permitir el build. | 🟡 Media | Pendiente refactor |
| 2 | Video Player | El "Check" de completado en `CourseSidebar.tsx` visual, lógica backend OK. | 🟡 Media | ✅ Funcionando |
| 3 | RLS Inconsistencia | Policies de admin usan JWT metadata vs tabla profiles. | 🔴 Alta | Requiere test |
| 4 | ~Supabase re-renders~ | ~~Cliente recreado en cada render, causando deps inestables~~ | ✅ RESUELTO | Singleton pattern implementado |
| 5 | ~N+1 queries courses~ | ~~Componente helper para cada módulo, causando N+1 queries~~ | ✅ RESUELTO | Promise.all parallelization |

## 8. Performance Metrics (Post-Optimization)

- ✅ Build: Compilado sin errores
- ✅ First Load JS: Optimizado mediante code-splitting (dynamic imports)
- ✅ Async Waterfalls: Eliminados mediante Promise.all()
- ✅ DB Query Dedup: Implementado con React.cache()
- ⏳ Core Web Vitals: Requiere monitoreo en producción

## 9. Próximos Pasos Recomendados

1. **Testing & Monitoring:**
   - Medir impacto real en Core Web Vitals usando Lighthouse
   - Monitorear performance en producción (si aplica)

2. **Refactorización de Linting:**
   - Remover suppressions de ESLint en legacy components
   - Implementar strict type checking (eliminar `any`)

3. **RLS Policy Audit:**
   - Revisar consistencia entre JWT metadata y tabla `profiles`
   - Alinear policies a un sólo source of truth

4. **Lazy Loading por Below-the-Fold:**
   - Course cards en dashboard podrían lazy-load thumbnails
   - Contenido de lecciones con Suspense boundaries

5. **Image Optimization:**
   - Migrar Figma/external URLs a Next.js `Image` component
   - Implementar responsive images con srcset
