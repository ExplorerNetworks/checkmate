import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

async function getOwnedTask(
  listId: string,
  taskId: string,
  userId: string
) {
  const list = await prisma.taskList.findUnique({
    where: { id: listId },
  });
  if (!list || list.userId !== userId) return null;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });
  if (!task || task.taskListId !== listId) return null;

  return task;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string; taskId: string }> }
) {
  const { listId, taskId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await getOwnedTask(listId, taskId, user.id);
  if (!task) {
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

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
    });

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
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await getOwnedTask(listId, taskId, user.id);
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return NextResponse.json({ message: "Deleted" });
}
