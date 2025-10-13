import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t bg-white">
      {/* garis gradasi tipis biar berkelas */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + deskripsi singkat */}
          <div>
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#7aa6d8]">Klinik</span> Sehat
            </div>
            <p className="mt-3 text-sm text-gray-600">Layanan kesehatan terpercaya untuk keluarga. Cepat, jelas, manusiawi. Janji temu tanpa drama.</p>
            {/* social */}
            <div className="mt-4 flex items-center gap-3">
              <Social href="https://wa.me/6285262427888" label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </Social>
              <Social href="mailto:klinik@gmail.com" label="Email">
                <Mail className="h-5 w-5" />
              </Social>
              <Social href="https://instagram.com" label="Instagram">
                <Instagram className="h-5 w-5" />
              </Social>
              <Social href="https://facebook.com" label="Facebook">
                <Facebook className="h-5 w-5" />
              </Social>
            </div>
          </div>

          {/* Navigasi cepat */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Menu</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <FooterLink href="/">Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/service">Service</FooterLink>
              </li>
              <li>
                <FooterLink href="/doctors">Doctors</FooterLink>
              </li>
              <li>
                <FooterLink href="/about">About</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Contact</FooterLink>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-[#7aa6d8]" />
                <a href="tel:+6285262427888" className="hover:underline">
                  +62 852 6242 7888
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-[#7aa6d8]" />
                <a href="mailto:klinik@gmail.com" className="hover:underline">
                  klinik@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[#7aa6d8]" />
                <a href="https://maps.google.com/?q=Jl. PTPN I, Kb. Baru, Langsa" target="_blank" rel="noreferrer" className="hover:underline">
                  Jl. PTPN I, Kb. Baru, Kec. Langsa Baro, Kota Langsa, Aceh 24416
                </a>
              </li>
            </ul>
          </div>

          {/* Jadwal / CTA */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Jam Operasional</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>Senin–Jumat: 16.00–21.00</li>
              <li>Sabtu-Minggu: Tutup</li>
            </ul>
            <Link href="/appointment" className="mt-5 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              Buat Janji
            </Link>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-gray-500 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Klinik Sehat. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-700 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-700 hover:underline">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-gray-700 hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  const ext = href.startsWith("http");
  return (
    <Link
      href={href}
      aria-label={label}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noreferrer" : undefined}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 shadow
                 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {children}
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-gray-900 hover:underline">
      {children}
    </Link>
  );
}
