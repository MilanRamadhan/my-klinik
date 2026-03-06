export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SLOT_TIMES = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const d = url.searchParams.get("date"); // YYYY-MM-DD
  const doctor = url.searchParams.get("doctor") ?? "dr-alexander";
  if (!d) return NextResponse.json({ error: "date wajib" }, { status: 400 });

  // Query untuk hari tersebut dalam timezone lokal (GMT+0700)
  const dayStart = new Date(`${d}T00:00:00+07:00`);
  const dayEnd = new Date(`${d}T23:59:59+07:00`);

  console.log(`[SLOTS API] Querying range: ${dayStart} to ${dayEnd}`);

  // Hanya ambil reservasi yang sudah CONFIRMED (hanya yang dikonfirmasi admin yang dihitung terisi)
  const taken = await prisma.reservation.findMany({
    where: {
      doctor,
      status: "CONFIRMED",
      scheduledAt: { gte: dayStart, lte: dayEnd },
    },
    select: { scheduledAt: true, status: true },
  });

  console.log(`[SLOTS API] Date: ${d}, Found ${taken.length} reservations`);

  const takenSet = new Set(
    taken.map((r) => {
      const date = new Date(r.scheduledAt);
      // Gunakan jam lokal (bukan UTC) karena data tersimpan dalam GMT+0700
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const timeStr = `${hours}:${minutes}`;
      console.log(`[SLOTS API] Reservation: ${timeStr} (${r.status}) - Raw: ${r.scheduledAt}`);
      return timeStr;
    }),
  );

  const slots = SLOT_TIMES.map((t) => ({
    time: t,
    available: !takenSet.has(t),
  }));

  console.log(`[SLOTS API] Taken times:`, Array.from(takenSet));
  console.log(`[SLOTS API] Slots result:`, slots);

  return NextResponse.json({ date: d, doctor, slots });
}
