export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error injected in callbacks
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json([], { status: 200 });

  const now = new Date();
  const rows = await prisma.reservation.findMany({
    where: { userId, status: { not: "CANCELLED" as any }, scheduledAt: { gte: now } },
    orderBy: { scheduledAt: "asc" },
    select: { id: true, doctor: true, scheduledAt: true, status: true, durationMin: true },
  });
  return NextResponse.json(rows);
}
