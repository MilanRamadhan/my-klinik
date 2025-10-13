import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

type ContactInfo = {
  title: string;
  desc: string;
  href?: string; // tel:, mailto:, maps link
  display?: string; // teks yang ditampilkan kalau beda dari href
  icon: React.ReactNode;
};

const CONTACTS: ContactInfo[] = [
  {
    title: "Visit Us",
    desc: "Jl. PTPN I, Kb. Baru, Kec. Langsa Baro, Kota Langsa, Aceh 24416",
    href: "https://maps.google.com/?q=Jl. PTPN I, Kb. Baru, Langsa",
    display: "Buka di Maps",
    icon: <MapPin className="h-8 w-8 text-[#7aa6d8]" />,
  },
  {
    title: "Call Us",
    desc: "Kami siap bantu di jam kerja.",
    href: "tel:+6285262427888",
    display: "+62 852 6242 7888",
    icon: <Phone className="h-8 w-8 text-[#7aa6d8]" />,
  },
  {
    title: "Contact Us",
    desc: "Butuh informasi cepat? Kirim email.",
    href: "mailto:klinik@gmail.com",
    display: "klinik@gmail.com",
    icon: <Mail className="h-8 w-8 text-[#7aa6d8]" />,
  },
];

export default function ContactSection() {
  return (
    <section className="relative">
      {/* Banner tipis dengan foto + overlay gradient */}
      <div className="relative h-[220px] w-full">
        <div className="" />
        <div className="absolute inset-0 grid place-items-center">
          <h2 className="text-center pt-10 pb-10 text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]">Contact Us</h2>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-14 -mt-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CONTACTS.map((c) => (
              <article
                key={c.title}
                className="rounded-2xl bg-white p-6 shadow-[3px_5px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transition
                           hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.08)]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-b from-[#cfe0f5] to-[#a7c3e6]">{c.icon}</div>
                  <h3 className="text-xl font-extrabold text-gray-900 drop-shadow-[0_2px_0_rgba(0,0,0,0.12)]">{c.title}</h3>
                  <p className="mt-2 text-gray-600 min-h-[48px]">{c.desc}</p>

                  {c.href ? (
                    <Link
                      href={c.href}
                      className="mt-4 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {c.display ?? c.href}
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
