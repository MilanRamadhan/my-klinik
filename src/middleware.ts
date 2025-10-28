// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Halaman yang memerlukan autentikasi
const protectedRoutes = ["/appointment", "/schedule", "/consultation", "/chat", "/reviews/new"];

// Halaman auth yang tidak boleh diakses jika sudah login
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah user sudah login (cek dari cookie atau header)
  // Note: Untuk implementasi yang lebih baik, gunakan cookie dari Supabase
  // Saat ini kita hanya redirect ke login jika belum login

  // Jika mengakses protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Untuk sekarang, kita tidak bisa cek session karena ada di localStorage
    // Ini akan ditangani di client-side dengan useEffect
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|image).*)",
  ],
};
