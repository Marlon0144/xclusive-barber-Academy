# PROJECT_CONTEXT.md
> **Última actualización:** 2026-04-01 — Landing pricing section (reemplazo CTA final)

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

* `profiles` — `id, role, full_name, created_at`
* `modules` — `id, title, order_index, competency (nullable, CHECK constraint)` ← **Sprint 6**
* `lessons` — `id, module_id, title, content, video_url, order_index`
* `submissions` — `id, student_id, image_url, cut_type, description, status, scores (JSONB), feedback_ai, graded_at, grader_id`
* `lesson_progress` — `user_id, lesson_id, completed (boolean)`
* `invitations` — `invite_code, used`

### Columna Nueva — Sprint 6
```sql
-- modules.competency
ALTER TABLE public.modules
ADD COLUMN IF NOT EXISTS competency TEXT
  CHECK (competency IN (
    'desarrollo_tecnico',
    'aplicacion_estandares',
    'atencion_cliente',
    'mentalidad_profesional'
  ));
```

### Políticas RLS
(Sin cambios recientes - Ver versión anterior para inventario de policies)

## 5. Estado del Sprint 6 (Progreso Profesional — Backend)

### ✅ Landing Pricing Section integrada (2026-04-01)

**Objetivo:** reemplazar el CTA final por una seccion de pricing editable,
manteniendo coherencia visual con la landing Premium Dark y el funnel publico.

#### Cambios de aplicacion
- Nuevo componente compartido:
   `components/landing/PricingSection.tsx`
   - Renderiza 3 cards de cursos/programas desde arreglo de datos tipado
   - Mantiene CTA unificado por card hacia `/qualify`
   - Conserva bloque de contacto (Instagram, logo, WhatsApp)
   - Botones CTA verdes de marca (sin dorado/amarillo)
- Integracion en landing principal:
   - `app/page.tsx` reemplaza `FinalCtaSection` por `PricingSection`

#### Impacto en flujo comercial
- El flujo publico se mantiene sin cambios:
   Landing -> `/qualify` -> WhatsApp -> `/apply` (post compra)
- El nuevo bloque agrega visibilidad de planes/cursos antes del
   paso de calificacion.

#### Documentacion sincronizada
- `docs/ROUTES.md` actualizado para reflejar `PricingSection` en `/`
- `docs/COMPONENTS.md` actualizado con inventario de `PricingSection`

### ✅ CRM Básico V1 Implementado (2026-04-01)

**Objetivo:** Capturar y priorizar leads por etapa CRM + estado comercial.

#### Cambios de base de datos (Supabase MCP)
- Tabla nueva: `crm_leads`
- Tabla nueva: `crm_lead_answers`
- RLS: admin full CRUD para CRM, y lectura del propio lead por `profile_id`

#### Nuevas rutas
- `app/dashboard/qualify/page.tsx` — Wizard post-registro (step 2)
- `app/dashboard/admin/leads/page.tsx` — Panel CRM de revisión admin

#### Nuevas Server Actions
- `submitLeadQualification` (`app/dashboard/qualify/actions.ts`)
   - Zod validation
   - Scoring server-side
   - Upsert `crm_leads` + `crm_lead_answers` (sin columnas de segmento)
- `updateLeadReviewAction` (`app/dashboard/admin/leads/actions.ts`)
   - Admin-only
   - Estado comercial + notas de revisión

#### Flujo actualizado de onboarding
1. `/apply` crea auth user + profile + seed lead (`crm_leads`)
2. Redirección a `/dashboard/qualify`
3. Submit de wizard guarda score y marca completitud
4. `/dashboard` fuerza wizard solo si existe lead incompleto

#### Flujo comercial publico (pre-compra)
1. Landing (`Header` y `Final CTA`) envia a `/qualify`.
2. `/qualify` (publico) guarda respuestas del wizard en CRM por telefono tracked.
3. Al finalizar wizard publico, redirige a WhatsApp de la empresa para cierre comercial.
4. Despues de compra/codigo, el usuario activa cuenta en `/apply` y entra al dashboard.

#### Notas importantes
- No se creó otra DB: todo vive en la misma instancia Supabase.
- Se mantiene el estilo visual Premium Dark y los patrones de layout existentes.
- Deuda técnica vigente: validar consolidación total de reglas RLS y migración
   de validaciones manuales legacy restantes a Zod.

### ✅ Captura pre-lead por telefono iniciada (2026-04-01)

**Objetivo:** capturar interesados desde landing antes del registro,
con un formulario de un solo campo (telefono) y continuidad de navegacion.

