# 🚀 Panduan Cepat - Backend Auth Supabase

## Langkah 1: Setup Supabase (5 menit)

1. **Buka https://supabase.com** dan buat akun/login
2. **Klik "New Project"**
   - Name: `my-klinik` (atau terserah)
   - Password: buat password database
   - Region: pilih Singapore atau terdekat
3. **Tunggu project selesai dibuat** (~2 menit)
4. **Buka Settings > API**
   - Copy **Project URL**
   - Copy **anon/public key**

## Langkah 2: Setup Project (2 menit)

1. **Buat file `.env.local`** di root folder project:

```bash
NEXT_PUBLIC_SUPABASE_URL=paste_project_url_disini
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_key_disini
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random_string_apapun_minimal_32_karakter
```

2. **Install dependencies** (jika belum):

```bash
npm install
```

3. **Jalankan server**:

```bash
npm run dev
```

## Langkah 3: Test (1 menit)

1. **Buka** http://localhost:3000
2. **Klik "Sign in / Sign up"** di navbar
3. **Klik "Daftar"**
4. **Isi form**:
   - Nama: Nama Anda
   - Email: email@example.com
   - Password: min. 6 karakter
5. **Klik "Daftar"**
6. **Setelah berhasil, klik "Masuk"**
7. **Login dengan email & password tadi**
8. **Sekarang navbar akan menampilkan nama Anda**
9. **Klik "Logout"** untuk keluar

## ✅ Selesai!

Backend auth sudah berfungsi! 🎉

### Yang Sudah Berfungsi:

- ✅ Register user baru
- ✅ Login
- ✅ Logout
- ✅ Session management
- ✅ Protected pages (contoh: /appointment)
- ✅ User info di navbar

### Jika Ada Error:

**Error: Invalid API credentials**
→ Cek lagi `.env.local`, pastikan URL dan Key benar

**Error: User already registered**
→ Email sudah dipakai, gunakan email lain atau hapus user di Supabase dashboard

**Halaman kosong/error**
→ Pastikan `npm run dev` sudah running dan tidak ada error di terminal

## 📚 Dokumentasi Lengkap

- **Setup detail**: Baca [SETUP_SUPABASE.md](./SETUP_SUPABASE.md)
- **API & Kode**: Baca [BACKEND_README.md](./BACKEND_README.md)
- **Perubahan**: Baca [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)

## 🆘 Butuh Bantuan?

1. Cek console browser (F12) untuk error
2. Cek terminal untuk server error
3. Baca dokumentasi di file MD lainnya
4. Cek Supabase dashboard > Authentication > Users

---

Selamat menggunakan! 🎊
