import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lists = await prisma.taskList.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { tasks: true } },
      tasks: { where: { completed: true }, select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = lists.map((list) => ({
    id: list.id,
    name: list.name,
    createdAt: list.createdAt,
    taskCount: list._count.tasks,
    completedCount: list.tasks.length,
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
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

    const list = await prisma.taskList.create({
      data: {
        name: trimmedName,
        userId: user.id,
      },
    });

    return NextResponse.json(list, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
