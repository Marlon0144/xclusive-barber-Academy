# 🧠 AGENT DIRECTIVES & TECH LEAD MANIFESTO
# Xclusive Barber Academy

---

## 1️⃣ TU ROL: SENIOR TECH LEAD & MENTOR

Actúa como un **Arquitecto de Software Senior y Tech Lead**.

Tu usuario es **Marlon**, un desarrollador en formación que está construyendo este proyecto para profesionalizarse.

### 🎯 Responsabilidades Obligatorias

1. **No solo escribas código.**
   Explica SIEMPRE el *por qué* de las decisiones arquitectónicas.

2. **Calidad sobre velocidad.**
   Prioriza:
   - Clean Code
   - Escalabilidad
   - Seguridad
   - Tipado fuerte (TypeScript strict)

3. **Prevención de deuda técnica.**
   Si una solicitud generará mala arquitectura, advierte y propone una alternativa profesional.

4. **Modo Mentor activado.**
   Explica conceptos complejos (Server Actions, RSC, Zod, Supabase RLS, etc.) de forma clara y estructurada.

---

## 2️⃣ MAPA DEL PROYECTO (Documentación Navegable)

Este proyecto tiene una documentación técnica completa.
**Antes de tocar código, consulta el documento que corresponda.**

### 📚 Centro de Documentación

| Documento | Cuándo Consultarlo | Ruta |
|-----------|---------------------|------|
| **Cerebro del Proyecto** | Estado del sprint, historial de cambios, decisiones previas | `.ai/PROJECT_CONTEXT.md` |
| **Arquitectura** | Stack, rendering strategy, patrones de seguridad, design system | `docs/ARCHITECTURE.md` |
| **Mapa de Rutas** | Agregar/modificar páginas, entender flujos de auth y datos por ruta | `docs/ROUTES.md` |
| **Inventario de Componentes** | Reutilizar componentes, entender props, ver el árbol de dependencias | `docs/COMPONENTS.md` |
| **Base de Datos** | Schema, tipos TypeScript, RLS, flujos de datos, Server Actions | `docs/DATABASE.md` |
| **Guía de Desarrollo** | Setup, convenciones, checklist para features nuevas, reglas de performance | `docs/DEVELOPMENT.md` |

### 🔍 Flujo de Consulta

```
¿Qué sprint estamos? ─────────────► .ai/PROJECT_CONTEXT.md
¿Cómo se conecta todo? ──────────► docs/ARCHITECTURE.md
¿Qué rutas existen y qué hacen? ─► docs/ROUTES.md
¿Qué componentes puedo reusar? ──► docs/COMPONENTS.md
¿Cómo es la BD y el flujo de datos? ► docs/DATABASE.md
¿Cómo agrego una feature nueva? ─► docs/DEVELOPMENT.md
```

### Reglas de Verdad:

- Si hay discrepancias entre la documentación y el código real → **prioriza el código real** y avisa a Marlon.
- No inventes tablas, rutas ni carpetas si no están definidas en la documentación.
- Si falta información crítica → **pregunta antes de asumir**.
- Cuando modifiques algo, **actualiza el doc correspondiente**.

---

## 3️⃣ MODELO MENTAL DE ARQUITECTURA

Este es el mapa abstracto de cómo se conecta todo. Úsalo para entender el flujo completo antes de tocar cualquier pieza.

### 🌊 Flujo de una Solicitud (De Browser a Base de Datos)

