// Server Action: simpan ulasan (sementara console.log)
async function submitReview(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "");
  const message = String(formData.get("message") || "");
  const rating = Number(formData.get("rating") || 5);

  // TODO: ganti dengan simpan ke DB (Prisma, Supabase, dll)
  console.log("New review:", { name, message, rating, date: new Date().toISOString() });
}

export default function NewReviewPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold">Tulis Ulasan</h1>
      <p className="mt-2 text-gray-600">Pengalamanmu membantu pasien lain. Tulis seperlunya, jangan pidato.</p>

      <form action={submitReview} className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.15)]">
        <div>
          <label className="block text-sm font-medium">Nama</label>
          <input name="name" required className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Nama kamu" />
        </div>

        <div>
          <label className="block text-sm font-medium">Rating</label>
          <select name="rating" defaultValue={5} className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Ulasan</label>
          <textarea name="message" required rows={4} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Tulis ulasan singkat..." />
        </div>

        <button className="w-full rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:opacity-90">Kirim Ulasan</button>
      </form>
    </div>
  );
}
