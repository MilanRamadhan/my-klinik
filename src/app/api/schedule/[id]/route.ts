export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error injected in callbacks
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const r = await prisma.reservation.findUnique({ where: { id: params.id }, select: { userId: true } });
  if (!r || r.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.reservation.update({
    where: { id: params.id },
    data: { status: "CANCELLED" as any, cancelledAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
