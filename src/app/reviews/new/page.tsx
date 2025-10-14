// src/app/reviews/new/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReviewForm from "@/components/review-form";

async function submitReview(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "");
  const message = String(formData.get("message") || "");
  const rating = Number(formData.get("rating") || 5);

  // TODO: simpan ke DB di sini (Prisma/Supabase/dll)
  console.log("New review:", { name, message, rating, date: new Date().toISOString() });

  redirect("/reviews/new?submitted=1");
}

export default function NewReviewPage({ searchParams }: { searchParams?: { submitted?: string } }) {
  const isSubmitted = searchParams?.submitted === "1";

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      {/* NAVIGASI BALIK */}
      <Link href="/#service" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900" scroll={false}>
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Tulis Ulasan</h1>
      <p className="mt-2 text-gray-600">Pengalamanmu bantu pasien lain mengambil keputusan. Tulis singkat, jelas, dan jujur.</p>

      {isSubmitted && <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">Terima kasih! Ulasanmu sudah diterima.</div>}

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Form di kiri (span 3 kolom) */}
        <div className="md:col-span-3">
          <ReviewForm action={submitReview} />
        </div>

        {/* Panel tips di kanan (span 2 kolom) */}
        <aside className="md:col-span-2">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold">Tips menulis ulasan</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
              <li>Sebutkan layanan yang dipakai dan waktu kunjungan.</li>
              <li>Fokus ke hal yang membantu: kecepatan, keramahan, kejelasan dokter.</li>
              <li>Hindari data pribadi sensitif. Jangan unggah info medis rahasia.</li>
            </ul>
            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-medium">Privasi</p>
              <p className="mt-1">Dengan mengirim ulasan, kamu setuju konten ditampilkan publik (tanpa email/telepon).</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