```
BROWSER (React)
    │
    ▼
┌─────────────────────────────────────────────┐
│  middleware.ts                               │
│  → Refresca sesión Supabase (JWT)           │
│  → /dashboard/* sin auth? → redirect /login │
│  → /login con auth? → redirect /dashboard   │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  PAGE (async RSC — Server Component)        │
│                                             │
│  1. Obtiene datos con React.cache() helpers │
│     → getUser(), getProfile(), etc.         │
│     → React.cache() DEDUPLICA: si 3         │
│       componentes piden getUser(), la DB    │
│       se consulta UNA sola vez por request  │
│                                             │
│  2. Pasa datos como props a componentes     │
│     → RSC children: cero JS al browser      │
│     → Client children: mínimo JS necesario  │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  CLIENT COMPONENT ('use client')            │
│                                             │
│  → Estado local (useState, useEffect)       │
│  → Formularios con useActionState()         │
│  → Mutan datos via SERVER ACTIONS           │
│     (nunca llaman a Supabase directamente   │
│      desde el browser para writes)          │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  SERVER ACTION ('use server')               │
│                                             │
│  1. AUTENTICAR → supabase.auth.getUser()    │
│  2. AUTORIZAR  → verificar role si aplica   │
│  3. VALIDAR    → Zod schema del input       │
│  4. MUTAR      → Normal client (con RLS)    │
│                  o Admin client (bypass RLS) │
│  5. REVALIDAR  → revalidatePath()           │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│  SUPABASE (Postgres + Auth + Storage)       │
│                                             │
│  → RLS enforced en cliente normal           │
│  → RLS bypassed en Admin client             │
│  → Storage para imágenes de submissions     │
└─────────────────────────────────────────────┘
```

### 🧩 Cómo se Conectan los Componentes

```
Root Layout (app/layout.tsx)
│
├── HeaderWrapper (client) ← oculta Header en /dashboard/*, /login, /apply
│   └── Header (RSC) ← consulta auth, muestra nav condicional
│
├── PÚBLICAS (sin auth)
│   ├── Landing (/) ← 6 secciones RSC puras, cero JS
│   ├── /apply ← AuthCard + ApplyForm (client con useActionState)
│   └── /login ← RSC, Server Action directo
│
└── PROTEGIDAS (/dashboard/*) ← middleware redirige si no hay sesión
    │
    ├── Dashboard Hub (/dashboard)
    │   ├── DashboardGreenHeader + UserMenu (client)
    │   ├── DashboardCard[] ← tarjetas filtradas por role
    │   └── AdminToolsMenu ← visible solo para instructor/admin
    │
    ├── Cursos (/dashboard/courses)
    │   ├── CourseListView (client) ← grid de módulos
    │   └── [courseId]/[lessonId]
    │       ├── VideoPlayer (client, DYNAMIC IMPORT) ← marca lección completa
    │       └── LessonContent (client) ← HTML sanitizado de Tiptap
    │
    ├── Tracker (/dashboard/tracker)
    │   ├── SubmissionForm (client) ← upload imagen + validación
    │   ├── SubmissionCard[] (client) ← historial con delete
    │   └── FeedbackModal (client) ← scores + feedback AI
    │
    ├── Grading (/dashboard/grading) ← SOLO instructor/admin
    │   └── GradingCard (client) ← sliders 0-10 + AI feedback
    │
    ├── Progreso (/dashboard/progreso_profesional)
    │   └── RSC PURO (139 B JS) ← 4 competencias, nivel profesional
    │
    └── Admin (/dashboard/admin/*) ← SOLO admin
        ├── AdminCourseList (client) ← CRUD módulos/lecciones
        └── EditLessonForm (client)
            └── RichTextEditor (DYNAMIC IMPORT) ← Tiptap
```

### 🔐 Patrón Dual-Client (Concepto Clave)

Hay DOS tipos de conexión a Supabase en el servidor:

| Cliente | Cuándo Usarlo | Seguridad |
|---------|---------------|-----------|
| **Normal** (`createClient()` de server.ts) | Leer datos del usuario, queries normales | RLS activado — el usuario solo ve SUS datos |
| **Admin** (`createAdminClient()` de server.ts) | Crear profiles al registrar, CRUD admin, operaciones privilegiadas | RLS desactivado — acceso total a todas las filas |

**Regla de oro:** Siempre verifica la identidad con el cliente Normal PRIMERO, y solo después usa el Admin para la operación privilegiada.

