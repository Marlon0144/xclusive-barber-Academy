# Database schema and data flow

This document describes the Supabase Postgres database schema,
Row-Level Security policies, type contracts, and data flow patterns
used throughout the application.

**Supabase Project:** `xmyqswwitqlhrzznrscy`
**Postgres Version:** 17.6
**Region:** us-east-2

## Entity relationship diagram

```
┌──────────────┐      ┌──────────────┐      ┌────────────────┐
│  invitations │      │   profiles   │      │    modules     │
├──────────────┤      ├──────────────┤      ├────────────────┤
│ invite_code  │      │ id (FK→auth) │◄─┐   │ id             │
│ used_count   │      │ role         │  │   │ title          │
│ max_uses     │      │ full_name    │  │   │ order_index    │
│ ...          │      │ created_at   │  │   │ competency     │
└──────────────┘      └──────────────┘  │   └───────┬────────┘
                                        │           │
                                        │           │ 1:N
                                        │           ▼
┌──────────────────┐                    │   ┌────────────────┐
│   submissions    │                    │   │    lessons     │
├──────────────────┤                    │   ├────────────────┤
│ id               │                    │   │ id             │
│ student_id (FK)──┼────────────────────┘   │ module_id (FK) │
│ image_url        │                    ┌──►│ title          │
│ cut_type         │                    │   │ content        │
│ description      │                    │   │ video_url      │
│ status           │                    │   │ order_index    │
│ scores (JSONB)   │                    │   └───────┬────────┘
│ feedback_ai      │                    │           │
│ graded_at        │                    │           │
│ grader_id (FK)───┼───► profiles.id    │           │
│ created_at       │                    │           │
└──────────────────┘                    │           │
                                        │           │
                          ┌─────────────┼───────────┘
                          │             │
                          ▼             │
                  ┌────────────────┐    │
                  │lesson_progress │    │
                  ├────────────────┤    │
                  │ user_id (FK)───┼────┘
                  │ lesson_id (FK) │
                  │ completed      │
                  └────────────────┘
```

## Custom enum

```sql
CREATE TYPE user_role AS ENUM ('admin', 'student', 'instructor');
```

## Tables

### profiles

Stores user metadata and role assignment. Created during
registration via Admin client (bypasses RLS).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, FK → `auth.users.id` | Supabase Auth user ID |
| `role` | `user_role` | NULLABLE, DEFAULT `'student'` | `admin`, `student`, or `instructor` (nullable en el schema real; el código asume default estudiante) |
| `full_name` | `text` | NOT NULL | Display name |
| `email` | `text` | NULLABLE | User email |
| `avatar_url` | `text` | NULLABLE | Profile avatar |
| `created_at` | `timestamptz` | DEFAULT `now()` | Registration timestamp |

**Access patterns:**
- `getProfile(userId)` — Cached helper in `cache-helpers.ts`
- `profiles.role` determines dashboard UI and route access

---

### modules

Course modules that group related lessons. Each module can be
assigned a competency for professional progress tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Module ID |
| `title` | `text` | NOT NULL | Module display name (Spanish) |
| `description` | `text` | NULLABLE | Module description (Spanish); read in `CourseListView` |
| `order_index` | `integer` | NULLABLE, DEFAULT `0` | Sort order (nullable en el schema real) |
| `competency` | `text` | CHECK constraint | Competency category (nullable; pendiente migrar a ENUM nativo `competency_type` — REQ-DATA-002) |
| `created_at` | `timestamptz` | DEFAULT `now()` | Creation timestamp |

> **⚠️ Pending migration (i18n):** `title_en` / `description_en` no
> existen aún en producción (`scripts/2026-11-16-i18n-content-titles.sql`,
> `docs/specs/req009.md` / SRS001). Se movieron fuera de la tabla de
> columnas reales; no referenciarlas en código hasta aplicar la migración.

