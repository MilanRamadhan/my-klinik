const DATA = [
  { name: "Milan", avatar: "/avatar-milan.jpg", message: "Pelayanan sangat baik!" },
  { name: "Dewi", avatar: "/avatar-dewi.jpg", message: "Dokternya ramah dan jelas." },
  { name: "Raka", avatar: "/avatar-raka.jpg", message: "Antre cepat, puas." },
  { name: "Sinta", avatar: "/avatar-sinta.jpg", message: "Tempat bersih, staff helpful." },
];

export const testimonials = DATA.map((t) => ({
  quote: t.message,
  name: t.name,
  title: "Pasien", // isi label pendek; ganti sesuai kebutuhanmu
}));

export default function Testimonials() {
  return (
    <>
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900">
        What <span className="text-[#7aa6d8] drop-shadow-[0_3px_0_rgba(0,0,0,0.15)]">Clients</span> Say!
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {DATA.map((t, i) => (
          <article key={i} className="rounded-2xl bg-white p-5 shadow-[0_6px_0_rgba(0,0,0,0.15)] ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <img src={t.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}`} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
              <div className="font-semibold text-gray-900">{t.name}</div>
            </div>
            <p className="mt-3 text-gray-600">{t.message}</p>
          </article>
        ))}
      </div>
    </>
  );
}
