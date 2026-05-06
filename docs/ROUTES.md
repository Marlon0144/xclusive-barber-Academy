# Route map

This document maps every route in the application, including data
dependencies, auth requirements, rendering strategy, and the
components each page uses. Use it as a reference when adding new
routes or modifying existing ones.

## Route summary

| Route | Auth | Role | Rendering | First Load JS |
|-------|------|------|-----------|---------------|
| `/` | No | Any | RSC | Standard |
| `/apply` | No | Any | RSC + Client | Standard |
| `/login` | No | Any | RSC | Standard |
| `/signup` | No | Any | Client | Standard |
| `/dashboard` | Yes | Any | RSC | Standard |
| `/dashboard/courses` | Yes | Any | RSC | Standard |
| `/dashboard/courses/[courseId]/[lessonId]` | Yes | Any | RSC + Client | Standard |
| `/dashboard/tracker` | Yes | Any | Client | Standard |
| `/dashboard/grading` | Yes | instructor/admin | RSC + Client | Standard |
| `/dashboard/qualify` | Yes | student | RSC + Client | Standard |
| `/dashboard/admin/courses` | Yes | admin | RSC + Client | Standard |
| `/dashboard/admin/gestion_users` | Yes | admin | RSC + Server Actions | Standard |
| `/dashboard/admin/leads` | Yes | admin | RSC + Server Actions | Standard |
| `/dashboard/admin/lessons/[lessonId]/edit` | Yes | admin | RSC + Client | Standard |
| `/dashboard/progreso_profesional` | Yes | Any | RSC | 139 B |

## Public routes

### `/` — Landing page

**File:** `app/page.tsx`
**Rendering:** Async RSC (zero client JS from page itself)
**Auth:** None

**Server Action:** `capturePhoneLead(prevState, formData)`
- Publica (sin auth) y ejecutada en servidor
- Valida telefono con Zod y normaliza formato de contacto
- Crea o actualiza pre-lead en `crm_leads` con
  `source = 'landing_phone_capture'`
- Devuelve feedback no bloqueante para que el usuario continue navegando

**Components used:**
- `HeroSection` — Hero banner principal
- `TargetAudienceSection` — Target audience messaging
- `FeaturesSection` — Three-column methodology
- `MissionVisionSection` — Mission and Vision cards
- `InstructorSection` — Founder introduction
- `PricingSection` — Four-program pricing section
- `FinalCtaSection` — Final CTA (sin bloque de contacto)

**Data flow:**
```
TargetAudienceSection (RSC)
LandingFlowGate (client)
  ├─ Renders floating locked overlay with PhoneLeadCaptureForm
  └─ Keeps lower sections blurred until capture succeeds

PhoneLeadCaptureForm (client)
  └─ useActionState(capturePhoneLead)
       ├─ Validate + normalize phone
       ├─ Upsert pre-lead in crm_leads
       └─ Return { success, error }

LandingFlowGate (client)
  ├─ Unlocks on lead-capture:success event
  └─ Auto-scrolls to Features section anchor
```

**Progressive reveal behavior:**
- Users can read the hero immediately.
- Users can read target audience immediately.
- Sections below target audience stay visible but blurred until phone
  capture succeeds.
- While locked, the floating form appears over the blocked section area.
- After success, the page unlocks and scrolls smoothly to Features.

---

### `/apply` — Student registration

**File:** `app/apply/page.tsx`
**Rendering:** RSC wrapper + Client form
**Auth:** None (public)

**Components used:**
- `AuthCard`, `AuthCardContent` — Form container
- `ApplyForm` (co-located) — Client form component
- `DashboardFooter` — Shared footer

**Server Action:** `applyAccess(prevState, formData)`
- Validates invite code against `invitations` table
- Creates auth user via Supabase Auth
- Creates profile record via Admin client
- Seeds `crm_leads` row linked to the new profile
- Increments invite code usage counter
- Redirects to `/dashboard` after successful account activation

**Data flow:**
```
ApplyForm (client)
  └─ useActionState(applyAccess)
       ├─ Validate invite code (normal client)
       ├─ Create auth user (normal client)
       ├─ Create profile (Admin client)
       ├─ Increment invite usage (Admin client)
       └─ Return { success, error }
```

---

### `/qualify` — Public pre-sales wizard

**File:** `app/qualify/page.tsx`
**Rendering:** RSC wrapper + Client form
**Auth:** None (public)

