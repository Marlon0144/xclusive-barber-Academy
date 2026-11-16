# Development guide

This document covers setup, conventions, and patterns you need to
follow when working on Xclusive Barber Academy. Read it before
making your first contribution.

## Prerequisites

- Node.js 20+
- npm (included with Node.js)
- A Supabase project with the required tables and RLS policies
- OpenAI API key (for AI grading feedback)

## Environment variables

Create a `.env.local` file in the project root with these values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
```

> **Warning:** Never commit `.env.local` to version control. The
> `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies and must
> remain secret.

## Getting started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

The development server runs at `http://localhost:3000`.

## Code conventions

### TypeScript

- **Strict mode is enabled.** No `any` types, no implicit `any`.
- Define shared types in `types/` directory.
- Inline types are acceptable for route-specific components.
- Use `interface` for object shapes, `type` for unions and aliases.

### Component patterns

**Server Components (default):**
- Use for pages, layouts, and any component that only renders data.
- Access the database directly via Supabase server client.
- Use `React.cache()` to deduplicate data fetching.

**Client Components:**
- Add `'use client'` directive only when you need browser APIs,
  state, effects, or event handlers.
- Keep Client Components as small and focused as possible.
- Push interactivity to leaf components (keep parents as RSC).

**Dynamic imports:**
- Use `next/dynamic` with `{ ssr: false }` for heavy libraries
  that don't need server rendering (for example, Tiptap,
  react-youtube).

### Styling

- **Tailwind CSS v4** with `@theme inline` in `globals.css`.
- Use CSS variables (`--gold-500`, `--background`, etc.) as the
  source of truth for colors.
- Use `cn()` from `lib/utils.ts` to merge conditional classes.
- Always use Tailwind utilities on standard breakpoints. Mobile
  styles are the default; add `md:`, `lg:`, `xl:` for larger
  screens.
- Use `clamp()` for fluid responsive sizing when Figma designs
  require pixel-perfect scaling.

### Imports

- Use the `@/` path alias for all imports (for example,
  `@/components/ui/button`).
- Always import `Button` from `@/components/ui/button` instead of
  using raw `<button>` elements.
- Barrel exports exist in `components/headers/index.ts`.

### Server Actions

Follow this pattern for every Server Action:

```typescript
'use server'

export async function myAction(formData: FormData) {
  // 1. Authenticate
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // 2. Authorize (if role-specific)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return { error: 'Sin permisos' }
  }

  // 3. Validate input
  const parsed = schema.safeParse(rawInput)
  if (!parsed.success) return { error: parsed.error.message }

  // 4. Mutate (use Admin client if bypassing RLS)
  const supabaseAdmin = createAdminClient()
  await supabaseAdmin.from('table').insert(parsed.data)

  // 5. Revalidate cache
  revalidatePath('/relevant/path')

  return { success: true }
}
```

