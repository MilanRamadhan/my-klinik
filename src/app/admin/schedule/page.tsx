export default function SchedulePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Manajemen Ketersediaan</h1>
      <p className="text-gray-500 mt-1">Blokir jadwal untuk hari libur atau cuti</p>

      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Blokir Slot Jadwal</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jam Mulai</label>
              <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jam Selesai</label>
              <input type="time" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan (opsional)</label>
            <input type="text" placeholder="Contoh: Libur Nasional, Cuti" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Blokir Jadwal</button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Jadwal yang Diblokir</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-sm text-center py-8">Belum ada jadwal yang diblokir</p>
        </div>
      </div>
    </div>
  );
}