**Server Action:** `submitPublicLeadQualification(prevState, formData)`
- Validates inputs with Zod
- Accepts optional `selectedPlan` from query (`starter`, `profesional`, `elite`, `business`)
- Requires tracked phone context (`tracked_lead_phone` cookie)
- Upserts `crm_leads` by `phone_number` with `auto_score`,
  `status = contacted`, and completion timestamp
- Upserts `crm_lead_answers` by `lead_id + question_key`
- Redirects to WhatsApp deal chat (`https://wa.me/61413891977`) with prefilled
  message personalized by selected plan (fallback to generic message)

**Business behavior:**
- Landing CTA buttons (`Header` + `PricingSection`) point to this route.
- Pricing plan cards append `?plan=<plan_key>` so the qualification submit carries
  plan context into CRM answers and WhatsApp message.
- This route is the first conversion step before purchase and invite code.

### `/login` — Login page

**File:** `app/login/page.tsx`
**Rendering:** Async RSC
**Auth:** None (redirects to `/dashboard` if already logged in via
middleware)

**Server Action:** `login(formData)`
- Authenticates with `signInWithPassword()`
- On error, redirects to `/login?error=...`
- On success, revalidates and redirects to `/dashboard`

**Error handling:** Error message passed via URL search param,
displayed as red banner.

---

### `/signup` — Signup page (legacy)

**File:** `app/signup/page.tsx`
**Rendering:** Client Component
**Auth:** None

**Server Action:** `signup(prevState, formData)`

> **Note:** This is a legacy route. The `/apply` page is the current
> registration flow with a more polished UI.

---

## Protected routes (require authentication)

All routes under `/dashboard/*` are protected by middleware. An
unauthenticated user is redirected to `/login`.

### `/dashboard` — Dashboard hub

**File:** `app/dashboard/page.tsx`
**Rendering:** Async RSC
**Auth:** Yes (any role)

**Data fetching:**
```typescript
const user = await getUser()         // React.cache()
const profile = await getProfile(user.id) // React.cache()
```

**Components used:**
- `DashboardGreenHeader` — Green header with user menu
- `DashboardHeader` — Hero section with background image
- `DashboardCard` — Navigation cards (4 total)
- `AdminToolsMenu` — Collapsible menu (instructor/admin only)
- `DashboardFooter` — Shared footer

**Role-based rendering:**
- Students see: Courses, Tracker, Progress cards
- Instructors add: Grading option in AdminToolsMenu
- Admins add: Course Management option in AdminToolsMenu

---

### `/dashboard/courses` — Course list

**File:** `app/dashboard/courses/page.tsx`
**Rendering:** Async RSC
**Auth:** Yes (any role)

**Data fetching:**
```typescript
const modules = await supabase.from('modules').select('*').order('order_index')
// Parallel fetch: first lesson ID per module
const firstLessonMap = await Promise.all(
  modules.map(m => supabase.from('lessons')...)
)
```

**Components used:**
- `CourseListView` (Client) — Grid of module cards

**Performance:** `Promise.all()` parallelizes N lesson queries.

---

### `/dashboard/courses/[courseId]/[lessonId]` — Lesson viewer

**File:** `app/dashboard/courses/[courseId]/[lessonId]/page.tsx`
**Layout:** `app/dashboard/courses/[courseId]/layout.tsx`
**Rendering:** Async RSC + Client children
**Auth:** Yes (any role)

**Data fetching:**
```typescript
const [supabase, user, lessonResult] = await Promise.all([...])
// Parallel: auth + lesson data
const allLessons = await supabase.from('lessons').select(...)
```

**Components used:**
- `VideoPlayer` (Client, dynamic import) — YouTube embed, marks
  lesson complete on video end
- `LessonContent` (Client) — Sanitized HTML from Tiptap editor

**Navigation:** Previous/Next lesson links derived from
`allLessons` array index.

---

### `/dashboard/tracker` — Evidence submission

**File:** `app/dashboard/tracker/page.tsx`
**Rendering:** Client Component
**Auth:** Yes (any role)

**Server Actions:**
- `uploadSubmission(formData)` — Validates image (MIME, size,
  extension), uploads to Storage, creates DB record
- `deleteSubmission(submissionId)` — Verifies ownership, deletes
  Storage file + DB record

**Components used (co-located):**
- `SubmissionForm` — Upload form with image preview
- `SubmissionCard` — History card with status badge
- `FeedbackModal` — Inline feedback panel with score bars

