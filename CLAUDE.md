# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Checkmate is a full-stack Next.js task tracker with animated emojis, customizable themes (5 color palettes + dark/light mode), and multi-list support. Built with the App Router, Material UI, Prisma/SQLite, and JWT-based authentication.

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

# Database
npx prisma migrate dev   # Apply migrations (creates SQLite dev.db)
npx prisma db push       # Push schema changes without migration
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — SQLite path (e.g., `"file:./dev.db"`)
- `JWT_SECRET` — Minimum 32 characters for HMAC-SHA256

## Architecture

### Routing & Pages (App Router)

- `/` — Redirects to `/dashboard` (authenticated) or `/login`
- `/login`, `/register` — Public auth pages
- `/dashboard` — Grid of task lists with progress bars
- `/dashboard/[listId]` — Single list detail view with tasks

### API Routes (`src/app/api/`)

RESTful endpoints with ownership validation on all routes:
- `auth/register|login|logout` — POST-only auth endpoints
- `lists/` — GET all lists, POST create list
- `lists/[listId]/` — GET list+tasks, PATCH rename, DELETE list
- `lists/[listId]/tasks/` — GET tasks, POST create task
- `lists/[listId]/tasks/[taskId]/` — PATCH toggle/edit, DELETE task

### Authentication

- **Middleware** (`middleware.ts`) — JWT verification guard on all non-public routes
- **Auth library** (`src/lib/auth.ts`) — bcryptjs (10 rounds) + jose JWT (HS256, 7-day expiry)
- **Session** (`src/lib/session.ts`) — httpOnly cookie named `session`, secure in production, sameSite=lax

### Database (Prisma + SQLite)

Schema in `prisma/schema.prisma` with three models:
- **User** → has many TaskLists (cascade delete)
- **TaskList** → has many Tasks (cascade delete), belongs to User
- **Task** → belongs to TaskList, has `text`, `completed` fields

Path alias `@/*` maps to `./src/*`.

### Key Libraries

- `src/lib/prisma.ts` — PrismaClient singleton
- `src/lib/emoji.ts` — Keyword→emoji matching using emojilib with smart fallback: full text → bigram → individual word matching. Animation type is determined by Unicode range (food→wiggle, animals→wave, transport→bounce, etc.)

### Components (`src/components/`)

All interactive components are client components (`"use client"`):
- **ThemeContext** — React Context managing MUI theme (5 palettes: Ocean, Grape, Forest, Sunset, Cherry) + dark/light mode, persisted to localStorage
- **AnimatedEmoji** — CSS keyframe animations (bounce, wiggle, pulse, spin, wave)
- **AuthForm** — Shared login/register form
- **TaskListCard / TaskItem** — Dashboard cards and task rows with inline editing
- **CreateListForm / CreateTaskForm** — Input forms for creating lists and tasks

### TypeScript & Styling

- Strict TypeScript with `@/*` path alias
- MUI 7 + Emotion for component styling
- Tailwind CSS v4 (via PostCSS plugin) for utility classes
