# Architecture overview

This document describes the technical architecture of
Xclusive Barber Academy, a production-grade LMS for professional
barbering education. Use it as the single source of truth when making
architectural decisions or onboarding to the codebase.

> **Note:** If you find discrepancies between this document and the
> actual code, the code is the source of truth. Update this document
> accordingly.

## Tech stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.3 |
| Language | TypeScript (strict mode) | 5.x |
| UI library | React | 19.0.0 |
| Styling | Tailwind CSS v4 + `@theme inline` | 4.1.x |
| Component primitives | Radix UI (via Shadcn pattern) | Latest |
| Variant system | Class Variance Authority (CVA) | 0.7.x |
| Icons | Lucide React | 0.563.x |
| Backend | Supabase (Auth, Postgres, Storage) | 2.91.x |
| Server client | `@supabase/ssr` (cookie-based) | 0.8.x |
| AI feedback | OpenAI API (`gpt-4o-mini`) | 6.17.x |
| Rich text editor | Tiptap (7 extensions) | 3.19.x |
| Video embeds | `react-youtube` | 10.1.x |
| Sanitization | `isomorphic-dompurify` + `jsdom` | 2.35.x |
| Class utilities | `clsx` + `tailwind-merge` | Latest |

## High-level architecture

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Landing (/)  │  │  Auth Pages  │  │  Dashboard   │  │
│  │  (RSC only)   │  │  (Client)    │  │  (RSC+Client)│  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                  NEXT.JS SERVER                         │
│                                                         │
│  middleware.ts ─► Auth guard + route protection          │
│       │                                                 │
│       ▼                                                 │
│  Page (async RSC)                                       │
│    ├─ React.cache() helpers (deduplicate DB calls)      │
│    └─ Render tree (Server + Client Components)          │
│       │                                                 │
│  Server Actions (mutations)                             │
│    ├─ Verify auth                                       │
│    ├─ Validate input (Zod)                              │
│    ├─ Mutate via Supabase client                        │
│    └─ revalidatePath() for cache bust                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────┐   │
│  │  Postgres  │  │  Auth     │  │  Storage (images) │   │
│  │  (RLS)     │  │  (JWT)    │  │  (submissions)    │   │
│  └───────────┘  └───────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Rendering strategy

The project follows a **Server Components by default** strategy.
Client Components are used only when browser APIs or interactivity
are required.

| Pattern | Where | Why |
|---------|-------|-----|
| Async RSC | Pages, layout, Header, CourseSidebar | Zero client JS, direct DB access |
| Client Component | Forms, VideoPlayer, AdminCourseList, TrackerPage | State, effects, browser APIs |
| Dynamic import | Tiptap editor, `react-youtube` | Code splitting for heavy libraries |
| `React.cache()` | `getUser`, `getProfile`, `getLessonById`, `getStudentProgress` | Deduplicate DB calls within a request |

## Internationalization (i18n)

The project uses a **custom, typed dictionary** (no external i18n library such
as next-intl/react-i18next). Language resolves from the
`preferred_language` cookie with fallback to the `accept-language` header;
default is Spanish (`es`). Switching is **cookie-based** — there is no URL
locale prefix (`/en/...`).

| File | Responsibility |
|------|----------------|
| `lib/i18n/config.ts` | `Language` type, `SUPPORTED_LANGUAGES` (`es`, `en`), cookie name/age, `accept-language` parser |
| `lib/i18n/server.ts` | `getServerLanguage()` / `getServerDictionary()` (RSC, `React.cache`) |
| `lib/i18n/dictionaries.ts` | Typed dictionary `{ es, en }` — single source of UI strings |
| `components/i18n/LanguageProvider.tsx` | React context `useLanguage()` for client components |
| `components/i18n/LanguageSwitcher.tsx` + `FloatingLanguageSwitcher.tsx` | Switcher UI (floating, rendered on all routes) |
| `app/i18n/actions.ts` | `setLanguagePreference()` server action — persists cookie + `revalidatePath('/', 'layout')` |

