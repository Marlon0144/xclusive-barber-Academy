# PROJECT_CONTEXT.md
> **Última actualización:** 2026-02-11 — Verificado contra estructura real y schema de Supabase.

## 1. Project Identity
**Nombre:** Xclusive Barber Academy (LMS)
**Fase:** Sprint 4 (Finalizando Admin Panel & Grading System)
**Objetivo:** Plataforma educativa de barbería con roles (Estudiante/Instructor/Admin), feedback por IA y seguimiento de progreso.
**Supabase Project:** `xmyqswwitqlhrzznrscy` | Postgres 17.6 | Region: us-east-2

## 2. Tech Stack (Versiones Verificadas)
* **Framework:** Next.js 15.1.6 (App Router)
* **Lenguaje:** TypeScript
* **React:** 19.0.0-rc (Release Candidate)
* **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss: ^4`) + Lucide React 0.563.x (Iconos)
  * **Nota:** Tailwind v4 NO usa `tailwind.config.js`. La config se define en `globals.css` o vía PostCSS.
* **Backend as a Service:** Supabase
  * `@supabase/ssr: ^0.8.0` — Cliente de servidor y navegador (cookies)
  * `@supabase/supabase-js: ^2.91.0` — Cliente Admin (Service Role)
* **AI:** OpenAI API (`openai: ^6.17.0`) — Integración en `utils/openai.ts`
* **Rich Text Editor:** Tiptap (7 paquetes):
  * `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`
  * `@tiptap/extension-link`, `@tiptap/extension-youtube`
  * `@tiptap/extension-bubble-menu`, `@tiptap/extension-floating-menu`
* **Video:** `react-youtube: ^10.1.0` (YouTube wrapper)
* **Sanitización:** `isomorphic-dompurify: ^2.35.0`, `jsdom: ^28.0.0`

## 3. Estructura de Carpetas (Verificada)
> Patrón: **Co-located components** — componentes específicos de una ruta viven junto a su `page.tsx`.

```
/
├── /app
│    ├── globals.css                # Estilos globales + config Tailwind v4
│    ├── layout.tsx                 # Root Layout
│    ├── page.tsx                   # Landing Page
│    ├── favicon.ico
│    │
│    ├── /auth
│    │    └── actions.ts            # Server Actions de Auth (callback logic)
│    │
│    ├── /login
│    │    ├── page.tsx              # Login Page
│    │    └── actions.ts            # Login Server Actions
│    │
│    ├── /signup
│    │    ├── page.tsx              # Signup Page
│    │    └── actions.ts            # Signup Server Actions
│    │
│    └── /dashboard
│         ├── page.tsx              # Dashboard Hub (Cards condicionales por rol)
│         │
│         ├── /admin
│         │    ├── /courses
│         │    │    ├── page.tsx            # Vista lista de cursos (Admin)
│         │    │    ├── actions.ts          # CRUD Server Actions (módulos, lecciones)
│         │    │    ├── AdminCourseList.tsx  # Componente acordeón con estructura jerárquica
│         │    │    └── EditableText.tsx     # Micro-componente para inline rename
│         │    │
│         │    └── /lessons
│         │         └── /[lessonId]
│         │              └── /edit
│         │                   ├── page.tsx          # Page del editor de lección
│         │                   ├── actions.ts        # Server Actions (save lesson)
│         │                   └── EditLessonForm.tsx # Formulario con RichText + Video URL
│         │
│         ├── /courses
│         │    ├── page.tsx                 # Lista de cursos (vista Estudiante)
│         │    └── /[courseId]
│         │         ├── layout.tsx          # Layout con Sidebar de navegación
│         │         └── /[lessonId]
│         │              └── page.tsx       # Player de lección (Video + Contenido)
│         │
│         ├── /grading
│         │    ├── page.tsx                 # Lista de submissions (vista Instructor)
│         │    ├── actions.ts              # Server Actions (guardar notas, feedback)
│         │    └── GradingCard.tsx          # Tarjeta individual de submission
│         │
│         └── /tracker
│              ├── page.tsx                 # Upload de prácticas (vista Estudiante)
│              ├── actions.ts              # Server Actions (submit práctica)
│              └── FeedbackModal.tsx        # Modal de feedback IA
│
├── /components                     # Componentes COMPARTIDOS (cross-route)
│    ├── Header.tsx                 # Navegación principal + User HUD
│    ├── /admin
│    │    ├── EditorToolbar.tsx     # Toolbar del editor Tiptap
│    │    └── RichTextEditor.tsx    # Wrapper del editor Tiptap
│    └── /courses
│         ├── CourseSidebar.tsx     # Sidebar de navegación del curso
│         ├── LessonContent.tsx    # Renderizado del contenido HTML
│         └── VideoPlayer.tsx      # YouTube wrapper con tracking
│
├── /utils
│    ├── get-youtube-id.ts          # Regex helper para extraer YouTube ID
│    ├── openai.ts                  # Lógica de feedback con IA
│    └── /supabase
│         ├── client.ts            # Browser Client (Anon Key)
│         ├── middleware.ts        # Session update logic
│         └── server.ts            # Factory: createClient (Cookies) & createAdminClient (Service Role)
│
├── middleware.ts                   # Matcher config (protección de rutas)
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