#### Cambios de aplicacion
- Nueva Server Action publica: `capturePhoneLead`
   (`app/landing/actions.ts`)
   - Zod validation
   - Normalizacion de telefono (`utils/phone.ts`)
   - Inserta/actualiza `crm_leads` con source
      `landing_phone_capture`
- Nuevo componente cliente:
   `components/landing/PhoneLeadCaptureForm.tsx`
- Nuevo wrapper premium:
   `components/landing/PremiumPhoneCaptureSection.tsx`
- Integracion debajo del mensaje "¿Listo para dar el siguiente paso?":
   `components/landing/TargetAudienceSection.tsx`
- Nuevo gate progresivo de navegacion:
   `components/landing/LandingFlowGate.tsx`
   - Bloquea interaccion de secciones inferiores con blur/overlay
   - Se desbloquea al capturar telefono con evento
      `lead-capture:success`

#### Conversion y merge
- `capturePhoneLead` guarda telefono normalizado en contexto de tracking.
- `/apply` enlaza pre-lead existente por telefono tracked cuando el usuario
   completa registro, evitando lead duplicado.
- El wizard `/dashboard/qualify` elimina la pregunta de telefono y actualiza
   el lead del usuario por `profile_id`.

#### Etapas CRM (admin visibility)
- Etapa 1: Curioso (solo telefono capturado)
- Etapa 2: Interesado (visita `/apply` sin completar calificacion)
- Etapa 3: Muy interesado (calificacion completada / seguimiento activo)
- Etapa 4: Cuenta creada (calificacion completada + cuenta activada con codigo, `profile_id` enlazado)

Cada lead ahora registra fecha de entrada por etapa en columnas dedicadas:
`stage1_entered_at`, `stage2_entered_at`, `stage3_entered_at`,
`stage4_entered_at`.

El panel `admin/leads` ahora muestra la etapa actual y permite filtrar por
etapa para priorizacion comercial.

#### Ajustes de panel admin
- `app/dashboard/admin/leads/page.tsx` ahora es null-safe para
   `full_name` y `email`, soportando pre-leads incompletos.
- Admin leads ahora incluye opcion de borrado por fila:
   - UI: `app/dashboard/admin/leads/page.tsx`
   - Action: `deleteLeadAction` en
      `app/dashboard/admin/leads/actions.ts`

#### Hardening de seguridad (RLS)
- Migration aplicada en Supabase:
   `crm_admin_delete_policies_2026_04_01`
- Archivo local:
   `scripts/2026-04-01-crm-admin-delete-policies.sql`
   - Reafirma DELETE admin-only para `crm_leads` y
      `crm_lead_answers` basado en `profiles.role`.

#### Invitaciones ligadas a lead (gestion_users)
- El formulario de crear codigo en `/dashboard/admin/gestion_users`
   ahora incluye `lead_phone` opcional.
- Si `lead_phone` se deja vacio: se crea codigo general (flujo actual).
- Si `lead_phone` se completa: debe existir un lead en CRM con ese
   telefono; si no existe, se bloquea la generacion con mensaje claro.
- Migracion aplicada: `invitations_lead_link_2026_04_01`
   (columna `invitations.lead_id` nullable FK a `crm_leads`).
- En `/apply`, cuando se usa un codigo con `lead_id`, el merge del lead
   se hace de forma deterministica contra ese registro.

#### Script de migracion pendiente de aplicar
- `scripts/2026-04-01-prelead-phone-capture.sql`
   - `crm_leads.full_name` -> nullable
   - `crm_leads.email` -> nullable
   - unique index parcial para `phone_number`

### ✅ Sprint 6 — Backend Completo (2026-02-21)

**Build Status:** ✅ 0 errores, 0 warnings, 13 rutas — `/dashboard/progreso_profesional` = 139 B (RSC puro)

#### Archivos Nuevos
| Archivo | Propósito |
|---------|-----------|
| `types/progress.ts` | Tipos TypeScript para toda la feature: `CompetencyKey`, `CompetencyProgress`, `ProfessionalLevel`, `StudentProgressData`, `COMPETENCY_LABELS`, `PROFESSIONAL_LEVELS` |
| `app/dashboard/progreso_profesional/actions.ts` | Server Action `fetchProgressPageData()` — auth guard + delega a helper cacheado |
| `app/dashboard/progreso_profesional/page.tsx` | RSC minimal — verifica datos del backend (diseño visual en Sprint 6b con Figma MCP) |

