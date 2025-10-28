// src/app/api/logout/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    if (access_token) {
      // Logout dari Supabase
      await supabaseAdmin.auth.signOut();
    }

    return NextResponse.json({ message: "Logout berhasil." });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