**Competency CHECK constraint:**
```sql
CHECK (competency IN (
  'desarrollo_tecnico',
  'aplicacion_estandares',
  'atencion_cliente',
  'mentalidad_profesional'
))
```

**Access patterns:**
- Admin CRUD via `admin/courses/actions.ts`
- Read in courses page, progress computation

---

### lessons

Individual lessons within a module. Content is HTML from the Tiptap
rich text editor.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Lesson ID |
| `module_id` | `uuid` | FK → `modules.id` | Parent module |
| `title` | `text` | NOT NULL | Lesson title (Spanish) |
| `description` | `text` | NULLABLE | Lesson description (Spanish); rendered in lesson page |
| `content` | `text` | DEFAULT `''` | HTML content (Tiptap) — NOT translated |
| `video_url` | `text` | DEFAULT `''` | YouTube URL |
| `order_index` | `integer` | NULLABLE, DEFAULT `0` | **Única** columna de ordenamiento (REQ-DATA-001) — la columna duplicada `position` fue eliminada |

> **⚠️ Pending migration (i18n):** `title_en` no existe aún en
> producción (`scripts/2026-11-16-i18n-content-titles.sql`). `content`
> (HTML) está intencionalmente fuera del alcance de traducción (ver
> `docs/specs/srs001.md` §REQ-ML-001).

**Ordenamiento (REQ-DATA-001 resuelto):** la columna `position`
(smallint) era un artefacto sin uso — `grep` sobre `app/ lib/ utils/`
no devuelve referencias. Se eliminó vía migración
`supabase/migrations/20261128_req_data_001_lessons_position.sql`;
`order_index` es la única fuente de verdad (la escribe
`reorderLessonsInModule()` en `admin/courses/actions.ts`).

**Access patterns:**
- `getLessonById(id)` — Cached helper
- Nested select from `modules` with `lessons(...)` syntax
- Admin CRUD + content editing

---

### submissions

Student practice submission photos with instructor grading and AI
feedback.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Submission ID |
| `student_id` | `uuid` | FK → `profiles.id` | Submitting student |
| `image_url` | `text` | NOT NULL | Public URL in Supabase Storage |
| `cut_type` | `text` | NOT NULL | Cut classification |
| `description` | `text` | NOT NULL | Student's notes |
| `status` | `text` | DEFAULT `'pending'` | `pending` or `reviewed` |
| `scores` | `jsonb` | nullable | Grading scores (see below) |
| `feedback_ai` | `text` | nullable | AI-generated feedback |
| `graded_at` | `timestamptz` | nullable | When graded |
| `grader_id` | `uuid` | FK → `profiles.id`, nullable | Instructor who graded |
| `created_at` | `timestamptz` | DEFAULT `now()` | Submission timestamp |

**Scores JSONB structure:**
```json
{
  "fade": 8,
  "cleanliness": 7,
  "technique": 9,
  "symmetry": 6
}
```

**Access patterns:**
- Student creates via `uploadSubmission()`
- Student deletes own via `deleteSubmission()`
- Instructor reads pending via grading page
- Instructor grades via `submitGrade()`

---

### lesson_progress

Tracks which lessons each student has completed.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `uuid` | FK → `profiles.id` | Student ID |
| `lesson_id` | `uuid` | FK → `lessons.id` | Lesson ID |
| `is_completed` | `boolean` | DEFAULT `false` | Completion status |

**Composite key:** (`user_id`, `lesson_id`)

**Access patterns:**
- Upsert on video completion (`VideoPlayer` component)
- Read in `CourseSidebar` for progress display
- Read in `getStudentProgress()` for metrics computation

---

### invitations

