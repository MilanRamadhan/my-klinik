import Link from "next/link";

type Item = {
  title: string;
  icon: string; // ganti ke komponen ikon kalau mau
  href: string;
  desc: string; // info singkat yang ditampilkan saat hover/focus
};

const items: Item[] = [
  { title: "Call for Appointment", icon: "📞", href: "/appointment", desc: "Telepon klinik untuk booking cepat tanpa antre." },
  { title: "Get a Date & Serial", icon: "🗓️", href: "/schedule", desc: "Pilih tanggal kunjungan dan dapatkan nomor antrean." },
  { title: "Consultation", icon: "💬", href: "/consultation", desc: "Konsultasi langsung dengan dokter berpengalaman." },
  { title: "Write a Review", icon: "✍️", href: "/reviews/new", desc: "Bagikan pengalamanmu agar bantu pasien lain." },
];

export default function Services() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      {items.map((it) => (
        <Link
          key={it.title}
          href={it.href}
          aria-label={it.title}
          className="flex items-center group block w-full max-w-[250px] h-[260px] rounded-2xl bg-white p-6 ring-1 ring-black/5
                     shadow-[3px_5px_5px_rgba(0,0,0,0.15)] transition
                     hover:shadow-[3px_5px_5px_rgba(0,0,0,0.15)]1   
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7aa6d8]"
        >
          {/* wrapper vertikal biar stabil tingginya */}
          <div className="flex flex-col items-center text-center">
            {/* IKON: naik sedikit saat hover/focus */}
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50
                            text-3xl transition-transform "
            >
              {it.icon}
            </div>

            {/* JUDUL: tetap di bawah deskripsi */}
            <p className="mt-4 text-lg font-semibold text-gray-800">{it.title}</p>

            {/* DESKRIPSI: muncul DI BAWAH ikon, di dalam card */}
            {/* pakai max-h + opacity agar halus dan tidak menggeser layout liar */}
            <div
              className="mt-3 w-full overflow-hidden text-sm text-gray-600
                         max-h-0 opacity-0 translate-y-1
                         transition-all duration-500 ease-in-out
                         group-hover:max-h-24 group-hover:opacity-100 group-hover:translate-y-0"
            >
              {it.desc}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