### File naming

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` (Next.js convention) | `app/login/page.tsx` |
| Layouts | `layout.tsx` | `app/dashboard/courses/[courseId]/layout.tsx` |
| Server Actions | `actions.ts` | `app/dashboard/tracker/actions.ts` |
| Components | PascalCase | `SubmissionCard.tsx` |
| Utilities | camelCase | `cache-helpers.ts` |
| Types | camelCase | `submissions.ts` |

### File organization

- **Route-specific components** live next to their `page.tsx`.
- **Shared components** go in `components/` with sub-folders by
  domain.
- **Types** go in `types/` when used by multiple files.
- **Utilities** go in `utils/` (application logic) or `lib/`
  (framework utilities).

## Internationalization (i18n)

The project localizes UI text with a custom **typed dictionary** — no
external library (no next-intl/react-i18next). Full spec:
`docs/specs/srs001.md`; per-requirement breakdown:
`docs/specs/req001.md`–`req012.md`.

### Key files

| File | Purpose |
|------|---------|
| `lib/i18n/config.ts` | `Language`, `SUPPORTED_LANGUAGES` (`es`, `en`), cookie name/age, `accept-language` parser |
| `lib/i18n/server.ts` | `getServerLanguage()` / `getServerDictionary()` (both `React.cache`) |
| `lib/i18n/dictionaries.ts` | `dictionaries.es` / `dictionaries.en`, `getDictionary()`, `interpolate()` |
| `components/i18n/LanguageProvider.tsx` | `useLanguage()` context for client components |
| `app/i18n/actions.ts` | `setLanguagePreference()` server action (cookie + `revalidatePath('/', 'layout')`) |

### Rules

1. **RSC pages** read `const dict = await getServerDictionary()` and
   pass strings down as props — never hardcode visible text.
2. **Client components** read `const { dictionary, language } =
   useLanguage()` (must be under `LanguageProvider`, which wraps the
   root layout). Import `getDictionary` directly for leaf client
   components only if the provider is not available — prefer the
   context.
3. **Add new strings in both branches.** The `es` and `en` objects in
   `dictionaries.ts` must keep exact key parity. (The spec proposes a
   single `DictionaryShape` to enforce this at compile time — see
   `req001.md`.)
4. **Interpolation** uses the existing `interpolate(template, values)`
   helper with `{{key}}` placeholders.
5. **Localized DB titles** (module/lesson `*_en` columns) must resolve
   through a single fallback helper (spec: `pick(language, { es, en })`,
   `req002.md`) — do not duplicate `title_en ?? title` inline.
6. **Language setter** always goes through
   `setLanguagePreference()` (cookie `preferred_language`,
   `sameSite: 'lax'`, `secure` in production); never set the cookie
   directly from client code.
7. **No hardcoded Spanish** in new components. When you add UI text,
   add it to the dictionary.

## Adding a new feature

Follow this checklist when implementing a new feature:

1. **Check `.ai/PROJECT_CONTEXT.md`** for current sprint state and
   database schema.
2. **Check `docs/`** for existing architecture decisions that may
   affect your feature.
3. **Database changes** — If needed, create the migration in
   Supabase and document in `DATABASE.md`.
4. **Types** — Define TypeScript types in `types/` if shared, or
   inline if route-specific.
5. **Server Action** — Create `actions.ts` co-located with the
   page. Follow the auth → validate → mutate → revalidate pattern.
6. **Page** — Create `page.tsx` as an async RSC. Fetch data, pass
   to components.
7. **Components** — Co-locate route-specific components. Extract
   to `components/` only if reused.
8. **Styling** — Follow the "Premium Dark" design system. Use
   existing tokens and components.
9. **Update docs** — Update `ROUTES.md`, `COMPONENTS.md`, and
   `DATABASE.md` as needed.

## Adding a new route

1. Create the folder under `app/` following the existing nesting
   pattern.
2. Create `page.tsx` (async RSC recommended).
3. If the route needs mutations, create `actions.ts` with
   `'use server'` directive.
4. If the route is protected, middleware handles auth automatically
   for anything under `/dashboard/`.
5. For role-specific access, add an in-page role check that
   returns an access-denied message.
6. Document the new route in `docs/ROUTES.md`.

## Supabase client usage

| Context | Client | Import |
|---------|--------|--------|
| Client Components | `createClient()` | `@/utils/supabase/client` |
| Server Components | `await createClient()` | `@/utils/supabase/server` |
| Server Actions (user-scoped) | `await createClient()` | `@/utils/supabase/server` |
| Server Actions (admin ops) | `createAdminClient()` | `@/utils/supabase/server` |
| Middleware | Custom (built-in) | `@/utils/supabase/middleware` |

> **Note:** The browser client is a singleton. The server client
> creates a new instance per request (uses cookies). The Admin
> client is synchronous and does not use cookies.

## Performance guidelines

These rules are derived from Vercel React Best Practices:

1. **Never chain independent awaits.** Use `Promise.all()` when
   fetching data that doesn't depend on each other.
2. **Wrap repeated server-side fetches in `React.cache()`** to
   deduplicate within the same request.
3. **Use `next/dynamic` for heavy client libraries** to keep the
   initial bundle small.
4. **Prefer Server Components** by default. Only use Client
   Components for interactivity.
5. **Use `next/image`** for all images. Exception: blob URLs
   (for example, file previews) must use `<img>` with an ESLint
   disable comment.
6. **Keep the browser Supabase client as a singleton** to maintain
   stable references for dependency arrays.

## Testing

> **Note:** The project does not currently have a testing framework
> configured. When adding tests, consider Vitest for unit tests and
> Playwright for end-to-end tests, both of which integrate well
> with Next.js.

## Build and deploy

```bash
# Production build
npm run build

# Verify build output
# Look for: 0 errors, 0 warnings, all routes generated
```

The project is designed to deploy on Vercel. Ensure all environment
variables are configured in the Vercel project settings.