## 4. Database Schema (Verificado contra Supabase MCP)

### Enum Personalizado
* **`user_role`**: `'admin'` | `'student'` | `'instructor'`
  > ⚠️ El rol es **`instructor`**, NO `professor`. Todo el código ya está corregido.

### Tablas Core

**1. `profiles`** — Extensión de `auth.users` (2 rows)
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK, FK → `auth.users.id` |
| `full_name` | text | nullable |
| `email` | text | nullable |
| `role` | user_role | Default `'student'` |
| `avatar_url` | text | nullable |
| `created_at` | timestamptz | |

**2. `modules`** — Estructura de nivel superior del curso (4 rows)
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | Required |
| `description` | text | nullable |
| `order_index` | integer | Default 0 |
| `created_at` | timestamptz | |

**3. `lessons`** — Lecciones dentro de módulos (5 rows)
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `module_id` | uuid | FK → `modules.id` |
| `title` | text | Required |
| `video_url` | text | nullable, ✅ **Existe** |
| `content` | text | nullable, HTML de Tiptap |
| `order_index` | integer | Default 0 |
| `position` | smallint | Default 0 (posiblemente redundante con `order_index`) |

> **Nota:** No existe campo `duration`. No es requerido por ahora.

**4. `submissions`** — Entregas de prácticas (4 rows)
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `student_id` | uuid | FK → `profiles.id` |
| `image_url` | text | Required |
| `cut_type` | text | Required |
| `time_taken` | integer | nullable |
| `status` | submission_status | Enum: `'pending'` / `'reviewed'` |
| `feedback_ai` | text | nullable |
| `scores` | jsonb | nullable, `{fade, technique, ...}` |
| `description` | text | nullable |
| `graded_at` | timestamptz | nullable |
| `grader_id` | uuid | nullable, FK → `auth.users.id` |
| `created_at` | timestamptz | |

**5. `lesson_progress`** — Tracking de progreso (0 rows)
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `auth.users.id` |
| `lesson_id` | uuid | FK → `lessons.id` |
| `is_completed` | boolean | Default `false` |
| `is_verified` | boolean | Default `false` |
| `last_watched_at` | timestamptz | |
| `verified_at` | timestamptz | nullable |
| `verified_by` | uuid | nullable, FK → `auth.users.id` |
| `created_at` | timestamptz | |

> Esta tabla soporta el "Check de completado" en el CourseSidebar.

**6. `invitations`** — Códigos de invitación (3 rows)
| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `code` | text | Unique |
| `is_active` | boolean | Default `true` |
| `used_count` | integer | Default 0 |
| `max_uses` | integer | Default 1 |
| `role_to_assign` | user_role | Default `'student'` |

### Políticas RLS (13 Policies — Inventario Completo)

**`profiles`:**
| Policy | Cmd | Estrategia |
|---|---|---|
| Public profiles | SELECT | `true` (público) |
| Users can insert their own profile | INSERT | `auth.uid() = id` |

**`modules`:**
| Policy | Cmd | Estrategia |
|---|---|---|
| Ver Modulos (Todos) | SELECT | `true` (authenticated) |
| Gestionar Modulos (Admin) | ALL | ⚠️ `app_metadata.role = 'admin'` (JWT) |

**`lessons`:**
| Policy | Cmd | Estrategia |
|---|---|---|
| Ver Lecciones (Todos) | SELECT | `true` (authenticated) |
| Gestionar Lecciones (Admin) | ALL | ⚠️ `app_metadata.role = 'admin'` (JWT) |

**`submissions`:**
| Policy | Cmd | Estrategia |
|---|---|---|
| Estudiantes crean sus practicas | INSERT | `auth.uid() = student_id` |
| Estudiantes ven sus practicas | SELECT | `auth.uid() = student_id` |
| Staff ve todo | SELECT | `student_id match OR profiles.role IN (admin, instructor)` |
| Staff califica todo | UPDATE | `profiles.role IN (admin, instructor)` |