**Resolution pattern (RSC → client):** server components read
`const dict = await getServerDictionary()` and pass strings down as props;
client components read `useLanguage()` (wrapped by `LanguageProvider` in the
root layout).

**Coverage status (2026-11-16):** the public surface (landing, headers, login,
apply, qualify, `/courses`) is translated. The dashboard interior
(`/dashboard`, course viewer, lesson player, tracker, grading, progress, admin)
still contains hardcoded Spanish and is the pending scope of the i18n spec.

**Content localization:** module/lesson *titles* are stored in Spanish in
Supabase. The completion spec adds nullable `*_en` columns with a Spanish
fallback (helper `pick()`). See `docs/specs/srs001.md` and the requirement
files `docs/specs/req001.md`–`req012.md` for the full breakdown.

## Folder structure and conventions

```
/
├── app/                    # Next.js App Router (pages + actions)
│   ├── globals.css         # Design tokens, Tailwind v4 @theme
│   ├── layout.tsx          # Root layout (fonts, metadata, header)
│   ├── page.tsx            # Landing page
│   ├── apply/              # Student registration
│   ├── auth/               # Shared auth actions
│   ├── login/              # Login page
│   ├── signup/             # Signup page (legacy)
│   ├── i18n/               # Language preference server action
│   └── dashboard/          # Protected area
│       ├── page.tsx        # Dashboard hub
│       ├── qualify/         # Lead qualification wizard (step 2)
│       ├── admin/          # Admin-only routes
│       │   ├── leads/       # CRM lead review panel
│       ├── courses/        # Course viewer
│       ├── grading/        # Instructor grading
│       ├── progreso_profesional/ # Progress tracker
│       └── tracker/        # Evidence submission
│
├── components/             # Shared components
│   ├── ui/                 # Design system primitives (Button, Input, AuthCard)
│   ├── admin/              # Rich text editor components
│   ├── courses/            # Video player, lesson content, sidebar
│   ├── dashboard/          # Dashboard cards, header, footer
│   ├── headers/            # DashboardGreenHeader, DashboardPageHeader
│   ├── i18n/               # LanguageProvider, LanguageSwitcher, FloatingLanguageSwitcher
│   └── landing/            # Landing page sections
│
├── lib/                    # Framework utilities
│   ├── i18n/               # Internationalization (config, server, dictionaries)
│   └── utils.ts            # cn() helper (clsx + tailwind-merge)
│
├── types/                  # Shared TypeScript types
│   ├── progress.ts         # Progress feature types
│   └── submissions.ts      # Submission and scores types
│
├── utils/                  # Application utilities
│   ├── cache-helpers.ts    # React.cache() wrapped DB helpers
│   ├── get-youtube-id.ts   # YouTube URL parser
│   ├── openai.ts           # AI feedback generation
│   └── supabase/           # Supabase client factories
│       ├── client.ts       # Browser singleton client
│       ├── server.ts       # Server client + Admin client
│       └── middleware.ts   # Auth session refresh + route guard
│
├── public/assets/          # Static images (per-section organized)
├── middleware.ts            # Next.js middleware entry point
└── .ai/PROJECT_CONTEXT.md  # Sprint history and project state
```

### Co-location pattern

Route-specific components live next to their `page.tsx`:

```
app/dashboard/tracker/
├── page.tsx            # Page component
├── actions.ts          # Server Actions
├── SubmissionForm.tsx   # Route-specific component
├── SubmissionCard.tsx   # Route-specific component
└── FeedbackModal.tsx    # Route-specific component
```

Shared components live in `components/` with sub-folders by domain.

## Dual-client pattern (Supabase)

The project uses two Supabase client factories on the server:

| Client | Factory | Auth | RLS | Use case |
|--------|---------|------|-----|----------|
| Normal | `createClient()` (server.ts) | Cookie session | Enforced | User-scoped reads and writes |
| Admin | `createAdminClient()` (server.ts) | Service Role key | Bypassed | Profile creation, admin CRUD |

