# Component inventory

This document catalogs every component in the project, organized by
domain. Each entry includes the component type, props, rendering
strategy, and relationships with other components.

## Design system primitives (`components/ui/`)

These are the foundational UI building blocks. Always use them
instead of raw HTML elements.

### Button

**File:** `components/ui/button.tsx`
**Type:** Forwardref component
**Pattern:** CVA (Class Variance Authority)

**Props:**
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
             | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean  // Radix Slot pattern
}
```

**Variants:**
| Variant | Style |
|---------|-------|
| `default` | Gold background, black text, gold glow shadow |
| `destructive` | Red background, white text |
| `outline` | Transparent, gold border, gold text |
| `secondary` | Dark surface background |
| `ghost` | Transparent, hover shows surface |
| `link` | Underline on hover, gold text |

**Usage:** `import { Button } from "@/components/ui/button"`

---

### Input

**File:** `components/ui/input.tsx`
**Type:** Forwardref component

**Style:** Minimal border-bottom design. Focus state transitions
border color to `gold-500`.

**Usage:** `import { Input } from "@/components/ui/input"`

---

### AuthButton

**File:** `components/ui/auth-button.tsx`
**Type:** Forwardref component

**Props:**
```typescript
interface AuthButtonProps extends ButtonHTMLAttributes {
  isLoading?: boolean
  disabled?: boolean
}
```

**Style:** Gold gradient (`#D4AF37` → `#F1E5AC`), uppercase text,
widest tracking, spinner when loading.

---

### AuthInput

**File:** `components/ui/auth-input.tsx`
**Type:** Forwardref component

**Props:**
```typescript
interface AuthInputProps extends InputHTMLAttributes {
  label?: string
  error?: string
  id?: string
}
```

**Features:**
- Label positioning above input
- Bottom-border with animated underline on focus
- Red error state with error message below

---

### AuthCard, AuthCardHeader, AuthCardContent

**File:** `components/ui/auth-card.tsx`
**Type:** 3 Forwardref components

**AuthCard:** Dark card container (`bg-[#1A1A1A]`, `border-zinc-800`)
**AuthCardHeader:** Centered header section
**AuthCardContent:** Padded content section

**Composition pattern:**
```tsx
<AuthCard>
  <AuthCardHeader>Title</AuthCardHeader>
  <AuthCardContent>Form fields</AuthCardContent>
</AuthCard>
```

---

## Layout components

### Header

**File:** `components/Header.tsx`
**Type:** Async Server Component
**Used in:** Root layout (via `HeaderWrapper`)

**Behavior:**
- Fetches current user via `getCurrentUser()` (React.cache)
- If unauthenticated: Shows "Acceder" + "Aplicar" links
- If authenticated: Shows "Dashboard" pill + "Salir" form button

**Style:** Two-layer green background, Cinzel-style logo,
responsive sizing with `clamp()`.

---

### HeaderWrapper

**File:** `components/HeaderWrapper.tsx`
**Type:** Client Component
**Used in:** Root layout

**Behavior:** Hides the Header on specific routes:
- `/apply`, `/login`, `/signup`
- Any route starting with `/dashboard`

Uses `usePathname()` hook for route detection.

---

## Dashboard components (`components/dashboard/`)

### DashboardCard

**File:** `components/dashboard/DashboardCard.tsx`
**Type:** Functional component

**Props:**
```typescript
{
  title: string
  description: string
  href?: string       // Navigation target
  disabled?: boolean
  isInstructor?: boolean
  isAdmin?: boolean
  tall?: boolean      // h-[88px] vs h-[80px]
  dimmed?: boolean    // opacity-45 for disabled state
}
```

**Behavior:** Renders as a `Link` if `href` is provided and not
disabled, otherwise renders as a `div`. Shows role badges
(Instructor/Admin) in top-right corner.

---

### DashboardHeader

**File:** `components/dashboard/DashboardHeader.tsx`
**Type:** Functional component

**Renders:** Hero section for dashboard hub. Background image with
text overlay: subtitle, title "Area Academica," gradient divider,
and description.

---

### DashboardFooter

**File:** `components/dashboard/DashboardFooter.tsx`
**Type:** Functional component

**Props:** `{ tagline?: string }`

**Renders:** Shared footer with actionable Instagram and WhatsApp
contact links, centered logo, and optional tagline text.

---

### AdminToolsMenu

