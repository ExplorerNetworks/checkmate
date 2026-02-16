import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures only this user's lists are returned
  const { data: lists, error } = await supabase
    .from("task_lists")
    .select("id, name, created_at, tasks(id, completed)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = (lists ?? []).map((list) => ({
    id: list.id,
    name: list.name,
    createdAt: list.created_at,
    taskCount: list.tasks?.length ?? 0,
    completedCount:
      list.tasks?.filter((t: { completed: boolean }) => t.completed).length ??
      0,
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "List name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim().slice(0, 100);

    const { data: list, error } = await supabase
      .from("task_lists")
      .insert({ name: trimmedName, user_id: user.id })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(list, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
