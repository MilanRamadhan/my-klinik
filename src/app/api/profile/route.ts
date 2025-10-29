export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true, phone: true, bpjsNumber: true, createdAt: true, updatedAt: true },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: { name?: string; phone?: string | null; bpjsNumber?: string | null; image?: string | null } = {};

  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.phone === "string" || body.phone === null) data.phone = body.phone?.trim() || null;
  if (typeof body.bpjsNumber === "string" || body.bpjsNumber === null) data.bpjsNumber = body.bpjsNumber?.trim() || null;
  if (typeof body.image === "string" || body.image === null) data.image = body.image?.trim() || null;

  // validasi ringan
  if (data.phone && data.phone.length > 32) return NextResponse.json({ error: "Phone terlalu panjang" }, { status: 400 });
  if (data.bpjsNumber && data.bpjsNumber.length > 32) return NextResponse.json({ error: "No BPJS terlalu panjang" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data,
    select: { id: true, name: true, email: true, image: true, phone: true, bpjsNumber: true, updatedAt: true },
  });

  return NextResponse.json(updated);
}