#### Archivos Modificados
| Archivo | Cambio | Regla Vercel |
|---------|--------|--------------|
| `utils/cache-helpers.ts` | `getStudentProgress(userId, email, enrolledAt)` — 4 queries paralelas + 1 loop para todo el cómputo | `async-parallel`, `server-cache-react`, `js-combine-iterations`, `js-set-map-lookups`, `js-index-maps` |
| `app/dashboard/admin/courses/page.tsx` | Agrega `competency` al SELECT de módulos | — |
| `app/dashboard/admin/courses/actions.ts` | Nueva action `updateModuleCompetency(moduleId, competency)` | `server-auth-actions` |
| `app/dashboard/admin/courses/AdminCourseList.tsx` | `Module` type + `competency` + select dropdown para asignar competencia | — |

#### Lógica de Negocio Implementada
- **HU1** Datos del estudiante: nombre (`profiles.full_name`), email (auth), fecha inicio (auth `created_at`), estado (`'Activo'` derivado)
- **HU2** Competencias: 4 competencias derivadas de módulos completados (100% = todos los módulos de esa competencia terminados)
- **HU3** Métricas: progreso general (%), módulos completados (n/total), prácticas enviadas (count submissions)
- **HU4** Nivel profesional: 0–24% Talento → 25–49% Técnico → 50–74% Avanzado → 75–100% Profesional (derivado, sin DB)
- **HU5 (Admin)** Select dropdown en panel admin para asignar competencia a cada módulo

#### Niveles Profesionales (Regla de Negocio Fija)
| Nivel | Rango | Key |
|-------|-------|-----|
| Talento en Formación | 0–24% | `talento` |
| Técnico en Desarrollo | 25–49% | `tecnico` |
| Barbero Avanzado | 50–74% | `avanzado` |
| Profesional Xclusive | 75–100% | `profesional` |

#### Próximo Paso — Sprint 6b
Integrar diseño visual con Figma MCP sobre la page.tsx existente.
El contrato de datos (`StudentProgressData`) está listo y tipado.

---

## 5b. Estado del Sprint 5 (Frontend Redesign & Polish)

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

## 8. Performance Metrics (Post-Optimization - Sprint 6)

- ✅ Build: **0 errores, 0 warnings** — 13 rutas (Sprint 6)
- ✅ `/dashboard/progreso_profesional`: **139 B** First Load JS — RSC puro, cero JS al cliente
- ✅ Type Safety: 100% — `StudentProgressData`, `CompetencyProgress`, `ProfessionalLevel` tipados estrictos
- ✅ Parallel Queries: 4 queries en Promise.all() en `getStudentProgress`
- ✅ Single-pass computation: 1 loop para competencias + módulos + progreso general (`js-combine-iterations`)
- ✅ O(1) lookup: `Set<string>` para lecciones completadas (`js-set-map-lookups`)
- ✅ Import Hygiene: 0 imports no utilizados
- ✅ Image Optimization: `next/image` en todas las imágenes remotas
- ⏳ Core Web Vitals: Requiere monitoreo en producción

## 9. Próximos Pasos Recomendados

### ✅ Completados (Sprint 5c / 5d / 5e / Sprint 6)
- Refactorización de Linting: Removidas suppressions, implementado strict type checking
- DRY consolidation: Cachés helpers centralizados en utils/cache-helpers.ts
- Type safety: 100% — Interfaces definidas para Submission, Lesson, StudentProgressData, etc.
- **Zero-Warning Build:** 0 errores + 0 warnings (ahora 13 rutas)
- **Image Optimization:** `<img>` migrado a `next/image` en GradingCard y FeedbackModal
- **Import Hygiene:** Todos los imports no utilizados eliminados
- **Sprint 6 Backend:** `types/progress.ts`, `getStudentProgress()`, `actions.ts`, `page.tsx` (datos), admin competency assignment

### 🔄 Prioridad Inmediata

1. **Sprint 6b — Diseño Visual Progreso Profesional (ALTA)**
   - Implementar UI con Figma MCP sobre `app/dashboard/progreso_profesional/page.tsx`
   - El contrato de datos `StudentProgressData` ya está listo
   - Diseño: Dark Premium, mobile-first, ver imagen de referencia

2. **Asignar competencias a módulos existentes (ALTA)**
   - Ir a `/dashboard/admin/courses` y asignar una competencia a cada módulo existente
   - Hasta que se haga esto, las competencias mostrarán 0% (datos correctos, sin módulos asignados)

3. **RLS Policy Audit (HIGH)**
4. **Formal Logging System (MEDIUM)**
5. **Core Web Vitals Monitoring (LOW)**
