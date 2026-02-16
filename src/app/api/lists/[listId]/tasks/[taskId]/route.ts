import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string; taskId: string }> }
) {
  const { listId, taskId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures user can only see tasks in their own lists
  const { data: existing } = await supabase
    .from("tasks")
    .select("id")
    .eq("id", taskId)
    .eq("task_list_id", listId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const data: { text?: string; completed?: boolean } = {};

    if (typeof body.text === "string") {
      const trimmed = body.text.trim();
      if (trimmed.length === 0) {
        return NextResponse.json(
          { error: "Task text cannot be empty" },
          { status: 400 }
        );
      }
      data.text = trimmed;
    }

    if (typeof body.completed === "boolean") {
      data.completed = body.completed;
    }

    const { data: updated, error } = await supabase
      .from("tasks")
      .update(data)
      .eq("id", taskId)
      .eq("task_list_id", listId)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ listId: string; taskId: string }> }
) {
  const { listId, taskId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("task_list_id", listId);

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}