**File:** `components/dashboard/AdminToolsMenu.tsx`
**Type:** Client Component

**Props:** `{ isInstructor: boolean, isAdmin: boolean }`

**Behavior:** Collapsible menu toggled by gold-accented button.
Shows "Evaluar Estudiantes" link (for instructors) and "Gestion de
Cursos" + "Gestion de Usuarios" + "Gestion de Leads" links (for
admins).

---

### AdminCourseList

**File:** `app/dashboard/admin/courses/AdminCourseList.tsx`
**Type:** Client Component

**Behavior:**
- CRUD for modules and lessons (create, rename, delete)
- Competency assignment per module
- Drag-and-drop lesson ordering inside each module only

**Data mutation hooks:**
- Uses Server Actions in `app/dashboard/admin/courses/actions.ts`
- Persists reorder via `reorderLessonsInModule(moduleId,
  orderedLessonIds)`

---

## Header variants (`components/headers/`)

### DashboardGreenHeader

**File:** `components/headers/DashboardGreenHeader.tsx`
**Type:** Functional component

**Props:**
```typescript
{
  userName?: string
  userEmail?: string
  showDashboardLink?: boolean
}
```

**Renders:** Green header (responsive `h-[53px]` to `h-[72px]`)
with logo and `UserMenu` dropdown.

---

### DashboardPageHeader

**File:** `components/headers/DashboardPageHeader.tsx`
**Type:** Functional component

**Props:** `{ title: string, bgColor?: string }`

**Renders:** Fixed header (`h-[53px]`) for internal dashboard
pages. Logo on left, "Dashboard" pill + page title on right.

---

### UserMenu

**File:** `components/headers/UserMenu.tsx`
**Type:** Client Component

**Props:** `{ userName?: string, userEmail?: string }`

**Behavior:**
- Click avatar to open/close dropdown
- Outside click closes menu
- Links to: professional progress, sign out

---

## Course components (`components/courses/`)

### VideoPlayer

**File:** `components/courses/VideoPlayer.tsx`
**Type:** Client Component

**Props:** `{ url: string | null, lessonId: string }`

**Behavior:**
- Dynamic import of `react-youtube` (no SSR)
- Extracts YouTube video ID from URL
- Shows spinner while loading
- Marks lesson as complete (`lesson_progress`) when video ends
- Handles invalid or missing URLs gracefully

**Performance:** Bundle-split via `next/dynamic` + `ssr: false`.

---

### LessonContent

**File:** `components/courses/LessonContent.tsx`
**Type:** Client Component

**Props:** `{ content: string | null }`

**Behavior:**
- Renders sanitized HTML from Tiptap editor
- DOMPurify config allows iframes (for YouTube embeds)
- Tailwind prose classes for typography styling

---

### CourseSidebar

**File:** `components/courses/CourseSidebar.tsx`
**Type:** Async Server Component

**Props:** `{ moduleId: string }`

**Behavior:**
- Fetches lessons with progress via `React.cache()` helper
- Shows progress bar (completed/total)
- Lesson list with completion indicators (check or circle)
- Back link to courses index

---

### CourseListView

**File:** `components/dashboard/courses/CourseListView.tsx`
**Type:** Client Component

**Props:**
```typescript
{
  modules: Module[]
  firstLessonMap: Record<string, string | null>
}
```

**Behavior:** Responsive grid of module cards with cycling
background images and status badges.

---

## Landing page sections (`components/landing/`)

All sections are functional components with no props (self-contained
content).

| Component | File | Content |
|-----------|------|---------|
| `HeroSection` | `landing/HeroSection.tsx` | Hero banner and tattoo arm graphic |
| `PhoneLeadCaptureForm` | `landing/PhoneLeadCaptureForm.tsx` | Public email and phone form with country code selector and Server Action submit |
| `LandingFlowGate` | `landing/LandingFlowGate.tsx` | Client-side progressive lock with floating email and phone form and blurred content behind |
| `TargetAudienceSection` | `landing/TargetAudienceSection.tsx` | Green CTA bar + 3 audience bullets |
| `FeaturesSection` | `landing/FeaturesSection.tsx` | Three-column: Mentalidad, Practica, Carrera |
| `MissionVisionSection` | `landing/MissionVisionSection.tsx` | Mission + Vision dark cards |
| `InstructorSection` | `landing/InstructorSection.tsx` | Julian founder bio + photo |
| `PricingSection` | `landing/PricingSection.tsx` | Four-program pricing cards built from internal `PricingPlanGrid` and `PricingPlanCard` subcomponents, with CTA buttons that pass `?plan=` context to `/qualify` |
| `FinalCtaSection` | `landing/FinalCtaSection.tsx` | Final CTA de cierre sin bloque de contacto |