**Data flow:**
```
TrackerPage (client)
  ├─ useEffect → fetch submissions history
  ├─ SubmissionForm
  │    └─ uploadSubmission() → Supabase Storage + DB
  └─ SubmissionCard[]
       └─ FeedbackModal (scores + AI feedback)
```

---

### `/dashboard/grading` — Instructor grading panel

**File:** `app/dashboard/grading/page.tsx`
**Rendering:** Async RSC + Client children
**Auth:** Yes (instructor or admin only)

**Role guard (in-page):**
```typescript
if (profile?.role !== 'admin' && profile?.role !== 'instructor') {
  return <AccessDenied />
}
```

**Data fetching:**
```typescript
const submissions = await supabase
  .from('submissions')
  .select('*')
  .eq('status', 'pending')
```

**Server Action:** `submitGrade(submissionId, grades)`
- Verifies instructor role
- Calls OpenAI for AI feedback
- Updates submission with scores, feedback, status, grader info

**Components used:**
- `GradingCard` (Client) — Two-column grading interface with
  sliders (0-10) for fade, cleanliness, technique, symmetry

---

### `/dashboard/qualify` — Lead qualification wizard

**File:** `app/dashboard/qualify/page.tsx`
**Rendering:** Async RSC + Client form
**Auth:** Yes (student only)

**UX pattern:**
- One-question-per-screen wizard (Typeform-like)
- Mobile-first controls with step navigation (back/continue)
- Visible progress bar and step counter

**Pre-lead conversion behavior:**
- Phone capture from landing is linked during `/apply` using tracked
  phone context (cookie), so the wizard no longer asks for phone number.
- On submit, qualification upserts by `profile_id` only, updating the
  same lead row without creating duplicates for the same user profile.

**Guard behavior:**
- Redirects to `/login` when no session
- Redirects to `/dashboard` when role is not `student`
- Redirects to `/dashboard` when `qualification_completed_at` already exists

**Server Action:** `submitLeadQualification(prevState, formData)`
- Validates inputs with Zod
- Computes automatic lead score (`utils/crm-scoring.ts`)
- Upserts `crm_leads` by `profile_id` with `auto_score` and completion timestamp
- Upserts `crm_lead_answers` by `lead_id + question_key`
- Revalidates dashboard/admin leads and redirects to `/dashboard`

---

### `/dashboard/admin/courses` — Admin course management

**File:** `app/dashboard/admin/courses/page.tsx`
**Rendering:** Async RSC + Client children
**Auth:** Yes (admin only)

**Data fetching:**
```typescript
const modules = await supabase.from('modules').select(`
  id, title, order_index, competency,
  lessons(id, title, order_index)
`).order('created_at')
```

**Server Actions:**
- `createModule(title)` — Create new module
- `deleteModule(moduleId)` — Delete module (cascades lessons)
- `updateModuleTitle(moduleId, newTitle)` — Inline title edit
- `updateModuleCompetency(moduleId, competency)` — Assign
  competency to module
- `createLesson(moduleId, title)` — Create lesson in module
- `deleteLesson(lessonId)` — Delete individual lesson
- `updateLessonTitle(lessonId, newTitle)` — Inline title edit
- `reorderLessonsInModule(moduleId, orderedLessonIds)` — Persist
  drag-and-drop lesson order within one module

**Components used (co-located):**
- `AdminCourseList` (Client) — Interactive CRUD UI
- `EditableText` (Client) — Double-click inline editor

**Reordering behavior:**
- Admin can drag lessons to reorder inside the same module
- Cross-module dragging is blocked by design
- On drop, UI updates optimistically and persists new
  `order_index` sequence (1..N)

---

### `/dashboard/admin/gestion_users` — User and invitation management

**File:** `app/dashboard/admin/gestion_users/page.tsx`
**Rendering:** Async RSC + native forms with Server Actions
**Auth:** Yes (admin only)

**Data fetching (parallel):**
```typescript
const [invitationsResult, usersResult, authUsersResult] = await Promise.all([
  supabaseAdmin
    .from('invitations')
    .select('id, code, is_active, used_count, max_uses, role_to_assign'),
  supabaseAdmin
    .from('profiles')
    .select('id, full_name, role, created_at'),
  supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
])
```

**Server Actions:**
- `createInviteCodeAction(formData)` — Generates random invite code
  (`XBA-XXXXXXXX`) with configurable `max_uses` selected by admin.
  Supports optional `lead_phone` input to link invite to a specific lead.
  If phone is provided and no lead exists, invite creation is blocked with
  explicit error feedback.
- `toggleInviteStatusAction(formData)` — Activates/deactivates
  invitation codes
