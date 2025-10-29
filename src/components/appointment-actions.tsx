"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AppointmentActions({ appointmentId, status }: { appointmentId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: "CONFIRMED" | "CANCELLED") {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal mengupdate status");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  if (status === "PENDING") {
    return (
      <>
        <button onClick={() => updateStatus("CONFIRMED")} disabled={loading} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50">
          {loading ? "..." : "Setujui"}
        </button>
        <button onClick={() => updateStatus("CANCELLED")} disabled={loading} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50">
          {loading ? "..." : "Tolak"}
        </button>
      </>
    );
  }

  if (status === "CONFIRMED") {
    return (
      <button onClick={() => updateStatus("CANCELLED")} disabled={loading} className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">
        {loading ? "..." : "Batalkan"}
      </button>
    );
  }

  return null;
}

export function CreateAppointmentButton({ patients }: { patients: { id: string; name: string | null; email: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    scheduledAt: "",
    doctor: "dr. Donny Mulizar, MKM",
    note: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.userId || !form.scheduledAt) {
      alert("Pasien dan jadwal harus diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setOpen(false);
        setForm({ userId: "", scheduledAt: "", doctor: "dr. Donny Mulizar, MKM", note: "" });
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal membuat janji temu");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
        + Buat Janji Temu
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Buat Janji Temu Manual</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pasien</label>
                <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
                  <option value="">Pilih Pasien</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal & Waktu</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dokter</label>
                <input type="text" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (opsional)</label>
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
