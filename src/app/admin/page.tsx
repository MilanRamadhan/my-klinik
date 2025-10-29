import { prisma } from "@/lib/prisma";
import { WeeklyVisitsChart } from "@/components/weekly-visits-chart";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Fetch real stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await prisma.reservation.count({
    where: {
      scheduledAt: { gte: today, lt: tomorrow },
    },
  });

  const pendingAppointments = await prisma.reservation.count({
    where: { status: "PENDING" },
  });

  const recentAppointments = await prisma.reservation.findMany({
    take: 5,
    orderBy: { scheduledAt: "asc" },
    where: { scheduledAt: { gte: new Date() } },
    include: { user: { select: { name: true, email: true } } },
  });

  // Weekly visits data for chart
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Get appointments for last 7 days grouped by day
  const weeklyAppointments = await prisma.reservation.findMany({
    where: { scheduledAt: { gte: weekAgo } },
    orderBy: { scheduledAt: "asc" },
  });

  // Group by day
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const weeklyData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = weeklyAppointments.filter((apt) => {
      const aptDate = new Date(apt.scheduledAt);
      return aptDate >= date && aptDate < nextDay;
    }).length;

    weeklyData.push({
      day: dayNames[date.getDay()],
      count,
    });
  }

  const weeklyVisits = weeklyAppointments.length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-500 mt-1">Ringkasan klinik hari ini</p>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Janji Temu Hari Ini</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{todayAppointments}</p>
            </div>
            <div className="text-4xl">🗓️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Menunggu Konfirmasi</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingAppointments}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kunjungan 7 Hari</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{weeklyVisits}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Janji Temu Mendatang</h2>
        </div>
        <div className="p-6">
          {recentAppointments.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada janji temu mendatang</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{apt.user.name || apt.user.email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.scheduledAt).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${apt.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : apt.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Visits Chart */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grafik Kunjungan (7 Hari Terakhir)</h2>
        <WeeklyVisitsChart data={weeklyData} />
      </div>
    </div>
  );
}
