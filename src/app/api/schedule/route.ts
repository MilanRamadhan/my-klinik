export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error injected in callbacks
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fd = await req.formData();
  const date = String(fd.get("date") || "");
  const time = String(fd.get("time") || "");
  const doctor = String(fd.get("doctor") || "dr-alexander");
  const note = String(fd.get("note") || "");

  if (!date || !time) return NextResponse.json({ error: "Tanggal/jam wajib" }, { status: 400 });

  const scheduledAt = new Date(`${date}T${time}:00Z`);
  if (Number.isNaN(scheduledAt.getTime())) return NextResponse.json({ error: "Tanggal/jam invalid" }, { status: 400 });

  // Cek tabrakan
  const conflict = await prisma.reservation.findFirst({
    where: { doctor, scheduledAt, status: { not: "CANCELLED" as any } },
    select: { id: true },
  });
  if (conflict) return NextResponse.json({ error: "Slot sudah terisi" }, { status: 409 });

  const created = await prisma.reservation.create({
    data: { userId, doctor, note, scheduledAt, status: "PENDING" as any },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
