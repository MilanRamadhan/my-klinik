"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/service", label: "Service" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white backdrop-blur border-b">
      <div className="pl-5 pr-20 py-2 flex items-center justify-between">
        <Link href="/" className="flex relative items-start gap-2">
          <Image src="/image/logo.png" alt="Klinik" width={100} height={100} priority />
        </Link>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          ☰
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={`text-sm font-semibold transition ${pathname === item.href ? "text-gray-900 drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]" : "text-gray-700 hover:text-gray-900"}`}>
              {item.label}
            </Link>
          ))}
          <Link href="/auth" className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-b from-[#cfe0f5] to-[#a7c3e6] text-gray-900 shadow">
            Sign in / Sign up
          </Link>
        </nav>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-gray-800">
                {item.label}
              </Link>
            ))}
            <Link href="/auth" className="text-sm font-semibold px-4 py-2 rounded-full bg-gray-100 w-max">
              Sign in / Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