Controls student onboarding through invite codes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Invitation row ID |
| `code` | `text` | UNIQUE | Invitation code used in `/apply` and `/signup` |
| `is_active` | `boolean` | DEFAULT `true` | Whether the code can be used |
| `used_count` | `integer` | DEFAULT `0` | Times used |
| `max_uses` | `integer` | NOT NULL | Usage limit |
| `role_to_assign` | `user_role` | NOT NULL | Role assigned on successful signup |
| `lead_id` | `uuid` | nullable, FK -> `crm_leads.id` | Optional direct link to a specific CRM lead |

**Access patterns:**
- Validated during registration (`applyAccess`, `signup`)
- `used_count` incremented via Admin client on successful
  registration
- If `lead_id` is present, account activation links directly to that
  CRM lead (deterministic merge, no cookie dependency)
- Managed by admins from `/dashboard/admin/gestion_users`
  (create random codes with configurable `max_uses`,
  activate/deactivate existing codes, and delete invitation rows)

---

### crm_leads

Stores the lead qualification profile used by the internal CRM workflow.
This table is linked to `profiles` when the lead corresponds to a registered
student.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Lead ID |
| `profile_id` | `uuid` | UNIQUE, FK -> `profiles.id` | Optional link to registered user |
| `full_name` | `text` | nullable | Lead display name (optional at pre-lead stage) |
| `email` | `text` | UNIQUE, nullable | Lead contact email (captured at stage 1) |
| `phone_number` | `text` | nullable | Lead phone |
| `city_suburb` | `text` | nullable | Lead location |
| `auto_score` | `integer` | CHECK `0..100`, DEFAULT `0` | Automatic score from questionnaire |
| `status` | `text` | CHECK (`new`, `contacted`, `qualified`, `lost`, `converted`) | Commercial funnel status |
| `source` | `text` | NOT NULL, DEFAULT `apply_wizard` | Lead acquisition source |
| `reviewed_by` | `uuid` | FK -> `profiles.id`, nullable | Admin reviewer |
| `reviewed_at` | `timestamptz` | nullable | Review timestamp |
| `review_notes` | `text` | nullable | Internal admin notes |
| `qualification_completed_at` | `timestamptz` | nullable | Wizard completion timestamp |
| `stage1_entered_at` | `timestamptz` | nullable | Fecha de entrada a etapa 1 (captura correo y telefono) |
| `stage2_entered_at` | `timestamptz` | nullable | Fecha de entrada a etapa 2 (visita `/apply`) |
| `stage3_entered_at` | `timestamptz` | nullable | Fecha de entrada a etapa 3 (wizard completado) |
| `stage4_entered_at` | `timestamptz` | nullable | Fecha de entrada a etapa 4 (cuenta activada con codigo) |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Last update timestamp |

**Access patterns:**
- Created from `/` landing capture (email + phone pre-lead)
- Linked and enriched from `/apply` registration flow using tracked phone context
- Updated/merged from `/dashboard/qualify` on questionnaire submit
- Reviewed by admins in `/dashboard/admin/leads`

**Pre-lead notes:**
- A pre-lead can start with email and phone (`source = landing_phone_capture`).
- The short application form (`/aplicar`) reuses a lead found by phone/email or inserts one with
  `source = aplicar_form`, `status = new`.
- Visiting `/apply` marks intent with `source = apply_page_visit`
  when tracked pre-lead context exists.
- Full name is completed later when the user progresses through
  registration and qualification.
- The wizard no longer requests phone again; the same lead is updated by
  `profile_id` after registration.
- Apply the migration script in
  `scripts/2026-04-01-prelead-phone-capture.sql` before enabling the feature.

---

### crm_lead_answers

Stores each questionnaire response keyed by lead and question.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Answer row ID |
| `lead_id` | `uuid` | FK -> `crm_leads.id`, ON DELETE CASCADE | Parent lead |
| `question_key` | `text` | UNIQUE with `lead_id` | Stable question identifier |
| `answer_text` | `text` | nullable | Text answer |
| `answer_number` | `numeric` | nullable | Numeric answer |
| `answer_choice` | `text` | nullable | Choice answer |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Creation timestamp |

