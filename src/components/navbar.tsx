// src/components/navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const SECTIONS = ["home", "service", "doctors", "about"] as const;

const nav = [
  { href: "/#home", label: "Home", id: "home" },
  { href: "/#service", label: "Service", id: "service" },
  { href: "/#doctors", label: "Doctors", id: "doctors" },
  { href: "/#about", label: "About", id: "about" },
];

function avatarSrc(name?: string | null, email?: string | null, image?: string | null) {
  if (image) return image;
  const label = name || email || "User";
  // fallback avatar via ui-avatars (tetap aman untuk public)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=dfe8f5&color=17202a&bold=true`;
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  const callbackUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname + window.location.search + window.location.hash;
    }
    return "/";
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-60% 0px -35% 0px", threshold: 0 });
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between px-5 pr-20 py-2">
        <Link href="/#home" className="relative flex items-start gap-2">
          <Image src="/image/logo.png" alt="Klinik" width={100} height={100} priority />
        </Link>

        <button className="p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          ☰
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const isOnHome = pathname === "/";
            const isActive = isOnHome && active === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-base font-semibold transition ${isActive ? "text-black drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]" : "text-gray-500 hover:text-black"}`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Auth area */}
          {status === "loading" && <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" aria-hidden />}

          {status === "unauthenticated" && (
            <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="rounded-full bg-gradient-to-b from-[#cfe0f5] to-[#a7c3e6] px-4 py-2 text-sm font-semibold text-gray-900 shadow">
              Sign in / Sign up
            </Link>
          )}

          {status === "authenticated" && session?.user && (
            <div className="relative flex items-center gap-3">
              {/* Avatar yang klik menuju profile */}
              <Link href="/profile" className="group rounded-full ring-1 ring-black/10 hover:ring-black/20 transition" aria-label="Buka profil">
                <Image
                  src={avatarSrc(session.user.name, session.user.email, session.user.image as string | null)}
                  alt={session.user.name || session.user.email || "User"}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              </Link>

              {/* Tombol logout kecil, biar tetap ada jalan keluar */}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold ring-1 ring-black/10 hover:ring-black/20" aria-label="Logout">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-800">
                {item.label}
              </Link>
            ))}

            {status === "unauthenticated" && (
              <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} onClick={() => setOpen(false)} className="w-max rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
                Sign in / Sign up
              </Link>
            )}

            {status === "authenticated" && session?.user && (
              <div className="flex items-center gap-3">
                <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2" aria-label="Buka profil">
                  <Image
                    src={avatarSrc(session.user.name, session.user.email, session.user.image as string | null)}
                    alt={session.user.name || session.user.email || "User"}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-black/10"
                  />
                  <span className="text-sm font-medium text-gray-700">Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    void signOut({ callbackUrl: "/" });
                  }}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
