// src/hooks/useProtectedPage.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect ke login jika belum login
      const currentPath = window.location.pathname;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);
}
