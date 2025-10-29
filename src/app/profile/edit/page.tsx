"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  bpjsNumber: string | null;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Profile>({ name: "", email: "", image: "", phone: "", bpjsNumber: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/profile", { cache: "no-store" });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      setForm({
        name: data.name ?? "",
        email: data.email,
        image: data.image ?? "",
        phone: data.phone ?? "",
        bpjsNumber: data.bpjsNumber ?? "",
      });
      setLoading(false);
    };
    void run();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name?.trim() || null,
      image: form.image?.trim() || null,
      phone: form.phone?.trim() || null,
      bpjsNumber: form.bpjsNumber?.trim() || null,
    };
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Gagal menyimpan");
      return;
    }
    router.push("/profile");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <div className="h-40 w-full animate-pulse rounded-2xl bg-gray-100" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 drop-shadow-[0_2px_0_rgba(0,0,0,0.12)]">Edit Profile</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.08)]">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <Field label="Nama">
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </Field>

        <Field label="Email" hint="Tidak dapat diubah">
          <input className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-50" value={form.email} disabled />
        </Field>

        <Field label="Nomor HP">
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </Field>

        <Field label="Nomor BPJS">
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.bpjsNumber ?? ""} onChange={(e) => setForm((f) => ({ ...f, bpjsNumber: e.target.value }))} />
        </Field>

        <Field label="Foto (URL opsional)">
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.image ?? ""} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." />
        </Field>

        <div className="flex items-center gap-3">
          <button className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Simpan</button>
          <button type="button" onClick={() => router.back()} className="rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-black/10 hover:ring-black/20">
            Batal
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {children}
    </div>
  );
}
