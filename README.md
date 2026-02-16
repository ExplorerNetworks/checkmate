# Checkmate

Crush your to-do list. A secure auth, task tracking app with animated emojis, customizable themes, and multi-list support!

[![CI](https://github.com/ExplorerNetworks/checkmate/actions/workflows/ci.yml/badge.svg)](https://github.com/ExplorerNetworks/checkmate/actions/workflows/ci.yml) [![Test Report](https://img.shields.io/badge/Test%20Report-GitHub%20Pages-blue)](https://explorernetworks.github.io/checkmate)

## Features

- **Secure by design** -- Passwords are hashed by Supabase Auth and never stored or visible in plaintext, not even to database admins
- **Supabase PostgreSQL** -- Cloud-hosted database with Row Level Security ensuring per-user data isolation
- **User accounts** -- Email/password auth via Supabase Auth
- **Multi-list management** -- Create, rename, and delete task lists
- **Task CRUD** -- Add, check/uncheck, inline edit, and delete tasks
- **Animated emojis** -- Auto-matched to task/list content
- **Light/Dark mode** -- Persisted preference with system default detection
- **5 color themes** -- Ocean, Grape, Forest, Sunset, Cherry

## Architecture

```
+---------------------------------------------------------+
|                       Browser                           |
|                                                         |
|  +----------+  +-----------+  +----------------------+  |
|  | Login/   |  | Dashboard |  |  Task List Detail    |  |
|  | Register |  |  (lists)  |  |  (tasks + CRUD)      |  |
|  +----+-----+  +-----+-----+  +-----------+----------+  |
|       |              |                     |            |
|  +----+--------------+---------------------+----------+ |
|  |  ThemeRegistry (MUI ThemeProvider + Context)      |  |
|  |  - Light/Dark mode       - 5 color palettes       |  |
|  |  AnimatedEmoji (keyword matching + CSS animations)|  |
|  +----------------------------+------------------------+|
+-------------------------------|--------------------------+
                                | fetch()
+-------------------------------|--------------------------+
|                     Next.js Server                       |
|                                                          |
|  +----------------------------+------------------------+ |
|  |     Middleware (@supabase/ssr session refresh)      | |
|  |  Public: /login, /register, /api/auth/*             | |
|  |  Protected: everything else -> redirect /login      | |
|  +----------------------------+------------------------+ |
|                               |                          |
|  +----------------------------+------------------------+ |
|  |                  API Routes                         | |
|  |                                                     | |
|  |  /api/auth/register    POST  Create account         | |
|  |  /api/auth/login       POST  Log in                 | |
|  |  /api/auth/logout      POST  Log out                | |
|  |                                                     | |
|  |  /api/lists            GET   All lists              | |
|  |  /api/lists            POST  Create list            | |
|  |  /api/lists/[id]       GET   List + tasks           | |
|  |  /api/lists/[id]       PATCH Rename list            | |
|  |  /api/lists/[id]       DEL   Delete list            | |
|  |                                                     | |
|  |  /api/lists/[id]/tasks       GET  All tasks         | |
|  |  /api/lists/[id]/tasks       POST Create task       | |
|  |  /api/lists/[id]/tasks/[id]  PATCH Toggle/edit      | |
|  |  /api/lists/[id]/tasks/[id]  DEL   Delete task      | |
|  +----------------------------+------------------------+ |
|                               |                          |
|  +----------------------------+------------------------+ |
|  |                Lib Layer                            | |
|  |  supabase/server.ts -- server Supabase client       | |
|  |  supabase/client.ts -- browser Supabase client      | |
|  |  supabase/middleware.ts -- session refresh helper   | |
|  |  emoji.ts   -- keyword -> emoji matching            | |
|  +----------------------------+------------------------+ |
+-------------------------------|--------------------------+
                                |
+-------------------------------|--------------------------+
|          Supabase (PostgreSQL + Auth + RLS)              |
|                                                          |
|  +-----------+   +-------------+   +-----------------+   |
|  | auth.users|-->| task_lists  |-->|     tasks       |   |
|  | (managed) |   |             |   |                 |   |
|  | id (uuid) |   | id (uuid)   |   | id (uuid)       |   |
|  | email     |   | name        |   | text            |   |
|  | password  |   | user_id  FK |   | completed       |   |
|  | ...       |   | created_at  |   | task_list_id FK |   |
|  +-----------+   | updated_at  |   | created_at      |   |
|                  +-------------+   | updated_at      |   |
|                                    +-----------------+   |
|  RLS: 8 policies enforce per-user data isolation         |
|  Cascade deletes: auth.users -> task_lists -> tasks      |
+----------------------------------------------------------+
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | Material UI, Emotion |
| Auth | Supabase Auth (email/password) |
| Database | Supabase PostgreSQL with Row Level Security |
| Language | TypeScript |
| Unit Tests | Vitest |
| E2E Tests | Playwright (Chromium) |
| CI/CD | GitHub Actions |
| Hosting | Vercel |
| Analytics | Vercel Speed Insights |

## Getting Started

### 1. Supabase Setup

Create a project at [supabase.com](https://supabase.com/dashboard), then:

- Go to **SQL Editor** and run the contents of `supabase/schema.sql` to create tables and RLS policies
- Go to **Authentication > Providers > Email** and disable "Confirm email" (for development)
- Note your **Project URL** and **Anon Key** from **Settings > API**

### 2. Local Setup

```bash
# Install dependencies
npm install

# Create .env with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Run dev server
npm run dev

# Or build and run in production mode
npm run build
npm run start
```

Open http://localhost:3000, create an account with your email, and start tracking.

## Testing

```bash
npm test              # Run all tests (unit + E2E)
npm run test:unit     # Vitest unit tests only (14 tests)
npm run test:e2e      # Playwright E2E tests only (21 tests)
npx vitest            # Unit tests in watch mode
```

**Unit tests** (Vitest) cover the lib layer -- emoji matching logic and animation assignment.

**E2E tests** (Playwright) cover full user flows -- registration, login, list CRUD, task CRUD, theme switching, and logout. Tests use the Supabase admin API (service role key) to create/cleanup test users, bypassing signup rate limits.

E2E tests require a `.env.test` file with Supabase credentials and an optional `SUPABASE_SERVICE_ROLE_KEY` for test data cleanup. Test cleanup is scoped to `@test.com` users only -- real user data is never touched.

## CI/CD

GitHub Actions runs on every push and PR to `main`:

| Job | What it does |
|-----|-------------|
| **Lint** | ESLint checks |
| **Unit Tests** | Vitest (14 tests) |
| **E2E Tests** | Playwright against live Supabase (21 tests) |
| **Publish Report** | Deploys Playwright HTML report to GitHub Pages |

The Playwright test report is published to GitHub Pages after each run on `main`. E2E tests require three repository secrets: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

The app is hosted on **Vercel** with **Vercel Speed Insights** for performance monitoring.

## Project Structure

```
checkmate/
├── middleware.ts                 # Auth guard (Supabase session)
├── supabase/schema.sql          # Database schema + RLS policies
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts        # Server-side Supabase client
│   │   │   ├── client.ts        # Browser-side Supabase client
│   │   │   └── middleware.ts    # Session refresh helper
│   │   └── emoji.ts             # Keyword -> emoji matching (200+ keywords)
│   ├── app/
│   │   ├── page.tsx             # Root redirect
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── dashboard/           # Task list grid
│   │   ├── dashboard/[listId]/  # Task detail view
│   │   └── api/                 # REST API routes
│   └── components/
│       ├── ThemeContext.tsx      # MUI theme + dark/light + color palettes
│       ├── ThemePicker.tsx      # Color theme selector popover
│       ├── AnimatedEmoji.tsx    # CSS-animated emoji renderer
│       ├── AuthForm.tsx         # Login/register form (email/password)
│       ├── TaskListCard.tsx     # Dashboard list card
│       ├── TaskItem.tsx         # Task row with checkbox
│       ├── ConfirmDialog.tsx    # Themed delete confirmation dialog
│       ├── CreateListForm.tsx   # New list input
│       └── CreateTaskForm.tsx   # New task input
├── .github/workflows/ci.yml     # GitHub Actions CI pipeline
├── e2e/                         # Playwright E2E tests
│   ├── global-setup.ts          # Pre-test cleanup (@test.com users only)
│   ├── global-teardown.ts       # Post-test cleanup (@test.com users only)
│   ├── helpers/auth.ts          # Shared register/login helpers
│   ├── auth.spec.ts             # Auth flow tests
│   ├── lists.spec.ts            # List CRUD tests
│   ├── tasks.spec.ts            # Task CRUD tests
│   └── theme.spec.ts            # Theme switching tests
```
