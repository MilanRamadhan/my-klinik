"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Util kecil2an
const ID_MONTH = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const ID_DOW = ["MING", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function fmtDateISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fmtDateHuman(d: Date) {
  return `${d.getDate()} ${ID_MONTH[d.getMonth()]}, ${d.getFullYear()}`;
}

function monthMatrix(anchor: Date) {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const first = new Date(y, m, 1);
  const firstDOW = (first.getDay() + 6) % 7; // Senin=0
  const start = new Date(y, m, 1 - firstDOW);
  const cells: { d: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ d, inMonth: d.getMonth() === m });
  }
  return cells;
}

const FALLBACK_SLOTS = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
const DURATION_MIN = 30;

export default function SchedulePage() {
  const router = useRouter();

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [myUpcoming, setMyUpcoming] = useState<{ id: string; scheduledAt: string } | null>(null);
  const [myReservations, setMyReservations] = useState<
    Array<{
      id: string;
      scheduledAt: string;
      status: string;
      doctor: string | null;
    }>
  >([]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const cells = useMemo(() => monthMatrix(viewMonth), [viewMonth]);
  const canSubmit = !!(selectedDate && selectedTime);

  // Navigasi bulan
  function goPrev() {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() - 1);
    setViewMonth(d);
  }
  function goNext() {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() + 1);
    setViewMonth(d);
  }

  // Load ketersediaan slot ketika tanggal dipilih
  useEffect(() => {
    (async () => {
      if (!selectedDate) {
        setSlots([]);
        return;
      }
      try {
        const d = fmtDateISO(selectedDate);
        const r = await fetch(`/api/schedule/slots?date=${encodeURIComponent(d)}`, { cache: "no-store" });
        if (!r.ok) {
          setSlots(FALLBACK_SLOTS.map((t) => ({ time: t, available: true })));
          return;
        }
        const j = await r.json();
        setSlots(j.slots);
        // reset time kalau slot terpilih tidak available
        if (selectedTime && j.slots.find((s: any) => s.time === selectedTime && !s.available)) {
          setSelectedTime(null);
        }
      } catch {
        setSlots(FALLBACK_SLOTS.map((t) => ({ time: t, available: true })));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Ambil janji mendatang milik user
  async function refreshMyUpcoming() {
    try {
      const r = await fetch("/api/schedule/my", { cache: "no-store" });
      if (!r.ok) {
        setMyUpcoming(null);
        setMyReservations([]);
        return;
      }
      const rows = await r.json();
      setMyUpcoming(rows?.[0] ?? null);
      setMyReservations(rows || []);
    } catch {
      setMyUpcoming(null);
      setMyReservations([]);
    }
  }
  useEffect(() => {
    void refreshMyUpcoming();
  }, []); // awal
  useEffect(() => {
    void refreshMyUpcoming();
  }, [msg]); // setelah create/cancel

  // Submit appointment
  async function submit() {
    if (!canSubmit || saving) return;
    setSaving(true);
    setMsg(null);

    const fd = new FormData();
    fd.append("date", fmtDateISO(selectedDate!));
    fd.append("time", selectedTime!);
    fd.append("doctor", "dr-alexander");
    fd.append("note", "");

    const res = await fetch("/api/schedule", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));

    setSaving(false);
    if (res.status === 401) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/schedule")}`);
      return;
    }
    if (!res.ok) {
      setMsg({ type: "err", text: data?.error || "Gagal membuat reservasi." });
      return;
    }
    setMsg({ type: "ok", text: "Reservasi berhasil dibuat." });
  }

  // Cancel appointment aku (kalau ada)
  async function cancelMine() {
    if (!myUpcoming) return;
    try {
      const r = await fetch(`/api/schedule/${myUpcoming.id}`, { method: "DELETE" });
      if (r.ok) setMsg({ type: "ok", text: "Reservasi dibatalkan." });
      else setMsg({ type: "err", text: "Gagal membatalkan." });
    } catch {
      setMsg({ type: "err", text: "Gagal membatalkan." });
    }
  }

  // Hapus pilihan (bukan membatalkan di server)
  function clearSelection() {
    setSelectedDate(null);
    setSelectedTime(null);
    setMsg(null);
    setSlots([]);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Top breadcrumb-ish */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 drop-shadow-[0_1px_0_rgba(0,0,0,0.12)]">Buat Janji Temu</h1>
        <Link href="/#services" className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-black/10 hover:ring-black/20">
          Kembali
        </Link>
      </div>

      {msg && <div className={`mb-4 rounded-md p-3 text-sm ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
        {/* Kalender */}
        <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.06)] p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={goPrev} className="rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold">
              ‹
            </button>
            <div className="text-lg font-semibold">
              {ID_MONTH[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </div>
            <button onClick={goNext} className="rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-gray-500 pb-2">
            {ID_DOW.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {useMemo(() => monthMatrix(viewMonth), [viewMonth]).map(({ d, inMonth }, i) => {
              const sel = selectedDate && fmtDateISO(d) === fmtDateISO(selectedDate);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(new Date(d))}
                  className={["aspect-square rounded-lg text-sm", inMonth ? "text-gray-900" : "text-gray-400", "hover:bg-gray-100", sel ? "bg-[#d9e7f7] font-semibold ring-1 ring-[#9fc0dc]" : "bg-white"].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </section>

        {/* Pilih jam */}
        <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.06)] p-4 md:p-6">
          <h3 className="mb-4 text-base font-extrabold text-gray-900">Pick a time</h3>
          <div className="flex flex-col gap-3">
            {(slots.length ? slots : FALLBACK_SLOTS.map((t) => ({ time: t, available: true }))).map(({ time, available }) => {
              const active = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => available && setSelectedTime(time)}
                  disabled={!available}
                  className={[
                    "w-full rounded-xl px-5 py-3 text-left font-semibold ring-1 transition",
                    active
                      ? "bg-[#7aa6d8] text-white ring-transparent shadow-[0_6px_0_rgba(0,0,0,0.15)]"
                      : available
                      ? "bg-white text-gray-900 ring-black/10 hover:ring-black/20"
                      : "bg-gray-100 text-gray-400 ring-black/10 cursor-not-allowed",
                  ].join(" ")}
                >
                  {time}
                  {!available && <span className="ml-2 text-xs">(full)</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Detail appointment */}
        <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.06)] p-4 md:p-6">
          <h3 className="mb-4 text-base font-extrabold text-gray-900">Detail Appointment</h3>

          <div className="space-y-4">
            <DetailItem label="Date" value={selectedDate ? fmtDateHuman(selectedDate) : "—"} />
            <DetailItem label="Time" value={selectedTime ?? "—"} />
            <DetailItem label="Duration" value={`Maks ${DURATION_MIN} min`} />
          </div>

          <button disabled={!canSubmit || saving} onClick={submit} className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {saving ? "Processing..." : "Make an Appointment"}
          </button>
        </section>
      </div>

      {/* Bar bawah */}
      <div className="mt-6 rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.06)] p-4 md:p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600">Your Appointment</div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-900">
          <span>{selectedDate ? fmtDateHuman(selectedDate) : myUpcoming ? fmtDateHuman(new Date(myUpcoming.scheduledAt)) : "—"}</span>
          <span>{selectedTime ? selectedTime : myUpcoming ? new Date(myUpcoming.scheduledAt).toISOString().substring(11, 16) : "—"}</span>
          <span>{`${DURATION_MIN} min`}</span>
        </div>
        <div className="flex gap-3">
          {myUpcoming ? (
            <button onClick={cancelMine} className="rounded-xl bg-[#e67a73] px-4 py-2 font-semibold text-white hover:opacity-90">
              Cancel Appointment
            </button>
          ) : (
            <button onClick={clearSelection} className="rounded-xl bg-[#e67a73] px-4 py-2 font-semibold text-white hover:opacity-90">
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Daftar Reservasi Saya */}
      {myReservations.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Riwayat Reservasi Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myReservations.map((reservation) => {
              const schedDate = new Date(reservation.scheduledAt);
              const statusColors = {
                PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
                CONFIRMED: "bg-green-100 text-green-800 border-green-300",
                CANCELLED: "bg-red-100 text-red-800 border-red-300",
              };
              const statusText = {
                PENDING: "Menunggu Konfirmasi",
                CONFIRMED: "Dikonfirmasi",
                CANCELLED: "Dibatalkan",
              };
              return (
                <div key={reservation.id} className="rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.06)] p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{fmtDateHuman(schedDate)}</p>
                      <p className="text-xs text-gray-500">{schedDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColors[reservation.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
                      {statusText[reservation.status as keyof typeof statusText] || reservation.status}
                    </span>
                  </div>
                  {reservation.doctor && <p className="text-xs text-gray-600">Dokter: {reservation.doctor}</p>}
                  {reservation.status === "PENDING" && <p className="text-xs text-gray-500 mt-2 italic">Mohon menunggu konfirmasi dari admin</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl ring-1 ring-black/10 bg-gradient-to-r from-[#a7c3e6]/60 to-white p-4">
      <div className="text-xs text-gray-700">{label}</div>
      <div className="text-base font-semibold text-gray-900">{value}</div>
    </div>
  );
}