**Known `question_key` values** (free text, no enum): the wizard's eleven questions and `selected_plan`;
from the short application form (`/aplicar`): `course_interest`, `experience_level`, `how_heard`,
`privacy_consent`, `application_submitted_at`; and lead attribution captured from the visit:
`attr_gclid`, `attr_gbraid`, `attr_wbraid`, `attr_fbclid`, `attr_utm_source`, `attr_utm_medium`,
`attr_utm_campaign`, `attr_utm_term`, `attr_utm_content`, `attr_landing_page`, `attr_referrer`
(see `lib/leads/attribution.ts`; saving them is best-effort and never fails a submission).

**Access patterns:**
- Upserted from qualification action to persist latest questionnaire
- Upserted from `/aplicar` (`submitAcademyApplication`) and, for `attr_*`, from the landing capture
- Read by admin workflows for deeper lead context

## Row-Level Security (RLS)

RLS is enabled on all tables. Policies enforce data isolation
between users.

> **Note:** The current RLS setup uses a combination of JWT metadata
> and `profiles.role` checks. There is a known inconsistency (see
> technical debt) where some admin policies check different sources.

**General pattern:**
- Students can read/write their own data
- Instructors can read student submissions for grading
- Admins have elevated access via Admin client (bypasses RLS)

**CRM policies:**
- `crm_leads`: admin full CRUD, plus owner read (`profile_id = auth.uid()`)
- `crm_lead_answers`: admin full CRUD

**Delete hardening (April 1, 2026):**
- `crm_leads_admin_delete` enforces delete only when
  `profiles.role = 'admin'` for `auth.uid()`.
- `crm_lead_answers_admin_delete` enforces the same admin-only delete rule.
- Migration file: `scripts/2026-04-01-crm-admin-delete-policies.sql`.

## TypeScript type contracts

### Submission types (`types/submissions.ts`)

```typescript
interface Scores {
  fade: number
  cleanliness: number
  technique: number
  symmetry: number
}

interface Submission {
  id: string
  image_url: string
  cut_type: string
  description: string
  status: 'pending' | 'reviewed'
  created_at: string
  scores: Scores | null
  feedback_ai: string | null
}
```

### Progress types (`types/progress.ts`)

```typescript
type CompetencyKey =
  | 'desarrollo_tecnico'
  | 'aplicacion_estandares'
  | 'atencion_cliente'
  | 'mentalidad_profesional'

interface CompetencyProgress {
  key: CompetencyKey
  label: string
  completedLessons: number
  totalLessons: number
  percentage: number
}

type ProfessionalLevelKey =
  | 'talento' | 'tecnico' | 'avanzado' | 'profesional'

interface ProfessionalLevel {
  key: ProfessionalLevelKey
  label: string
  subtitle: string
  minPercentage: number
  maxPercentage: number
}

interface StudentProgressData {
  student: {
    name: string
    email: string
    enrolledAt: string
    status: 'Activo' | 'Inactivo'
  }
  competencies: CompetencyProgress[]
  metrics: {
    totalLessons: number
    completedLessons: number
    progressPercentage: number
    totalModules: number
    completedModules: number
    submittedPractices: number
  }
  currentLevel: ProfessionalLevel
  nextLevel: ProfessionalLevel | null
}
```

### Professional levels (business rule)

| Level | Range | Key |
|-------|-------|-----|
| Talento en Formacion | 0-24% | `talento` |
| Tecnico en Desarrollo | 25-49% | `tecnico` |
| Barbero Avanzado | 50-74% | `avanzado` |
| Profesional Xclusive | 75-100% | `profesional` |

These levels are derived from overall lesson completion percentage.
They are not stored in the database.

## Data flow patterns

### Registration flow

