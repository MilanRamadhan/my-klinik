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
  const [monthBookings, setMonthBookings] = useState<Record<string, number>>({});

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const today = new Date();
  const cells = useMemo(() => monthMatrix(viewMonth), [viewMonth]);

  // Check apakah user sudah punya reservasi aktif di hari yang dipilih
  const hasActiveReservationOnSelectedDate = useMemo(() => {
    if (!selectedDate) return false;
    const selectedDateStr = fmtDateISO(selectedDate);
    const hasActive = myReservations.some((r) => {
      const resDateStr = fmtDateISO(new Date(r.scheduledAt));
      const isActive = r.status === "PENDING" || r.status === "CONFIRMED";
      const isSameDate = resDateStr === selectedDateStr;

      // Debug logging
      if (isSameDate) {
        console.log(`[hasActiveReservationOnSelectedDate] Found reservation on ${selectedDateStr}:`, {
          id: r.id,
          status: r.status,
          isActive,
          scheduledAt: r.scheduledAt,
        });
      }

      return isSameDate && isActive;
    });

    console.log(`[hasActiveReservationOnSelectedDate] Selected date: ${selectedDateStr}, Has active: ${hasActive}`);
    return hasActive;
  }, [myReservations, selectedDate]);

  const canSubmit = !!(selectedDate && selectedTime && !hasActiveReservationOnSelectedDate);

  // Filter reservasi untuk tampilan: 1 minggu ke belakang atau semua
  const displayedReservations = useMemo(() => {
    if (showAllHistory) {
      return myReservations;
    }
    // Tampilkan hanya 1 minggu ke belakang
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return myReservations.filter((r) => {
      const resDate = new Date(r.scheduledAt);
      return resDate >= oneWeekAgo;
    });
  }, [myReservations, showAllHistory]);

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

  // Refresh month bookings (untuk update dots di kalender)
  async function refreshMonthBookings() {
    try {
      const year = viewMonth.getFullYear();
      const month = viewMonth.getMonth();
      const lastDay = new Date(year, month + 1, 0);
      const timestamp = Date.now();

      const promises = [];
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = fmtDateISO(date);
        promises.push(
          fetch(`/api/schedule/slots?date=${encodeURIComponent(dateStr)}&t=${timestamp}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
              if (data?.slots) {
                const bookedCount = data.slots.filter((s: any) => !s.available).length;
                return { date: dateStr, count: bookedCount };
              }
              return { date: dateStr, count: 0 };
            })
            .catch(() => ({ date: dateStr, count: 0 })),
        );
      }

      const results = await Promise.all(promises);
      const bookingsMap: Record<string, number> = {};
      results.forEach((r) => {
        if (r.count > 0) {
          bookingsMap[r.date] = r.count;
        }
      });
      setMonthBookings(bookingsMap);
    } catch {
      setMonthBookings({});
    }
  }

  // Load bookings untuk bulan yang ditampilkan
  useEffect(() => {
    void refreshMonthBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMonth]);

  // Load ketersediaan slot ketika tanggal dipilih
  useEffect(() => {
    (async () => {
      if (!selectedDate) {
        setSlots([]);
        return;
      }
      try {
        const d = fmtDateISO(selectedDate);
        const timestamp = Date.now();
        const r = await fetch(`/api/schedule/slots?date=${encodeURIComponent(d)}&t=${timestamp}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
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

        // reset time jika waktu yang dipilih sudah lewat (untuk hari ini)
        const isToday = fmtDateISO(selectedDate) === fmtDateISO(today);
        if (isToday && selectedTime) {
          const currentTime = new Date().toTimeString().substring(0, 5);
          if (selectedTime <= currentTime) {
            setSelectedTime(null);
          }
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
      // Tambahkan timestamp untuk cache busting
      const timestamp = Date.now();
      const r = await fetch(`/api/schedule/my?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (!r.ok) {
        setMyUpcoming(null);
        setMyReservations([]);
        return;
      }
      const rows = await r.json();

      console.log(
        `[refreshMyUpcoming] Fetched ${rows.length} reservations:`,
        rows.map((r: any) => ({
          id: r.id,
          date: fmtDateISO(new Date(r.scheduledAt)),
          time: new Date(r.scheduledAt).toTimeString().substring(0, 5),
          status: r.status,
        })),
      );

      // Filter untuk upcoming: hanya PENDING/CONFIRMED yang belum lewat
      const now = new Date();
      const activeUpcoming = rows.find((row: any) => {
        const schedDate = new Date(row.scheduledAt);
        return (row.status === "PENDING" || row.status === "CONFIRMED") && schedDate >= now;
      });

      setMyUpcoming(activeUpcoming ?? null);
      setMyReservations(rows || []);
    } catch {
      setMyUpcoming(null);
      setMyReservations([]);
    }
  }

  useEffect(() => {
    void refreshMyUpcoming();
  }, []); // awal

  // Submit appointment
  async function submit() {
    if (!canSubmit || saving) return;
    setSaving(true);
    setMsg(null);

    try {
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
        const errorMsg = data?.details ? `${data.error}: ${data.details}` : data?.error || "Gagal membuat reservasi.";
        setMsg({ type: "err", text: errorMsg });
        console.error("[SUBMIT] Error response:", data);
        return;
      }
      setMsg({ type: "ok", text: "Reservasi berhasil dibuat." });

      // Langsung refresh data setelah berhasil create
      await refreshMyUpcoming();
      await refreshMonthBookings();

      // Clear selection setelah berhasil
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error: any) {
      setSaving(false);
      console.error("[SUBMIT] Network or other error:", error);
      setMsg({ type: "err", text: "Terjadi kesalahan koneksi. Silakan coba lagi." });
    }
  }

  // Cancel appointment aku (kalau ada)
  async function cancelMine() {
    if (!myUpcoming) return;
    try {
      const r = await fetch(`/api/schedule/${myUpcoming.id}`, { method: "DELETE" });
      if (r.ok) {
        setMsg({ type: "ok", text: "Reservasi dibatalkan." });
        // Langsung refresh data setelah cancel
        await refreshMyUpcoming();
        await refreshMonthBookings();
      } else {
        setMsg({ type: "err", text: "Gagal membatalkan." });
      }
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
              const isToday = fmtDateISO(d) === fmtDateISO(today);
              const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const dateKey = fmtDateISO(d);
              const bookedCount = monthBookings[dateKey] || 0;
              const hasBookings = bookedCount > 0;

              return (
                <button
                  key={i}
                  onClick={() => !isPast && setSelectedDate(new Date(d))}
                  disabled={isPast}
                  className={[
                    "aspect-square rounded-lg text-sm transition-all relative",
                    inMonth ? (isPast ? "text-gray-300" : "text-gray-900") : "text-gray-400",
                    isPast ? "cursor-not-allowed opacity-40" : "hover:bg-gray-100",
                    sel ? "bg-[#d9e7f7] font-semibold ring-2 ring-[#9fc0dc]" : isToday ? "bg-white font-bold ring-2 ring-teal-500" : isPast ? "bg-gray-50" : "bg-white",
                  ].join(" ")}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{d.getDate()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Pilih jam */}
        <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_0_rgba(0,0,0,0.06)] p-4 md:p-6">
          <h3 className="mb-4 text-base font-extrabold text-gray-900">Pilih Jam</h3>
          <div className="flex flex-col gap-3">
            {(slots.length ? slots : FALLBACK_SLOTS.map((t) => ({ time: t, available: true }))).map(({ time, available }) => {
              const active = selectedTime === time;
              // Check if time has passed (only for today)
              const isToday = selectedDate && fmtDateISO(selectedDate) === fmtDateISO(today);
              const currentTime = new Date().toTimeString().substring(0, 5); // HH:MM
              const isPastTime = isToday && time <= currentTime;
              const isBooked = !available && !isPastTime; // Slot terisi oleh pasien lain
              const isDisabled = !available || !!isPastTime;

              return (
                <button
                  key={time}
                  onClick={() => !isDisabled && setSelectedTime(time)}
                  disabled={isDisabled}
                  className={[
                    "w-full rounded-xl px-5 py-3 text-left font-semibold ring-1 transition relative",
                    active
                      ? "bg-[#7aa6d8] text-white ring-transparent shadow-[0_6px_0_rgba(0,0,0,0.15)]"
                      : isDisabled
                        ? "bg-gray-100 text-gray-400 ring-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-900 ring-black/10 hover:ring-black/20 hover:bg-gray-50",
                  ].join(" ")}
                  style={isDisabled ? { opacity: 0.5 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span>{time}</span>
                    {isBooked && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">Sudah Terisi</span>}
                    {isPastTime && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Sudah Lewat</span>}
                  </div>
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

          <button disabled={!canSubmit || saving || hasActiveReservationOnSelectedDate} onClick={submit} className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {saving ? "Processing..." : hasActiveReservationOnSelectedDate ? "Sudah Ada Reservasi di Tanggal Ini" : "Make an Appointment"}
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Riwayat Reservasi Anda</h2>
              <p className="text-xs text-gray-500 mt-1">{showAllHistory ? `Menampilkan semua ${myReservations.length} reservasi` : `Menampilkan ${displayedReservations.length} reservasi (1 minggu terakhir)`}</p>
            </div>
            {myReservations.length > displayedReservations.length && !showAllHistory && (
              <button onClick={() => setShowAllHistory(true)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Lihat Semua ({myReservations.length})
              </button>
            )}
            {showAllHistory && (
              <button onClick={() => setShowAllHistory(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Tampilkan Terbaru
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedReservations.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>Tidak ada reservasi dalam 1 minggu terakhir</p>
                {myReservations.length > 0 && (
                  <button onClick={() => setShowAllHistory(true)} className="mt-2 text-sm text-blue-600 hover:underline">
                    Lihat semua riwayat ({myReservations.length})
                  </button>
                )}
              </div>
            ) : (
              displayedReservations.map((reservation) => {
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
              })
            )}
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
