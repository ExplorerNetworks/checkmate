# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Checkmate is a full-stack Next.js task tracker with animated emojis, customizable themes (5 color palettes + dark/light mode), and multi-list support. Built with the App Router, Material UI, Supabase (PostgreSQL + Auth), and Row Level Security.

## Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint

# Testing
npm run test             # Run all tests (unit + E2E)
npm run test:unit        # Vitest unit tests only
npm run test:e2e         # Playwright E2E tests only (starts dev server)
npx vitest               # Unit tests in watch mode
```

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon (public) key

Optional in `.env.test` for E2E cleanup:
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only, never expose to browser)

## Architecture

### Routing & Pages (App Router)

- `/` — Redirects to `/dashboard` (authenticated) or `/login`
- `/login`, `/register` — Public auth pages (email/password)
- `/dashboard` — Grid of task lists with progress bars
- `/dashboard/[listId]` — Single list detail view with tasks

### API Routes (`src/app/api/`)

RESTful endpoints with Supabase RLS enforcing ownership:
- `auth/register|login|logout` — POST-only auth endpoints (Supabase Auth)
- `lists/` — GET all lists, POST create list
- `lists/[listId]/` — GET list+tasks, PATCH rename, DELETE list
- `lists/[listId]/tasks/` — GET tasks, POST create task
- `lists/[listId]/tasks/[taskId]/` — PATCH toggle/edit, DELETE task

### Authentication (Supabase Auth)

- **Middleware** (`middleware.ts`) — Uses `@supabase/ssr` to refresh sessions and redirect unauthenticated users
- **Supabase client** (`src/lib/supabase/server.ts`) — Server-side client with cookie handling for API routes
- **Browser client** (`src/lib/supabase/client.ts`) — Client-side Supabase instance for `"use client"` components
- Auth flow: `supabase.auth.signUp()`, `signInWithPassword()`, `signOut()`, `getUser()`

### Database (Supabase PostgreSQL + RLS)

Schema in `supabase/schema.sql` with two tables (users managed by Supabase Auth):
- **task_lists** → belongs to auth.users (cascade delete), has `name`, timestamps
- **tasks** → belongs to task_list (cascade delete), has `text`, `completed`, timestamps

Row Level Security: 8 policies (4 per table) enforce per-user data isolation. The anon key is safe to expose; RLS uses `auth.uid()` from the JWT to scope all queries.

Path alias `@/*` maps to `./src/*`.

### Key Libraries

- `src/lib/supabase/server.ts` — Server-side Supabase client (used in all API routes)
- `src/lib/supabase/client.ts` — Browser-side Supabase client
- `src/lib/supabase/middleware.ts` — Session refresh + auth guard helper
- `src/lib/emoji.ts` — Keyword→emoji matching using emojilib with smart fallback: full text → bigram → individual word matching. Animation type is determined by Unicode range (food→wiggle, animals→wave, transport→bounce, etc.)

### Components (`src/components/`)

All interactive components are client components (`"use client"`):
- **ThemeContext** — React Context managing MUI theme (5 palettes: Ocean, Grape, Forest, Sunset, Cherry) + dark/light mode, persisted to localStorage
- **AnimatedEmoji** — CSS keyframe animations (bounce, wiggle, pulse, spin, wave)
- **AuthForm** — Shared login/register form (email/password)
- **TaskListCard / TaskItem** — Dashboard cards and task rows with inline editing
- **CreateListForm / CreateTaskForm** — Input forms for creating lists and tasks

### TypeScript & Styling

- Strict TypeScript with `@/*` path alias
- MUI 7 + Emotion for component styling
- Tailwind CSS v4 (via PostCSS plugin) for utility classes
