import Image from "next/image";

type Item = { image: string; title: string; desc: string };
const LEFT: Item[] = [
  {
    image: "/image/checkup.png",
    title: "Pemeriksaan Umum",
    desc: "Mendiagnosis dan mengobati berbagai penyakit umum, membantu Anda kembali beraktivitas dengan cepat.",
  },
  {
    image: "/image/eye.png",
    title: "Cek Mata",
    desc: "Mendeteksi masalah penglihatan sejak dini dan memberi rekomendasi perawatan yang optimal.",
  },
];
const RIGHT: Item[] = [
  {
    image: "/image/emergency.png",
    title: "Layanan Gawat Darurat",
    desc: "Siap membantu Anda dengan penanganan cepat dan tepat untuk kondisi darurat ringan.",
  },
  {
    image: "/image/consult.png",
    title: "Konsultasi & Pemeriksaan Rutin",
    desc: "Menjaga kesehatan Anda secara proaktif dengan deteksi dini dan saran personal.",
  },
];

function Row({ item }: { item: Item }) {
  return (
    <div className="py-6">
      <div className="flex items-start gap-4">
        <Image src={item.image} alt="" width={44} height={44} className="h-11 w-11 rounded-xl object-contain" />
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 drop-shadow-[0_2px_0_rgba(0,0,0,0.12)]">{item.title}</h3>
          <p className="mt-2 text-gray-600 max-w-prose">{item.desc}</p>
        </div>
      </div>
      <hr className="mt-6 border-gray-200" />
    </div>
  );
}

export default function DoctorSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center pt-10 pb-10 text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]">Dokter</h2>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left column */}
          <div>
            {LEFT.map((i) => (
              <Row key={i.title} item={i} />
            ))}
          </div>

          {/* Center doctor image */}
          <div className="relative mx-auto h-[360px] w-full max-w-[420px] lg:h-[520px]">
            <Image src="/image/dokter.png" alt="Dokter" fill className="object-contain scale-150" sizes="(max-width:1024px) 80vw, 33vw" priority={false} />
          </div>

          {/* Right column */}
          <div>
            {RIGHT.map((i) => (
              <Row key={i.title} item={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
