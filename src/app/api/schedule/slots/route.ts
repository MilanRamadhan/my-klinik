export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SLOT_TIMES = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const d = url.searchParams.get("date"); // YYYY-MM-DD
  const doctor = url.searchParams.get("doctor") ?? "dr-alexander";
  if (!d) return NextResponse.json({ error: "date wajib" }, { status: 400 });

  const dayStart = new Date(`${d}T00:00:00.000Z`);
  const dayEnd = new Date(`${d}T23:59:59.999Z`);

  const taken = await prisma.reservation.findMany({
    where: {
      doctor,
      status: { not: "CANCELLED" as any },
      scheduledAt: { gte: dayStart, lte: dayEnd },
    },
    select: { scheduledAt: true },
  });

  const takenSet = new Set(
    taken.map((r) => r.scheduledAt.toISOString().substring(11, 16)) // "HH:MM"
  );

  const slots = SLOT_TIMES.map((t) => ({ time: t, available: !takenSet.has(t) }));
  return NextResponse.json({ date: d, doctor, slots });
}
