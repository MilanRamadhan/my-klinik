export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error injected in callbacks
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json([], { status: 200 });

  // Ambil semua reservasi user termasuk yang CANCELLED untuk riwayat lengkap
  const rows = await prisma.reservation.findMany({
    where: { userId },
    orderBy: { scheduledAt: "desc" }, // Urutkan dari yang terbaru
    select: { id: true, doctor: true, scheduledAt: true, status: true, durationMin: true },
  });
  return NextResponse.json(rows);
}
