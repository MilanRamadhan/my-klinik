// src/components/app-shell.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Sembunyikan Navbar untuk semua route di /auth/*
  const hideNav = pathname.startsWith("/auth");

  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}
