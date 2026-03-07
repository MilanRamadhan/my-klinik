export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error injected in callbacks
    const userId = session?.user?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fd = await req.formData();
    const date = String(fd.get("date") || "");
    const time = String(fd.get("time") || "");
    const doctor = String(fd.get("doctor") || "dr-donny-mulizar");
    const note = String(fd.get("note") || "");

    console.log(`[SCHEDULE POST] Received request:`, { date, time, doctor, userId });

    if (!date || !time) return NextResponse.json({ error: "Tanggal/jam wajib" }, { status: 400 });

    // Parse dengan timezone lokal (GMT+0700) untuk konsistensi dengan data existing
    // Format: YYYY-MM-DDTHH:mm:ss+07:00
    const scheduledAt = new Date(`${date}T${time}:00+07:00`);
    if (Number.isNaN(scheduledAt.getTime())) return NextResponse.json({ error: "Tanggal/jam invalid" }, { status: 400 });

    console.log(`[SCHEDULE POST] Creating reservation for ${date} ${time} -> ${scheduledAt}`);

    // Cek apakah user sudah punya reservasi aktif di HARI yang sama
    const dayStart = new Date(`${date}T00:00:00+07:00`);
    const dayEnd = new Date(`${date}T23:59:59+07:00`);

    const existingReservationOnSameDay = await prisma.reservation.findFirst({
      where: {
        userId,
        status: { in: ["CONFIRMED", "PENDING"] },
        scheduledAt: { gte: dayStart, lte: dayEnd },
      },
      select: { id: true, scheduledAt: true, status: true },
    });

    if (existingReservationOnSameDay) {
      console.log(`[SCHEDULE POST] User already has reservation on ${date}: ${existingReservationOnSameDay.id}`);
      return NextResponse.json(
        {
          error: "Anda sudah memiliki reservasi di hari ini. Silakan pilih hari lain atau batalkan reservasi yang ada.",
        },
        { status: 409 },
      );
    }

    // Cek tabrakan - hanya reservasi yang sudah CONFIRMED (disetujui admin)
    // PENDING tidak dihitung sebagai terisi karena belum dikonfirmasi

    // Debug: Tampilkan semua reservasi di slot ini
    const allReservationsInSlot = await prisma.reservation.findMany({
      where: {
        doctor,
        scheduledAt,
      },
      select: { id: true, status: true, userId: true },
    });
    console.log(`[SCHEDULE POST] All reservations in slot ${scheduledAt}:`, allReservationsInSlot);

    const conflict = await prisma.reservation.findFirst({
      where: {
        doctor,
        scheduledAt,
        status: "CONFIRMED", // Hanya CONFIRMED yang block slot
      },
      select: { id: true, status: true },
    });
    if (conflict) {
      console.log(`[SCHEDULE POST] Conflict found (CONFIRMED reservation): ${conflict.id}`);
      return NextResponse.json({ error: "Slot sudah terisi oleh pasien lain yang telah dikonfirmasi" }, { status: 409 });
    }

    console.log(`[SCHEDULE POST] No CONFIRMED conflict found. Slot is available for booking.`);

    console.log(`[SCHEDULE POST] Creating reservation with data:`, {
      userId,
      doctor,
      scheduledAt: scheduledAt.toISOString(),
      status: "PENDING",
    });

    const created = await prisma.reservation.create({
      data: {
        userId,
        doctor,
        note,
        scheduledAt,
        status: "PENDING",
      },
      select: { id: true },
    });

    console.log(`[SCHEDULE POST] Successfully created reservation: ${created.id}`);

    return NextResponse.json({ ok: true, id: created.id });
  } catch (error: any) {
    console.error("[SCHEDULE POST] Error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat membuat reservasi",
        details: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