```
Client (ApplyForm)
  │
  ├─ useActionState(applyAccess)
  │
  ▼
Server Action: applyAccess()
  │
  ├─ 1. Validate invite code (normal client → invitations table)
  │     └─ Check: exists, used_count < max_uses
  │
  ├─ 2. Create auth user (normal client → Supabase Auth)
  │     └─ signUp({ email, password })
  │
  ├─ 3. Create profile (Admin client → profiles table)
  │     └─ INSERT { id, role: 'student', full_name }
  │
  └─ 4. Increment invite usage (Admin client → invitations)
        └─ UPDATE used_count = used_count + 1
```

### Submission and grading flow

```
Student                    Instructor                 AI
  │                           │                        │
  ├─ uploadSubmission()       │                        │
  │   ├─ Validate image       │                        │
  │   ├─ Upload to Storage    │                        │
  │   └─ INSERT submission    │                        │
  │       (status: pending)   │                        │
  │                           │                        │
  │                     ├─ Load pending submissions     │
  │                     ├─ Score (fade, clean, tech, sym)
  │                     └─ submitGrade()               │
  │                           │                        │
  │                           ├─ generateAIFeedback()──┤
  │                           │                   ├─ GPT-4o-mini
  │                           │                   └─ Return feedback

### Admin invitation and role management flow

```
Admin user
  │
  ├─ Opens /dashboard/admin/gestion_users (admin-only guard)
  │
  ├─ createInviteCodeAction()
  │   ├─ Verify session + admin role (normal client)
  │   ├─ Generate random code (XBA-XXXXXXXX)
  │   ├─ Validate max_uses range (1..50)
  │   └─ INSERT invitation with selected max_uses (Admin client)
  │
  ├─ toggleInviteStatusAction()
  │   ├─ Verify session + admin role
  │   └─ UPDATE invitations.is_active (Admin client)
  │
  └─ updateUserRoleAction()
      ├─ Verify session + admin role
      ├─ Prevent demoting the last admin
      └─ UPDATE profiles.role (Admin client)

    └─ deleteUserAction()
      ├─ Verify session + admin role
      ├─ Prevent deleting current admin user
      ├─ Prevent deleting the last admin account
      ├─ SET submissions.grader_id = null for target user
      └─ DELETE auth user via Supabase Admin API
```
  │                           │                        │
  │                     └─ UPDATE submission            │
  │                         (scores, feedback_ai,      │
  │                          status: 'reviewed',       │
  │                          grader_id)                │
  │                           │                        │
  └─ View feedback ◄──────────┘                        │
```

### Progress computation flow

```
Server Action: fetchProgressPageData()
  │
  └─ getStudentProgress(userId, email, enrolledAt)
       │
       ├─ Promise.all([
       │    profiles query,
       │    lessons + modules.competency query,
       │    lesson_progress (completed) query,
       │    submissions count query
       │  ])
       │
       ├─ Build Set<completedLessonIds> for O(1) lookup
       │
       ├─ Single loop over all lessons:
       │    ├─ Track module completion
       │    ├─ Track competency completion
       │    └─ Count metrics
       │
       └─ Return StudentProgressData {
            student, competencies, metrics,
            currentLevel, nextLevel
          }
```

## Supabase storage

**Bucket:** `submissions` (public read)

**File path pattern:** `{user_id}/{timestamp}.{extension}`