**Design:** All sections follow the "Premium Dark" aesthetic with
gold and dark green accents, mobile-first responsive design, and
Figma-faithful spacing.

---

## Admin components (`components/admin/`)

### RichTextEditor

**File:** `components/admin/RichTextEditor.tsx`
**Type:** Client Component (dynamic import in parent)

**Props:** `{ content: string, onChange: (html: string) => void }`

**Tiptap extensions:**
- StarterKit (bold, italic, lists, blockquote)
- LinkExtension
- ImageExtension (upload to Supabase Storage)
- YoutubeExtension (embed videos)

**Features:** Drag-and-drop image upload, full formatting toolbar.

---

### EditorToolbar

**File:** `components/admin/EditorToolbar.tsx`
**Type:** Client Component

**Props:** `{ editor: Editor | null, addImage: () => void }`

**Buttons:** Bold, Italic, H1, H2, Bullet list, Ordered list,
Image, YouTube, Undo, Redo. Active state highlighting (blue).

---

## Co-located route components

These components live next to their `page.tsx` and are specific to
a single route.

### Tracker route (`app/dashboard/tracker/`)

| Component | Type | Props |
|-----------|------|-------|
| `SubmissionForm` | Client | `{ onSubmitSuccess: () => void }` |
| `SubmissionCard` | Client | `{ submission, index, total, onDelete }` |
| `FeedbackModal` | Client | `{ submission, onClose }` |

### Grading route (`app/dashboard/grading/`)

| Component | Type | Props |
|-----------|------|-------|
| `GradingCard` | Client | `{ submission: Submission }` |

### Admin courses route (`app/dashboard/admin/courses/`)

| Component | Type | Props |
|-----------|------|-------|
| `AdminCourseList` | Client | `{ initialModules: Module[] }` |
| `EditableText` | Client | `{ initialText, onSave, className? }` |

### Admin lesson editor
(`app/dashboard/admin/lessons/[lessonId]/edit/`)

| Component | Type | Props |
|-----------|------|-------|
| `EditLessonForm` | Client | `{ lesson: LessonData }` |

### Apply route (`app/apply/`)

| Component | Type | Props |
|-----------|------|-------|
| `ApplyForm` | Client | None (uses action directly) |

### Public qualification route (`app/qualify/`)

| Component | Type | Props |
|-----------|------|-------|
| `QualifyForm` | Client | None (uses `submitPublicLeadQualification` via `useActionState`; on success reports `academy_apply_submit` and navigates to the returned WhatsApp URL) |

### Analytics components (`components/analytics/`)

Rendered from `app/layout.tsx` unless noted. Behaviour, IDs and the full event
list live in `docs/ANALYTICS_TRACKING_PLAN.md`.

| Component | Type | Notes |
|-----------|------|-------|
| `GoogleAnalyticsScript` | RSC | Loads gtag.js once and configures GA4 (`G-…`) and Google Ads (`AW-…`) |
| `GoogleTagManagerScript` / `GoogleTagManagerNoScript` | RSC | GTM container loader + `<noscript>` fallback |
| `MetaPixelScript` / `MetaPixelNoScript` | RSC | Meta Pixel loader + `<noscript>` fallback |
| `OutboundContactTracker` | Client (renders `null`) | One delegated click listener reporting `academy_whatsapp_click` (`wa.me`) and `academy_phone_click` (`tel:`) for every link on the site |
| `TrackedLink` | Client | Link wrapper firing a GTM-routed `track()` event on click |
| `ApplicationSuccessTracker` | Client (renders `null`) | Mounted in `app/dashboard/layout.tsx`; fires `application_submit` + `academy_apply_submit` once after a successful `/apply` signup (reads the `xba_application_submitted` cookie) |

Helpers: `lib/analytics/gtag.ts` (`gtagEvent`, `gtagEventThen`),
`lib/analytics/contact-links.ts` (`classifyContactLink`),
`lib/analytics/track.ts` (`track`, GTM/Meta only), `lib/analytics/config.ts`.

### Qualification route (`app/dashboard/qualify/`)

| Component | Type | Props |
|-----------|------|-------|
| `QualifyForm` | Client | None (uses action directly) |

