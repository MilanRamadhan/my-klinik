import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full min-h-screen pb-20 flex flex-col items-center justify-center bg-white">
      <section className=" grid grid-cols-1 md:grid-cols-2 items-center pl-30 ">
        {/* Copy kiri */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]">
            Layanan <span className="text-[#7aa6d8]">Kesehatan</span> Terpercaya
            <br /> untuk Keluarga Anda
          </h1>

          <p className="mt-5 text-gray-600 max-w-xl">Dapatkan layanan kesehatan terbaik dari dr. Alexander, M.K.M. Beliau siap melayani kebutuhan kesehatan Anda dan seluruh keluarga dengan keahlian dan pengalaman.</p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/service"
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg
                         bg-gradient-to-b from-[#7fa6c9] to-[#9fc0dc] hover:opacity-95"
            >
              Service
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-xl font-semibold text-gray-900 bg-white shadow">
              Contact
            </Link>
          </div>
        </div>

        {/* Gambar kanan */}
        <div className="relative h-[360px] md:h-[650px]">
          <Image src="/image/dokter.png" alt="Dokter" fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      </section>
    </main>
  );
}
