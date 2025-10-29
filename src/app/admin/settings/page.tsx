export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Pengaturan Klinik</h1>
      <p className="text-gray-500 mt-1">Kelola informasi dan konfigurasi klinik</p>

      {/* Clinic Profile */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profil Klinik</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Klinik</label>
            <input type="text" defaultValue="My Klinik" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <textarea rows={3} defaultValue="Jl. Kesehatan No. 123, Jakarta" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
              <input type="tel" defaultValue="+62 21 1234 5678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Klinik</label>
              <input type="email" defaultValue="info@myklinik.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Simpan Perubahan</button>
        </div>
      </div>

      {/* Working Hours */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Jam Operasional</h2>
        <p className="text-sm text-gray-500 mb-4">Jam praktek: Senin - Jumat 08:00 - 17:00, Sabtu 09:00 - 13:00 (Fixed)</p>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <p className="font-medium">Senin - Jumat</p>
              <p className="text-xs text-gray-500">08:00 - 17:00</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <p className="font-medium">Sabtu</p>
              <p className="text-xs text-gray-500">09:00 - 13:00</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <p className="font-medium">Minggu & Libur Nasional</p>
              <p className="text-xs text-gray-500">Tutup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Management */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atur Hari Libur</h2>
        <p className="text-sm text-gray-500 mb-4">Tandai tanggal khusus yang klinik tutup (cuti, libur nasional, dll)</p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <input type="date" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <input type="text" placeholder="Keterangan (opsional)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Tambah</button>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Daftar Hari Libur</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">25 Desember 2025</p>
                  <p className="text-xs text-gray-500">Natal</p>
                </div>
                <button className="text-xs text-red-600 hover:text-red-700 font-medium">Hapus</button>
              </div>
              <p className="text-sm text-gray-400 text-center py-4">Belum ada hari libur ditambahkan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Notifikasi</h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-gray-700">Kirim email konfirmasi ke pasien</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-gray-700">Kirim pengingat 24 jam sebelum janji temu</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-gray-700">Kirim SMS konfirmasi (fitur premium)</span>
          </label>
        </div>

        <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Simpan Pengaturan Notifikasi</button>
      </div>
    </div>
  );
}
