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

**Renders:** Shared footer with Instagram handle, logo, and phone
number. Optional tagline text.

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
| `HeroSection` | `landing/HeroSection.tsx` | Hero banner, tattoo arm graphic, CTA |
| `TargetAudienceSection` | `landing/TargetAudienceSection.tsx` | Green CTA bar + 3 audience bullets |
| `FeaturesSection` | `landing/FeaturesSection.tsx` | Three-column: Mentalidad, Practica, Carrera |
| `MissionVisionSection` | `landing/MissionVisionSection.tsx` | Mission + Vision dark cards |
| `InstructorSection` | `landing/InstructorSection.tsx` | Julian founder bio + photo |
| `FinalCtaSection` | `landing/FinalCtaSection.tsx` | Final CTA + Instagram/WhatsApp contact |

**Design:** All sections follow the "Premium Dark" aesthetic with
gold accents, mobile-first responsive design, and Figma-faithful
spacing.

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

### Qualification route (`app/dashboard/qualify/`)

| Component | Type | Props |
|-----------|------|-------|
| `QualifyForm` | Client | None (uses action directly) |

### Admin leads route (`app/dashboard/admin/leads/`)

| Component | Type | Props |
|-----------|------|-------|
| `page.tsx` table + native forms | RSC | `searchParams` filters |

## Component dependency graph

```
Root Layout
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
