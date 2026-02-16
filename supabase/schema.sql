-- ============================================================
-- Checkmate Database Schema for Supabase
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Task Lists table
create table task_lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_task_lists_user_id on task_lists(user_id);

-- Tasks table
create table tasks (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  completed boolean not null default false,
  task_list_id uuid not null references task_lists(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_tasks_task_list_id on tasks(task_list_id);

-- ============================================================
-- Auto-update updated_at via trigger
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger task_lists_updated_at
  before update on task_lists
  for each row execute function update_updated_at();

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table task_lists enable row level security;
alter table tasks enable row level security;

-- task_lists: users can only access their own lists
create policy "Users can select their own task lists"
  on task_lists for select
  using (auth.uid() = user_id);

create policy "Users can insert their own task lists"
  on task_lists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own task lists"
  on task_lists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own task lists"
  on task_lists for delete
  using (auth.uid() = user_id);

-- tasks: users can only access tasks in their own lists
create policy "Users can select tasks in their own lists"
  on tasks for select
  using (
    exists (
      select 1 from task_lists
      where task_lists.id = tasks.task_list_id
        and task_lists.user_id = auth.uid()
    )
  );

create policy "Users can insert tasks into their own lists"
  on tasks for insert
  with check (
    exists (
      select 1 from task_lists
      where task_lists.id = tasks.task_list_id
        and task_lists.user_id = auth.uid()
    )
  );

create policy "Users can update tasks in their own lists"
  on tasks for update
  using (
    exists (
      select 1 from task_lists
      where task_lists.id = tasks.task_list_id
        and task_lists.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from task_lists
      where task_lists.id = tasks.task_list_id
        and task_lists.user_id = auth.uid()
    )
  );

create policy "Users can delete tasks in their own lists"
  on tasks for delete
  using (
    exists (
      select 1 from task_lists
      where task_lists.id = tasks.task_list_id
        and task_lists.user_id = auth.uid()
    )
  );
