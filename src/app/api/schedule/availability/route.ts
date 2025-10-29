export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // YYYY-MM-DD
  if (!date) return NextResponse.json({ error: "date is required" }, { status: 400 });

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59`);

  const taken = await prisma.reservation.findMany({
    where: { scheduledAt: { gte: start, lte: end } },
    select: { scheduledAt: true },
  });

  const times = taken.map((t) => t.scheduledAt.toISOString().substring(11, 16)); // "HH:MM"
  return NextResponse.json({ taken: Array.from(new Set(times)) });
}
