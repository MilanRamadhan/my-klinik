import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0;

export default async function PatientsPage() {
  const patients = (await prisma.user.findMany({
    where: {
      email: { not: "admin@gmail.com" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { Reservation: true },
      },
    },
    take: 100,
  })) as any;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pasien</h1>
          <p className="text-gray-500 mt-1">Daftar semua pasien terdaftar</p>
        </div>
        <div className="text-2xl font-bold text-blue-600">{patients.length} Pasien</div>
      </div>

      {/* Patients Table */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terdaftar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Janji Temu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Belum ada pasien terdaftar
                </td>
              </tr>
            ) : (
              patients.map((patient: any) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{patient.name || "Tanpa Nama"}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{patient.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-blue-600">{patient._count.Reservation} kali</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/patients/${patient.id}`} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 inline-block">
                      Lihat Riwayat
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
