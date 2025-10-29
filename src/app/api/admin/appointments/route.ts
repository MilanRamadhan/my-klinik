import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions as any)) as any;

  // Only admin can create appointments
  if (!session?.user?.email || session.user.email !== "admin@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, scheduledAt, doctor, note } = await req.json();

  if (!userId || !scheduledAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        scheduledAt: new Date(scheduledAt),
        doctor: doctor || null,
        note: note || null,
        status: "CONFIRMED", // Admin-created appointments are auto-confirmed
        durationMin: 30,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ reservation });
  } catch (error: any) {
    console.error("Error creating appointment:", error);

    // Check for unique constraint violation (duplicate slot)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slot sudah terisi" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
