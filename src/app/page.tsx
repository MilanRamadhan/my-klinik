import Image from "next/image";
import Link from "next/link";
import Services from "@/components/services";
import BpjsBanner from "@/components/bpjs-banner";
import DoctorSection from "@/components/doctor-section";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { testimonials } from "../components/testimonials";

export default function Home() {
  return (
    <main className="w-full min-h-screen pb-10 flex flex-col items-center justify-center bg-white">
      <section className=" grid grid-cols-1 md:grid-cols-2 items-center pl-30 pb-15 pt-10">
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

      {/* SECTION PELAYANAN: hanya grid card, tidak ada card pembungkus section */}
      <section className="pt-10">
        <div className="mx-auto max-w-7xl px-4 py-12 pb-0">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]">Pelayanan Klinik</h2>
          <Services /> {/* grid 4 card link: Call, Schedule, Consultation, Write Review */}
        </div>
      </section>

      {/* Banner BPJS tipis, bukan card besar halaman */}
      <section className="">
        <div className="mx-auto max-w-7xl px-4 pt-0">
          <BpjsBanner />
        </div>
      </section>

      {/* Testimonials: grid card kecil-kecil */}
      <section>
        <div>
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900">
            What <span className="text-[#7aa6d8] drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]">Clients</span> Say!
          </h2>

          <div
            id="testimonials"
            className="mt-2 rounded-2xl bg-white/40
                       backdrop-blur-sm relative overflow-hidden"
          >
            <InfiniteMovingCards
              items={testimonials}
              direction="left" // "left" | "right"
              speed="fast" // "slow" | "normal" | "fast"
              pauseOnHover={true} // opsional; default true
              className="p-4"
            />
          </div>
        </div>
      </section>
      <section className="">
        <div className="mx-auto max-w-7xl px-4">
          <DoctorSection />
        </div>
      </section>
    </main>
  );
}
