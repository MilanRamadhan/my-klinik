import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const patient = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!patient) {
    notFound();
  }

  const reservations = (await prisma.reservation.findMany({
    where: { userId: id },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  })) as any;

  return (
    <div className="p-8">
      <Link href="/admin/patients" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Kembali ke Daftar Pasien
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{patient.name || "Tanpa Nama"}</h1>
        <p className="text-gray-500 mt-1">{patient.email}</p>
        <p className="text-sm text-gray-400 mt-2">
          Terdaftar sejak{" "}
          {new Date(patient.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Riwayat Janji Temu</h2>
          <p className="text-sm text-gray-500 mt-1">Total {reservations.length} janji temu</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada riwayat janji temu
                  </td>
                </tr>
              ) : (
                reservations.map((res: any) => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(res.scheduledAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(res.scheduledAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{res.doctor || "-"}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{res.note || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