**`lesson_progress`:**
| Policy | Cmd | Estrategia |
|---|---|---|
| Users can view own progress | SELECT | `auth.uid() = user_id` |
| Users can insert own progress | INSERT | `auth.uid() = user_id` |
| Users can update own progress | UPDATE | `auth.uid() = user_id` |

**`invitations`:** RLS habilitado, sin policies visibles (solo accesible vía admin client).

## 5. Estado del Sprint 4

### ✅ Funcionalidades Activas
1.  **Admin CMS:** CRUD completo de estructura con "Inline Edit" (`EditableText.tsx`), acordeón jerárquico (`AdminCourseList.tsx`) y Editor Rico para lecciones (`EditLessonForm.tsx` + Tiptap).
2.  **Tracker:** Subida de imágenes a Supabase Storage + Registro en DB + Modal de feedback IA (`FeedbackModal.tsx`).
3.  **Grading:** Instructores ven todas las entregas (`GradingCard.tsx`), integración IA genera feedback preliminar, guardado de notas manuales.
4.  **Course Player:** Layout con sidebar de navegación (`CourseSidebar.tsx`), video YouTube (`VideoPlayer.tsx`), y contenido HTML renderizado (`LessonContent.tsx`).
5.  **Navegación:** Flujo cerrado sin "dead-ends" (Header con HUD, botones Dashboard/Atrás).

### ✅ Módulos Terminados
* **Auth:** Login, Signup, Callback — flujo completo con Supabase Auth.
* **Landing Page:** Página pública de presentación.

## 6. Reglas de Negocio & "Gotchas" Técnicos

1.  **El "Dilema de los Clientes Supabase":**
    * **SIEMPRE** usar `createClient()` (con cookies) para acciones de usuario (Tracker, ver cursos).
    * **NUNCA** usar `createAdminClient()` (Service Role) para Login o acciones dependientes de sesión.
    * *Excepción:* Usar `createAdminClient()` solo en `actions.ts` de admin para saltar RLS estrictos si es necesario.

2.  **Manejo de Roles:**
    * El enum es `user_role`: `admin` | `student` | `instructor`.
    * **NUNCA** usar `'professor'` — ese valor no existe en la DB.
    * Siempre consultar la tabla `profiles` para verificar `role`.

3.  **Flujo de Videos:**
    * El sistema solo acepta URLs de YouTube.
    * Si `video_url` es null, el Player muestra un "Empty State" elegante, no un error.

4.  **Patrón de Componentes (Co-location):**
    * Componentes **específicos de una ruta** viven junto a su `page.tsx` (e.g., `GradingCard.tsx` en `/grading/`).
    * Componentes **compartidos** entre rutas viven en `/components/` (e.g., `Header.tsx`, `VideoPlayer.tsx`).

5.  **Tailwind CSS v4:**
    * No existe `tailwind.config.js`. La configuración se gestiona vía `globals.css` y PostCSS.

## 7. Deuda Técnica Detectada

| # | Área | Descripción | Prioridad |
|---|------|-------------|-----------|
| 1 | Video Player | El "Check" de completado en `CourseSidebar.tsx` no persiste visualmente al recargar. La tabla `lesson_progress` existe en DB (0 rows) pero puede no estar integrada en el frontend aún. | 🟡 Media |
| 2 | Course Player | Faltan botones "Siguiente / Anterior" en la vista de consumo de lección (`/courses/[courseId]/[lessonId]`). | 🟡 Media |
| 3 | Dashboard Layout | No existe `layout.tsx` en `/dashboard/` — la protección de ruta se delega al `middleware.ts` raíz. Considerar agregar layout para UI compartida. | 🔵 Baja |
| 4 | RLS Inconsistencia | Las policies de `modules` y `lessons` usan `app_metadata` del JWT para verificar admin, mientras que `submissions` consulta la tabla `profiles`. **Riesgo:** Si `app_metadata` no se sincroniza con `profiles.role` al cambiar roles, los permisos de Admin CMS fallarán silenciosamente. **Recomendación:** Migrar todas las policies a usar `profiles` table lookup para consistencia, o asegurar un trigger que sincronice `profiles.role` → `app_metadata` en cada UPDATE. | 🔴 Alta |
| 5 | `lessons.position` vs `order_index` | Ambos campos existen en `lessons`. Parece redundante. Verificar cuál usa el frontend y eliminar el otro. | 🔵 Baja |