**Behavior:**
- Typeform-like wizard with one question per screen
- Local per-step validation before moving forward
- Hidden full payload inputs for final server submit
- Progress indicator and mobile-first navigation controls

### Admin leads route (`app/dashboard/admin/leads/`)

| Component | Type | Props |
|-----------|------|-------|
| `page.tsx` table + native forms | RSC | `searchParams` filters |

## Internationalization components (`components/i18n/`)

The i18n subsystem is a custom typed dictionary (no external library).
Language context flows from server (`getServerDictionary`) to client via
`LanguageProvider`. See `docs/ARCHITECTURE.md` for the resolution model.

### LanguageProvider

**File:** `components/i18n/LanguageProvider.tsx`
**Type:** Client context provider
**Pattern:** React Context + `useMemo`

**Props:**
```typescript
interface LanguageProviderProps {
  initialLanguage: Language  // resolved server-side, passed from root layout
  children: ReactNode
}
```

**Context value (`useLanguage()`):**
```typescript
interface LanguageContextValue {
  language: Language
  dictionary: Dictionary
  setLanguage: (language: Language) => void
}
```

**Behavior:**
- `useLanguage()` throws if used outside the provider.
- `dictionary` is derived from `language` via `getDictionary()`.
- Re-syncs when `initialLanguage` changes (e.g. after cookie update).

### LanguageSwitcher

**File:** `components/i18n/LanguageSwitcher.tsx`
**Type:** Client component

**Behavior:**
- Renders the ES/EN toggle; calls `setLanguagePreference()` server
  action (persists cookie + `revalidatePath('/', 'layout')`).
- Reads labels from `dictionary.languageSwitcher`.

### FloatingLanguageSwitcher

**File:** `components/i18n/FloatingLanguageSwitcher.tsx`
**Type:** Client component (floating, positioned overlay)

**Behavior:**
- Floating variant of `LanguageSwitcher`, rendered globally so the
  toggle is reachable from any route.

**Coverage status (2026-11-16):** the dictionary already localizes the
public surface (`header`, `landing`, `loginPage`, `applyForm`,
`qualifyPage`, `qualifyForm`, `coursesPage`, `courseDetailPage`,
`dashboardHeader`, `dashboardPageHeader`, `dashboardQualifyPage`,
`userMenu`, `actions`). The dashboard interior (`dashboard`,
`dashboard.coursesList`, `dashboard.lesson`, `dashboard.tracker`,
`dashboard.grading`, `dashboard.admin`, `dashboard.progress`,
`competencies`, `levels`) is the pending scope of the i18n spec
(`docs/specs/req003.md`–`req011.md`).

## Component dependency graph

```
Root Layout
├── LanguageProvider (client)  ← wraps everything, provides useLanguage()
├── FloatingLanguageSwitcher (client)
├── HeaderWrapper (client)
│   └── Header (RSC)
│       └── getCurrentUser() cache
│
├── Landing Page (/)
│   ├── HeroSection
│   ├── TargetAudienceSection
│   ├── FeaturesSection
│   ├── MissionVisionSection
│   ├── InstructorSection
│   ├── PricingSection
│   └── FinalCtaSection
│
├── Auth Pages (/apply, /login, /signup)
│   ├── AuthCard + AuthCardContent
│   ├── AuthInput, AuthButton
│   └── ApplyForm (client, useActionState)
│
└── Dashboard (/dashboard/*)
    ├── DashboardGreenHeader
    │   └── UserMenu (client)
    ├── DashboardPageHeader
    ├── DashboardCard
    ├── DashboardFooter
    │
    ├── Courses
    │   ├── CourseListView (client)
    │   ├── CourseSidebar (RSC, React.cache)
    │   ├── VideoPlayer (client, dynamic import)
    │   └── LessonContent (client, DOMPurify)
    │
    ├── Tracker
    │   ├── SubmissionForm (client)
    │   ├── SubmissionCard (client)
    │   └── FeedbackModal (client)
    │
    ├── Grading
    │   └── GradingCard (client)
    │
    ├── Admin
    │   ├── AdminCourseList (client)
    │   ├── EditableText (client)
    │   ├── Leads review table (RSC)
    │   ├── EditLessonForm (client)
    │   ├── RichTextEditor (client, dynamic)
    │   └── EditorToolbar (client)
    │
    └── AdminToolsMenu (client)
```
