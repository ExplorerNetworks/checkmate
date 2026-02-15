# Checkmate

Crush your to-do list. A task tracking app with animated emojis, customizable themes, and multi-list support.

## Features

- **Multi-list management** -- Create, rename, and delete task lists
- **Task CRUD** -- Add, check/uncheck, inline edit, and delete tasks
- **Animated emojis** -- Auto-matched to task/list content (200+ keywords)
- **5 color themes** -- Ocean, Grape, Forest, Sunset, Cherry
- **Light/Dark mode** -- Persisted preference with system default detection
- **User accounts** -- Simple username/password auth with JWT sessions
- **Local SQLite DB** -- Zero external dependencies, single file storage

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
|  |            Middleware (JWT verify)                  | |
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
|  |  auth.ts    -- bcrypt hash, JWT sign/verify         | |
|  |  session.ts -- cookie mgmt, getCurrentUser()        | |
|  |  prisma.ts  -- PrismaClient singleton               | |
|  |  emoji.ts   -- keyword -> emoji matching            | |
|  +----------------------------+------------------------+ |
+-------------------------------|--------------------------+
                                |
+-------------------------------|--------------------------+
|                SQLite (prisma/dev.db)                    |
|                                                          |
|  +----------+   +------------+   +--------------------+  |
|  |   User   |-->|  TaskList  |-->|       Task         |  |
|  |          |   |            |   |                    |  |
|  | id       |   | id         |   | id                 |  |
|  | username |   | name       |   | text               |  |
|  | password |   | userId  FK |   | completed          |  |
|  | createdAt|   | createdAt  |   | taskListId  FK     |  |
|  +----------+   | updatedAt  |   | createdAt          |  |
|                 +------------+   | updatedAt          |  |
|                                  +--------------------+  |
|  Cascade deletes: User -> Lists -> Tasks                 |
+----------------------------------------------------------+
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | Material UI, Emotion |
| Auth | bcryptjs + jose (JWT in httpOnly cookies) |
| Database | SQLite via Prisma ORM |
| Language | TypeScript |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment (create .env with):
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-secret-min-32-chars"

# Create database
npx prisma migrate dev

# Run dev server
npm run dev

# Or build and run in production mode
npm run build
npm run start
```

Open http://localhost:3000, create an account, and start tracking.

> **Note:** Checkmate uses a local SQLite file (`prisma/dev.db`) for storage. No external database server is required — all data lives in a single file on disk.

## Project Structure

```
checkmate/
├── middleware.ts                 # Auth guard (JWT verification)
├── prisma/schema.prisma         # Database models
├── src/
│   ├── lib/
│   │   ├── prisma.ts            # DB client singleton
│   │   ├── auth.ts              # Password hashing, JWT
│   │   ├── session.ts           # Cookie/session helpers
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
│       ├── AuthForm.tsx         # Login/register form
│       ├── TaskListCard.tsx     # Dashboard list card
│       ├── TaskItem.tsx         # Task row with checkbox
│       ├── ConfirmDialog.tsx    # Themed delete confirmation dialog
│       ├── CreateListForm.tsx   # New list input
│       └── CreateTaskForm.tsx   # New task input
```
