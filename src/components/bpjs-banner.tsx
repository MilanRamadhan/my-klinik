import Image from "next/image";

export default function BpjsBanner() {
  return (
    <div className="my-10 rounded-2xl bg-white px-20  h-25 w-170 shadow-[3px_5px_5px_rgba(0,0,0,0.15)] ring-1 ring-black/5 flex items-center justify-between gap-4">
      <div className="relative h-30 w-40">
        <Image src="/image/bpjs.jpg" alt="BPJS Kesehatan" fill className="object-contain" />
      </div>
      <p className="text-base md:text-lg font-semibold text-gray-800">
        Kami Melayani Pasien <span className="text-[#2f8d46]">BPJS Kesehatan</span>
      </p>
    </div>
  );
}