**Allowed MIME types:**
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`
- `image/heic`
- `image/heif`

**Size limit:** 15 MB

**Lifecycle:** Images are deleted from Storage before the DB record
is removed (prevents orphaned files).

## Server Action inventory

| Action | File | Auth | Role | Description |
|--------|------|------|------|-------------|
| `signout` | `app/auth/actions.ts` | Yes | Any | Destroy session, redirect home |
| `login` | `app/login/actions.ts` | No | — | Authenticate, redirect to dashboard |
| `signup` | `app/signup/actions.ts` | No | — | Register (legacy) |
| `applyAccess` | `app/apply/actions.ts` | No | — | Register (current flow) |
| `uploadSubmission` | `app/dashboard/tracker/actions.ts` | Yes | Any | Upload practice photo |
| `deleteSubmission` | `app/dashboard/tracker/actions.ts` | Yes | Owner | Delete own submission |
| `submitGrade` | `app/dashboard/grading/actions.ts` | Yes | instructor/admin | Grade submission + AI |
| `createModule` | `app/dashboard/admin/courses/actions.ts` | Yes | admin | Create course module |
| `deleteModule` | `app/dashboard/admin/courses/actions.ts` | Yes | admin | Delete module + lessons |
| `updateModuleTitle` | `app/dashboard/admin/courses/actions.ts` | Yes | admin | Edit module title |
| `updateModuleCompetency` | `app/dashboard/admin/courses/actions.ts` | Yes | admin | Assign competency |
| `createLesson` | `app/dashboard/admin/courses/actions.ts` | Yes | admin | Create lesson |
| `deleteLesson` | `app/dashboard/admin/courses/actions.ts` | Yes | admin | Delete lesson |
| `updateLessonTitle` | `app/dashboard/admin/courses/actions.ts` | Yes | admin | Edit lesson title |
| `updateLessonContent` | `app/dashboard/admin/lessons/.../actions.ts` | Yes | admin | Update lesson HTML + video |
| `fetchProgressPageData` | `app/dashboard/progreso_profesional/actions.ts` | Yes | Any | Compute progress data |
| `submitLeadQualification` | `app/dashboard/qualify/actions.ts` | Yes | student | Save answers + auto score |
| `updateLeadReviewAction` | `app/dashboard/admin/leads/actions.ts` | Yes | admin | Manual review and override |
| `setLanguagePreference` | `app/i18n/actions.ts` | No | — | Set `preferred_language` cookie + revalidate layout |

## Lead scoring

Lead scoring runs server-side in `utils/crm-scoring.ts`.

- Input: questionnaire answers from `/dashboard/qualify`
- Output: `auto_score` (0-100) and rationale tags.

Lead prioritization in operations now uses CRM stage and commercial
status instead of segment columns.

## Known technical debt

| # | Area | Description | Priority |
|---|------|-------------|----------|
| 1 | RLS | ~Resuelto (REQ-SEC-001): políticas admin de `modules`/`lessons` unificadas a `profiles.role`. Verificar con advisor que no quede `auth.jwt()` en `public` | High |
| 2 | Types | Some inline types could be extracted to `types/` for reuse | Low |
| 3 | Validation | ~Resuelto (REQ-FUNC-002/003/004): login, gestión de usuarios y grading ahora usan Zod (`lib/validation/`) | Medium |
| 4 | Schema | ~Resuelto (REQ-DATA-001): `position` eliminada; `order_index` es la única columna de ordenamiento | High |
| 5 | i18n | `title_en`/`description_en` columns are specified but not yet migrated (`scripts/2026-11-16-i18n-content-titles.sql` pending) | Medium |
| 6 | i18n | Dashboard interior (`/dashboard`, course viewer, lesson player, tracker, grading, progress, admin) still hardcodes Spanish strings | Medium |

## Internationalization data flow

The i18n subsystem lives entirely client/server side with no DB
dependency except the pending `*_en` content columns. See
`docs/ARCHITECTURE.md` → "Internationalization (i18n)" and
`docs/specs/srs001.md` for the full spec.

```
Request
  │  (cookie `preferred_language` + `accept-language` header)
  ▼
getServerLanguage()  ── lib/i18n/server.ts (React.cache)
  │
  ▼
getServerDictionary() ── returns dictionaries.es | dictionaries.en
  │
  ├── RSC pages: pass strings as props to components
  └── Client components: LanguageProvider → useLanguage()
```

The data flow for module/lesson title localization (pending) will read
`title_en`/`description_en` with a Spanish fallback helper (`pick()`),
defined in `docs/specs/req002.md`.
