// src/hooks/useProtectedPage.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

/**
 * Hook untuk melindungi halaman yang memerlukan autentikasi
 * Gunakan di component yang perlu proteksi
 *
 * @example
 * export default function ProtectedPage() {
 *   useProtectedPage();
 *   return <div>Protected Content</div>;
 * }
 */
export function useProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      // Redirect ke login jika belum login
      router.push("/auth/login");
    }
  }, [router]);
}
