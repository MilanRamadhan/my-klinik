"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SECTIONS = ["home", "service", "doctors", "about"] as const;

const nav = [
  { href: "/#home", label: "Home", id: "home" },
  { href: "/#service", label: "Service", id: "service" },
  { href: "/#doctors", label: "Doctors", id: "doctors" },
  { href: "/#about", label: "About", id: "about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  // Highlight berdasarkan section yang terlihat
  useEffect(() => {
    if (pathname !== "/") return; // cuma observe di Home
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      // area tengah layar; tweak sesuai tinggi navbar
      { rootMargin: "-60% 0px -35% 0px", threshold: 0 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Tutup menu mobile saat klik item
  function handleNavClick() {
    setOpen(false);
  }

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
                className={`text-base font-semibold transition ${isActive ? "text-black-900 drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]" : "text-gray-500 hover:text-black-900"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/auth" className="rounded-full bg-gradient-to-b from-[#cfe0f5] to-[#a7c3e6] px-4 py-2 text-sm font-semibold text-gray-900 shadow">
            Sign in / Sign up
          </Link>
        </nav>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
            {nav.map((item) => {
              const isOnHome = pathname === "/";
              const isActive = isOnHome && active === item.id;
              return (
                <Link key={item.href} href={item.href} scroll={false} onClick={handleNavClick} className={`text-sm font-semibold ${isActive ? "text-gray-900" : "text-gray-800"}`}>
                  {item.label}
                </Link>
              );
            })}
            <Link href="/auth" onClick={handleNavClick} className="w-max rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
              Sign in / Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
