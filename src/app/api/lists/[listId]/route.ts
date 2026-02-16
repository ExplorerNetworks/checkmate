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

  // RLS ensures only the owner's list is returned
  const { data: list, error } = await supabase
    .from("task_lists")
    .select("id, name, tasks(id, text, completed, created_at)")
    .eq("id", listId)
    .order("created_at", { referencedTable: "tasks", ascending: true })
    .single();

  if (error || !list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(list);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  const { listId } = await params;
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

    // RLS ensures user can only update their own lists
    const { data: updated, error } = await supabase
      .from("task_lists")
      .update({ name: name.trim().slice(0, 100) })
      .eq("id", listId)
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
  { params }: { params: Promise<{ listId: string }> }
) {
  const { listId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures user can only delete their own lists
  // CASCADE on FK will delete associated tasks
  const { error } = await supabase
    .from("task_lists")
    .delete()
    .eq("id", listId);

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}
