export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ADMIN_IDS = (process.env.ADMIN_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean); // isi user.id admin

export async function POST() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error id diinject di callbacks
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1 user 1 room
  let room = await prisma.chatRoom.findFirst({ where: { userId } });
  if (!room) {
    room = await prisma.chatRoom.create({
      data: { userId, title: `Konsultasi` },
    });
    await prisma.chatMember.create({
      data: { roomId: room.id, userId, role: "user" },
    });
    // daftarkan admin
    if (ADMIN_IDS.length) {
      await prisma.chatMember.createMany({
        data: ADMIN_IDS.map((aid) => ({ roomId: room!.id, userId: aid, role: "admin" })),
        skipDuplicates: true,
      });
    }
  }
  return NextResponse.json({ id: room.id });
}
