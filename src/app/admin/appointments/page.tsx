import { prisma } from "@/lib/prisma";
import { AppointmentActions, CreateAppointmentButton } from "@/components/appointment-actions";
import { AppointmentCalendar } from "@/components/appointment-calendar";

export const revalidate = 0;

export default async function AppointmentsPage() {
  const appointments = (await prisma.reservation.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    take: 50,
  })) as any;

  // Get all patients for create appointment form
  const patients = (await prisma.user.findMany({
    where: { email: { not: "admin@gmail.com" } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  })) as any;

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a: any) => a.status === "PENDING").length,
    confirmed: appointments.filter((a: any) => a.status === "CONFIRMED").length,
    cancelled: appointments.filter((a: any) => a.status === "CANCELLED").length,
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Janji Temu</h1>
          <p className="text-gray-500 mt-1">Kelola semua booking pasien</p>
        </div>
        <CreateAppointmentButton patients={patients} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} color="gray" />
        <StatCard label="Menunggu" value={stats.pending} color="yellow" />
        <StatCard label="Dikonfirmasi" value={stats.confirmed} color="green" />
        <StatCard label="Dibatalkan" value={stats.cancelled} color="red" />
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Semua</button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Pending</button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Dikonfirmasi</button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Dibatalkan</button>
      </div>

      {/* Appointments Table */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pasien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jadwal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Belum ada janji temu
                </td>
              </tr>
            ) : (
              appointments.map((apt: any) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{apt.user.name || "Tanpa Nama"}</p>
                      <p className="text-sm text-gray-500">{apt.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {new Date(apt.scheduledAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(apt.scheduledAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{apt.doctor || "-"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <AppointmentActions appointmentId={apt.id} status={apt.status} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Calendar View */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tampilan Kalender</h2>
        <AppointmentCalendar appointments={appointments} />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors = {
    gray: "bg-gray-100 text-gray-900",
    yellow: "bg-yellow-100 text-yellow-900",
    green: "bg-green-100 text-green-900",
    red: "bg-red-100 text-red-900",
  };

  return (
    <div className={`${colors[color as keyof typeof colors]} rounded-lg p-4`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${variants[status as keyof typeof variants]}`}>{status}</span>;
}
