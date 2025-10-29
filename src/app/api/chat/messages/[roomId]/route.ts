export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// helper
async function ensureMember(roomId: string, userId: string) {
  const m = await prisma.chatMember.findFirst({
    where: { roomId, userId },
    select: { id: true },
  });
  return !!m;
}

// GET /api/chat/messages/[roomId]
export async function GET(_req: Request, ctx: { params: Promise<{ roomId: string }> }) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error injected in callbacks
  const userId = session?.user?.id as string | undefined;
  const userEmail = session?.user?.email as string | undefined;

  console.log("[GET messages] userId:", userId, "email:", userEmail);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ⬇️ WAJIB di-await
  const { roomId } = await ctx.params;

  // Admin can access all rooms
  const isAdmin = userEmail === "admin@gmail.com";
  console.log("[GET messages] isAdmin:", isAdmin, "roomId:", roomId);

  if (!isAdmin) {
    const allowed = await ensureMember(roomId, userId);
    console.log("[GET messages] allowed:", allowed);
    if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      body: true,
      createdAt: true,
      senderId: true,
      sender: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({ messages: rows });
}

// POST /api/chat/messages/[roomId]
export async function POST(req: Request, ctx: { params: Promise<{ roomId: string }> }) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error injected in callbacks
  const userId = session?.user?.id as string | undefined;
  const userEmail = session?.user?.email as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ⬇️ WAJIB di-await
  const { roomId } = await ctx.params;

  // Admin can send to all rooms
  const isAdmin = userEmail === "admin@gmail.com";
  if (!isAdmin) {
    const allowed = await ensureMember(roomId, userId);
    if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { body } = await req.json().catch(() => ({}));
  if (!body || typeof body !== "string") {
    return NextResponse.json({ error: "Pesan kosong" }, { status: 400 });
  }

  const msg = await prisma.message.create({
    data: { roomId, senderId: userId, body },
    select: {
      id: true,
      body: true,
      createdAt: true,
      senderId: true,
      sender: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({ message: msg });
}