**When to use Admin client:**
- Creating `profiles` records during registration (RLS blocks
  service role inserts otherwise)
- Admin-only CRUD operations on modules and lessons
- Any operation that must bypass row-level security

**Security rule:** Always verify the user's identity with the normal
client first, then perform the privileged operation with the Admin
client.

## Authentication and authorization

### Auth flow

```
Browser ──► middleware.ts ──► updateSession()
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
           Unauthenticated  Authenticated  Authenticated
           + /dashboard/*   + /login       + /dashboard/*
                 │              │              │
                 ▼              ▼              ▼
           Redirect to      Redirect to    Allow
           /login           /dashboard     through
```

### Role-based access

| Role | Dashboard | Courses | Tracker | Grading | Admin | Progress |
|------|-----------|---------|---------|---------|-------|----------|
| `student` | Yes | Yes | Yes | No | No | Yes |
| `instructor` | Yes | Yes | Yes | Yes | No | Yes |
| `admin` | Yes | Yes | Yes | Yes | Yes | Yes |

Roles are stored in `profiles.role` and checked in:
- **Server Components:** Via `getProfile(userId)` cached helper
- **Server Actions:** Via direct Supabase query at the top of each
  action
- **Middleware:** Route-level auth (not role) guard only

### Invite code system

Registration requires a valid `invite_code` from the `invitations`
table. The code must:
1. Exist in the database
2. Have `used_count < max_uses`

On successful registration, `used_count` is incremented via the Admin
client.

### CRM onboarding flow

Student onboarding now has two steps:

1. `/apply` creates auth user, profile, and a seed `crm_leads` row.
2. User is redirected to `/dashboard/qualify`.
3. Qualification action computes auto score, stores
   questionnaire answers, and marks `qualification_completed_at`.
4. `/dashboard` gate redirects only students with an existing CRM lead row
   that is still incomplete.

Admins review leads in `/dashboard/admin/leads` and prioritize
follow-up using CRM stage and commercial status.

## Performance patterns

These optimizations follow Vercel React Best Practices:

1. **Parallel data fetching** — `Promise.all()` for independent
   queries instead of sequential awaits
2. **React.cache() deduplication** — Prevents duplicate DB calls
   when multiple components need the same data in one request
3. **Dynamic imports** — Heavy libraries (Tiptap, react-youtube)
   are loaded on demand with `next/dynamic`
4. **Singleton browser client** — `createClient()` caches a single
   Supabase instance to keep dependency arrays stable
5. **Server Components by default** — Minimizes client-side
   JavaScript bundle
6. **Image optimization** — `next/image` for all images except blob
   URL previews

## Design system

### Color tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--gold-500` | `#D4AF37` | Primary brand, buttons, accents |
| `--gold-300` | `#E9D8A6` | Lighter gold accents |
| `--gold-600` | `#B4941F` | Hover states |
| `--background` | `#161616` | Page background |
| `--foreground` | `#D3CBBA` | Body text (cream) |
| `--surface` | `#0F0F0F` | Card backgrounds |
| `--green-950` | `#0A1F0A` | Deep green accents |

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | Poppins | 800 (ExtraBold) | Titles, section headers |
| Body | Poppins | 400 (Regular) | Paragraphs, labels |
| All weights | Poppins | 300-900 | Various UI elements |

### Component library

The UI kit follows the Shadcn/UI pattern (Radix primitives + CVA
variants). Core components in `components/ui/`:

- **Button** — 6 variants (default/gold, destructive, outline,
  secondary, ghost, link) + 4 sizes
- **Input** — Minimal border-bottom design with focus state
- **AuthButton** — Gold gradient, loading spinner, uppercase
- **AuthInput** — Labeled with error state and animated underline
- **AuthCard** — Dark card container with header and content slots