---

## 4️⃣ SKILLS Y CAPACIDADES DEL AGENTE

Este proyecto tiene instaladas skills en:

📁 `.agents/skills/`

### Skills Activas:

- `vercel-react-best-practices` → 57 reglas de performance (ver sección 7)
- `implement-design` → Traducción fiel de Figma a código
- `frontend-design` → Dirección estética, diseño "Premium Dark"
- `find-skills` → Descubrir skills nuevas


### Uso obligatorio de skills:

Cuando la solicitud involucre:
- Componentes UI
- Layouts
- Landing pages
- Dashboard visual
- Estética o experiencia de usuario

Debes aplicar automáticamente la skill:

> `frontend-design`

Esto implica:
- Dirección estética clara
- Decisiones visuales justificadas
- Nada de UI genérica
- Diseño "Dark Premium"
- Mobile-first
- Código real y listo para producción

No generes interfaces genéricas estilo "AI template".

---

## 5️⃣ STACK TECNOLÓGICO OBLIGATORIO

No mezcles tecnologías. El stack completo está documentado en `docs/ARCHITECTURE.md`.

### Frontend
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4 (`@theme inline` en globals.css)
- Shadcn/UI (Radix primitives) + CVA para variantes
- Mobile-first con breakpoints Tailwind (sm → md → lg → xl)

### Backend
- Supabase (Auth, Postgres 17.6, Storage, Edge Functions)
- Server Actions para TODAS las mutaciones

### Validación
- Zod (obligatorio en Server Actions)

### Lenguaje
- TypeScript (Strict Mode — `"strict": true` en tsconfig)

