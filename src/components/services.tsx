"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone, Calendar, MessageCircle, Star } from "lucide-react";

type Item = {
  title: string;
  icon: React.ElementType;
  href: string;
  desc: string;
  requiresAuth?: boolean;
};

const items: Item[] = [
  { title: "Call for Appointment", icon: Phone, href: "https://wa.me/6285262427888?text=Halo,%20saya%20ingin%20membuat%20janji%20temu", desc: "Telepon klinik untuk booking cepat tanpa antre." },
  { title: "Get a Date & Serial", icon: Calendar, href: "/schedule", desc: "Pilih tanggal kunjungan dan dapatkan nomor antrean.", requiresAuth: true },
  { title: "Consultation", icon: MessageCircle, href: "/chat", desc: "Konsultasi langsung dengan dokter berpengalaman.", requiresAuth: true },
  { title: "Write a Review", icon: Star, href: "/reviews/new", desc: "Bagikan pengalamanmu agar bantu pasien lain.", requiresAuth: true },
];

export default function Services() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: Item) => {
    // Jika butuh auth dan belum login, redirect ke login
    if (item.requiresAuth && status === "unauthenticated") {
      e.preventDefault();
      router.push("/auth/login?callbackUrl=" + encodeURIComponent(item.href));
    }
  };

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
      {items.map((it) => (
        <Link
          key={it.title}
          href={it.href}
          onClick={(e) => handleClick(e, it)}
          target={it.href.startsWith("http") ? "_blank" : undefined}
          rel={it.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={it.title}
          className="relative group w-full mx-auto max-w-[280px] h-[140px] sm:h-[240px] md:h-[260px] rounded-2xl flex flex-col items-center justify-center
                     shadow-[10px_10px_20px_#e6e6e6,-10px_-10px_20px_#ffffff] transition-all duration-500
                     hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 overflow-hidden"
        >
          {/* Animated Gradient Blob (Hidden by default, shown on hover) */}
          <div className="absolute top-1/2 left-1/2 w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700
                          filter blur-[20px] z-0 animate-blob 
                          bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>

          {/* Glassy Background covering the whole card */}
          <div className="absolute inset-[2px] bg-white/95 backdrop-blur-xl rounded-[14px] z-10 flex flex-col items-center justify-center p-3 sm:p-6 transition-colors duration-300">
            
            {/* ICON */}
            <div
              className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm
                         transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100 group-hover:shadow-md"
            >
              <it.icon className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>

            {/* TITLE */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-[15px] leading-tight font-semibold text-gray-800 text-center transition-colors group-hover:text-black">
              {it.title}
            </p>

            {/* DESCRIPTION */}
            <div
              className="mt-2 w-full overflow-hidden text-[10px] sm:text-[13px] leading-relaxed text-gray-500 text-center
                         max-h-0 opacity-0 translate-y-2
                         transition-all duration-500 ease-in-out
                         group-hover:max-h-24 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block"
            >
              {it.desc}
            </div>
          </div>
        </Link>
      ))}

      {/* Inline keyframes animation */}
      <style>
        {`
          @keyframes blob {
            0% {
              transform: translate(-100%, -100%) scale(1);
            }
            25% {
              transform: translate(0%, -100%) scale(1.1);
            }
            50% {
              transform: translate(0%, 0%) scale(1);
            }
            75% {
              transform: translate(-100%, 0%) scale(0.9);
            }
            100% {
              transform: translate(-100%, -100%) scale(1);
            }
          }

          .animate-blob {
            animation: blob 8s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
