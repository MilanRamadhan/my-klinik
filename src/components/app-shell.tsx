// src/components/app-shell.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Sembunyikan Navbar untuk /auth/* dan /admin/*
  const hideNav = pathname.startsWith("/auth") || pathname.startsWith("/admin");

  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}