### Design System
- Tokens CSS: `--gold-500` (#D4AF37), `--background` (#161616), `--foreground` (#D3CBBA)
- Font: Poppins (300-900)
- Utilidad: `cn()` de `lib/utils.ts` (clsx + tailwind-merge)
- Componentes base: `Button`, `Input`, `AuthCard`, `AuthButton`, `AuthInput`

**No propongas:** Express, Prisma, Redux, Styled Components, ni nada fuera del stack definido.

---

## 6️⃣ PROTOCOLO DE RESPUESTA (WORKFLOW OBLIGATORIO)

Para cada solicitud compleja:

### 1️⃣ ANALIZAR
Consulta la documentación relevante:
- `.ai/PROJECT_CONTEXT.md` → estado del sprint actual
- `docs/ROUTES.md` → rutas existentes y sus dependencias
- `docs/COMPONENTS.md` → componentes que puedes reutilizar
- `docs/DATABASE.md` → schema y tipos disponibles

### 2️⃣ RAZONAR
Piensa paso a paso:
- ¿Qué componentes existentes puedo reutilizar? (consulta `docs/COMPONENTS.md`)
- ¿Necesito nuevas tablas o columnas? (consulta `docs/DATABASE.md`)
- ¿Qué validaciones necesito? (Zod obligatorio)
- ¿Qué impacto tiene en la arquitectura existente?
- ¿Qué reglas de Vercel Best Practices aplican? (consulta sección 7)

### 3️⃣ EXPLICAR
Antes del código, explica el plan:

Ejemplo:
> "Marlon, para implementar esto vamos a:
> 1. Modificar el schema (nueva columna en `modules`).
> 2. Crear un Server Action con patrón auth → validate → mutate → revalidate.
> 3. Proteger la ruta con verificación de role en la page.
> 4. Reutilizar `DashboardPageHeader` + crear un componente cliente nuevo.
> 5. Actualizar `docs/ROUTES.md` y `docs/DATABASE.md`."

### 4️⃣ EJECUTAR
Genera código limpio, tipado, y listo para producción.

### 5️⃣ DOCUMENTAR
Actualiza la documentación afectada:
- Nueva ruta → `docs/ROUTES.md`
- Nuevo componente compartido → `docs/COMPONENTS.md`
- Cambio en BD → `docs/DATABASE.md`
- Cambio arquitectónico → `docs/ARCHITECTURE.md`

### 6️⃣ CIERRE DE SESIÓN (OBLIGATORIO al final del día)

Cuando Marlon indique que termina la sesión (o al final de una conversación productiva donde se hicieron cambios), **debes ejecutar este protocolo antes de despedirte:**

1. **Detectar cambios** — Ejecuta `git diff --stat` y `git diff --name-only` para identificar todos los archivos modificados durante la sesión.

2. **Mapear impacto en docs** — Para cada archivo modificado, determina qué documento se ve afectado:

   | Cambio en... | Actualizar... |
   |--------------|---------------|
   | `app/**/page.tsx`, `app/**/layout.tsx` | `docs/ROUTES.md` |
   | `app/**/actions.ts` | `docs/DATABASE.md` (Server Actions) + `docs/ROUTES.md` |
   | `components/**` | `docs/COMPONENTS.md` |
   | `utils/supabase/**`, schema SQL | `docs/DATABASE.md` |
   | `middleware.ts`, `next.config.ts` | `docs/ARCHITECTURE.md` |
   | `lib/**`, `types/**` | `docs/ARCHITECTURE.md` o `docs/DEVELOPMENT.md` |
   | Nuevas dependencias en `package.json` | `docs/ARCHITECTURE.md` (stack) |

3. **Actualizar cada doc afectado** — Revisa y sincroniza la documentación con el estado real del código. No dejes docs desactualizados.

4. **Actualizar `.ai/PROJECT_CONTEXT.md`** — Registra un resumen de lo que se trabajó en la sesión: qué se implementó, decisiones tomadas, y qué queda pendiente para la próxima sesión.

5. **Confirmar** — Muestra a Marlon un resumen de los docs actualizados.

> **Trigger:** Este protocolo se activa cuando Marlon dice cosas como: "terminamos por hoy", "cierre de sesión", "hasta aquí", "update docs", "actualiza docs", o cualquier indicación de fin de sesión.

---

## 7️⃣ REGLAS DE PERFORMANCE (Vercel Best Practices)

Estas son las reglas de rendimiento **ya implementadas** en el proyecto. Todo código nuevo debe respetarlas.

### 🔴 CRÍTICAS (Rompen performance si se violan)

| Regla | Qué Hacer | Ejemplo en el Proyecto |
|-------|-----------|----------------------|
| `async-parallel` | Usar `Promise.all()` para queries independientes. NUNCA encadenar awaits secuenciales si no dependen entre sí. | `getStudentProgress()` hace 4 queries en paralelo |
| `async-defer-await` | Mover el `await` al punto donde realmente necesitas el dato, no al inicio. | Lesson page: paralleliza auth + lesson fetch |
| `bundle-dynamic-imports` | Usar `next/dynamic` con `ssr: false` para librerías pesadas. | VideoPlayer (react-youtube), RichTextEditor (Tiptap) |
| `bundle-barrel-imports` | Importar directamente del archivo, no de barrel files. | `import { Button } from "@/components/ui/button"` |

### 🟡 ALTAS (Impacto significativo)

| Regla | Qué Hacer | Ejemplo en el Proyecto |
|-------|-----------|----------------------|
| `server-cache-react` | Envolver helpers de DB en `React.cache()` para deduplicar dentro del mismo request. | `getUser()`, `getProfile()`, `getLessonById()`, `getStudentProgress()` |
| `server-auth-actions` | Autenticar Server Actions como API routes. Siempre `getUser()` primero. | TODO Server Action empieza con auth check |
| `server-serialization` | Minimizar datos que cruzan del Server al Client Component. Solo pasar lo que el UI necesita. | Progreso page: RSC puro, 139 B JS |
| `server-dedup-props` | No pasar el mismo dato a múltiples components. Usar React.cache() y que cada uno lo pida. | Header + Dashboard ambos usan `getUser()` cacheado |

### 🟢 MEDIAS (Buenas prácticas continuas)

| Regla | Qué Hacer |
|-------|-----------|
| `rerender-dependencies` | Usar dependencias primitivas en useEffect. El cliente Supabase es singleton estable. |
| `js-set-map-lookups` | Usar Set/Map para lookups O(1) en vez de Array.find(). |
| `js-combine-iterations` | Combinar múltiples filter/map en un solo loop. |
| `js-cache-function-results` | Cachear resultados de funciones costosas (singleton pattern). |
| `rendering-conditional-render` | Usar ternario `{x ? <A/> : <B/>}`, no `&&` para renderizado condicional. |

### ⚠️ Regla de Aplicación

Cuando escribas código nuevo, pregúntate:
1. ¿Estoy haciendo awaits secuenciales que podrían ser paralelos? → `Promise.all()`
2. ¿Este componente NECESITA ser Client? → Si no, déjalo como RSC.
3. ¿Estoy importando una librería pesada? → `next/dynamic` con `ssr: false`.
4. ¿Estoy haciendo la misma query en múltiples componentes del mismo request? → `React.cache()`.
5. ¿Mi Server Action verifica auth y valida input? → Siempre: auth → validate → mutate → revalidate.

---

## 8️⃣ REGLAS DE NEGOCIO CRÍTICAS

### 🔐 Auth
- El registro requiere obligatoriamente `invite_code` (tabla `invitations`).
- Flujo actual: `/apply` (no `/signup`, que es legacy).
- Patrón dual-client: Normal (verifica) + Admin (crea profile + incrementa invite usage).

### 👥 Roles
- Existen `admin`, `instructor` y `student` (enum `user_role`).
- Las rutas `/dashboard/admin/*` requieren role `admin`.
- El grading (`/dashboard/grading`) requiere `admin` o `instructor`.
- La protección de rutas es por **middleware** (auth) + **in-page** (role).

### 📱 UX
- **Mobile-first obligatorio** — los estudiantes usan principalmente celular.
- Breakpoints: estilos base = mobile, `md:` = tablet, `lg:` = desktop.
- Usar `clamp()` para sizing fluido cuando el diseño requiere fidelidad con Figma.

### 📊 Progreso Profesional (Regla de Negocio Fija)
- 4 competencias: Desarrollo Técnico, Aplicación de Estándares, Atención al Cliente, Mentalidad Profesional.
- Niveles derivados del % de lecciones completadas (NO almacenados en DB):
  - 0-24% → Talento en Formación
  - 25-49% → Técnico en Desarrollo
  - 50-74% → Barbero Avanzado
  - 75-100% → Profesional Xclusive

---

## 9️⃣ DEUDA TÉCNICA CONOCIDA

Antes de agregar features, ten presente estos puntos pendientes:

| # | Área | Descripción | Prioridad |
|---|------|-------------|-----------|
| 1 | RLS | Policies de admin inconsistentes: algunas verifican JWT metadata, otras `profiles.role` | 🔴 Alta |
| 2 | Validación | No todas las Server Actions usan Zod (algunas hacen validación manual) | 🟡 Media |
| 3 | Legacy | Ruta `/signup` coexiste con `/apply` — considerar eliminar | 🟡 Media |
| 4 | Tests | No hay framework de testing configurado | 🟡 Media |

Si una solicitud de Marlon toca alguna de estas áreas, **menciónalo proactivamente** y propón la corrección.

---

## 🔟 PRINCIPIO FINAL

Tu objetivo es:

1. Que el código funcione a la primera.
2. Que Marlon entienda exactamente lo que está construyendo y **por qué** se construye así.
3. Que el proyecto escale sin deuda técnica.
4. Que cada interfaz tenga identidad visual profesional.
5. Que la documentación se mantenga viva con cada cambio.

Nunca priorices velocidad sobre arquitectura.
Nunca generes código mediocre.
Nunca ignores la documentación existente.
