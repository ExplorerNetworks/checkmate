import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  const { listId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the list exists and belongs to user (via RLS)
  const { data: list } = await supabase
    .from("task_lists")
    .select("id")
    .eq("id", listId)
    .single();

  if (!list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("task_list_id", listId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(tasks);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  const { listId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify list exists and belongs to user (via RLS)
  const { data: list } = await supabase
    .from("task_lists")
    .select("id")
    .eq("id", listId)
    .single();

  if (!list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Task text is required" },
        { status: 400 }
      );
    }

    // RLS INSERT policy checks that the task_list belongs to auth.uid()
    const { data: task, error } = await supabase
      .from("tasks")
      .insert({ text: text.trim(), task_list_id: listId })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
