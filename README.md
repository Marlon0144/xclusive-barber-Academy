# Xclusive Barber Academy

Professional barbering education platform (LMS) for Latino barbers
in Australia. Built with Next.js 15, React 19, TypeScript, Tailwind
CSS v4, and Supabase.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to see the landing page.

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for full setup
instructions, including environment variables.

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | Tech stack, rendering strategy, folder structure, patterns |
| [Route map](docs/ROUTES.md) | Every route with auth, data flow, and component dependencies 
| [Components](docs/COMPONENTS.md) | Full component inventory with props and relationships 
| [Database](docs/DATABASE.md) | Schema, RLS, type contracts, data flow diagrams 
| [Development](docs/DEVELOPMENT.md) | Setup, conventions, adding features, performance rules 

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS v4 + Shadcn/UI pattern
- **Backend:** Supabase (Auth, Postgres, Storage)
- **AI:** OpenAI API (grading feedback)
- **Editor:** Tiptap (rich text for lessons)
- **Language:** TypeScript (strict mode)

## Project structure

```
app/           Pages, layouts, and co-located Server Actions
components/    Shared UI components by domain
types/         Shared TypeScript type definitions
utils/         Application utilities (Supabase, OpenAI, caching)
lib/           Framework utilities (cn helper)
public/assets/ Static images organized by section
docs/          Project documentation
.ai/           Sprint history and project context
```

## Key features

- **Invite-code registration** — Controlled student onboarding
- **Course management** — Video + rich text lessons with admin CRUD
- **Practice submissions** — Photo upload with AI-powered feedback
- **Professional progress** — 4-tier competency tracking system
- **Role-based access** — Student, Instructor, and Admin roles
- **Premium dark design** — Figma-faithful, mobile-first UI
