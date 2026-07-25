import Image from "next/image";

export default function BpjsBanner() {
  return (
    <div className="my-10 w-full max-w-4xl mx-auto rounded-2xl bg-white p-4 md:p-6 shadow-[3px_5px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/5 flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-4">
      <div className="relative h-16 w-32 md:h-24 md:w-40">
        <Image src="/image/bpjs.jpg" alt="BPJS Kesehatan" fill sizes="(max-width: 768px) 100px, 160px" className="object-contain" />
      </div>
      <p className="text-sm md:text-lg font-semibold text-gray-800 text-center md:text-left">
        Kami Melayani Pasien <span className="text-[#2f8d46]">BPJS Kesehatan</span>
      </p>
    </div>
  );
}