- `deleteInvitationAction(formData)` — Permanently deletes an
  invitation code row
- `updateUserRoleAction(formData)` — Updates `profiles.role`
  with admin authorization guard
- `deleteUserAction(formData)` — Permanently deletes an auth user
  account from Supabase Auth (and cascades profile cleanup)

**Business rules implemented:**
- Invite codes are random and support configurable usage limits
  (`max_uses` between 1 and 50)
- `lead_phone` in create invite form is optional:
  - empty -> general invite code (current behavior)
  - with value -> phone must match an existing CRM lead or code is not created
- Only admins can access the page and actions
- Role update guard prevents removing the last admin account
- User deletion clears `submissions.grader_id` references first to
  avoid FK violations on auth user delete

---

### `/dashboard/admin/leads` — CRM lead review panel

**File:** `app/dashboard/admin/leads/page.tsx`
**Rendering:** Async RSC + native forms with Server Actions
**Auth:** Yes (admin only)

**Data fetching:**
- Reads up to 300 leads from `crm_leads` (desc by `created_at`)
- Supports filter by query text, status, and CRM stage

**Server Action:** `updateLeadReviewAction(formData)`
- Verifies admin role
- Updates `status`
- Persists `review_notes`, `reviewed_by`, and `reviewed_at`

**Server Action:** `deleteLeadAction(formData)`
- Requires admin session
- Deletes a lead row by `leadId`
- Relies on `ON DELETE CASCADE` from `crm_lead_answers` to clean
  dependent answers automatically

**Business behavior:**
- Exposes a compact review workflow directly from each table row
- Shows full questionnaire answers for each lead in an expandable section

**CRM stage behavior in admin table:**
- Etapa 1 (`Curioso`): solo telefono capturado
- Etapa 2 (`Interesado`): visita `/apply` sin completar calificacion
- Etapa 3 (`Muy interesado`): calificacion completada o seguimiento activo
- Etapa 4 (`Cuenta creada`): lead con calificacion completada y cuenta activada (`profile_id` enlazado)

**Stage entry timestamps:**
- El panel muestra `Entrada etapa` usando la fecha de ingreso de la etapa actual.
- Estas fechas se guardan en `crm_leads.stage1_entered_at` ...
  `crm_leads.stage4_entered_at` para trazabilidad comercial.

---

### `/dashboard/admin/lessons/[lessonId]/edit` — Lesson editor

**File:**
`app/dashboard/admin/lessons/[lessonId]/edit/page.tsx`
**Rendering:** Async RSC + Client editor
**Auth:** Yes (admin only)

**Server Action:** `updateLessonContent(lessonId, htmlContent,
videoUrl)`
- Dual-client pattern (verify auth + Admin write)
- Revalidates both course and edit paths

**Components used:**
- `EditLessonForm` (Client) — Two-column layout
  - Left: `RichTextEditor` (Tiptap, dynamic import)
  - Right: YouTube URL input + video preview

**Rich text capabilities:**
- Bold, italic, headings (H1, H2), lists
- Image upload to Supabase Storage
- YouTube video embed
- Link management
- Undo/Redo

---

### `/dashboard/progreso_profesional` — Progress tracker

**File:** `app/dashboard/progreso_profesional/page.tsx`
**Rendering:** Pure RSC (139 B first load JS)
**Auth:** Yes (any role)

**Server Action:** `fetchProgressPageData()`
- Delegates to `getStudentProgress()` (React.cache)
- 4 parallel queries + single computation loop

**Data contract returned:**
```typescript
{
  student: { name, email, enrolledAt, status }
  competencies: CompetencyProgress[]
  metrics: { totalLessons, completedLessons, progressPercentage,
             totalModules, completedModules, submittedPractices }
  currentLevel: ProfessionalLevel
  nextLevel: ProfessionalLevel | null
}
```

**Business logic:**
- 4 competencies derived from module completion
- Professional level: 0-24% Talento, 25-49% Tecnico,
  50-74% Avanzado, 75-100% Profesional

## Middleware behavior

**File:** `middleware.ts` + `utils/supabase/middleware.ts`

**Runs on:** All routes except static assets (`_next/static`,
`_next/image`, `favicon.ico`, image files)

**Logic:**
1. Refresh Supabase auth session (token rotation)
2. If unauthenticated and path starts with `/dashboard` → redirect
   to `/login`
3. If authenticated and path is `/login` or `/signup` → redirect
   to `/dashboard`
4. Otherwise, allow the request through
