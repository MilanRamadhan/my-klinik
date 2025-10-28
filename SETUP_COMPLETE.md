# 🚀 Setup Lengkap - Panduan Step by Step

## ⚠️ PENTING: Baca Ini Dulu!

File `.env.local` sudah dibuat dengan template. Anda **HARUS** mengisi dengan credentials Supabase yang benar.

---

## 📝 Langkah 1: Setup Supabase (10 menit)

### 1.1 Buat Project Supabase

1. Buka browser, ke https://supabase.com
2. Klik **"Start your project"** atau **"Sign In"** (jika sudah punya akun)
3. Klik **"New Project"**
4. Isi form:
   - **Name**: `my-klinik` (atau nama bebas)
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih **Southeast Asia (Singapore)** atau terdekat
   - **Pricing Plan**: Pilih **Free** (sudah cukup)
5. Klik **"Create new project"**
6. Tunggu ~2 menit sampai project selesai dibuat

### 1.2 Dapatkan API Credentials

1. Setelah project selesai, di dashboard Supabase
2. Klik **⚙️ Settings** (di sidebar kiri bawah)
3. Klik **API** (di menu settings)
4. Anda akan lihat:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: String panjang (mulai dengan `eyJ...`)
5. **COPY** kedua nilai ini (akan dipakai di step berikutnya)

### 1.3 Enable Email Authentication

1. Di dashboard Supabase, klik **🔐 Authentication** (di sidebar)
2. Klik **Providers**
3. Pastikan **Email** sudah enabled (toggle hijau)
4. Scroll ke bawah, klik **Save** jika ada perubahan

### 1.4 Konfigurasi Email Settings (Optional tapi Recommended)

1. Masih di **Authentication** > **Providers** > **Email**
2. Scroll ke **Email Templates**
3. Anda bisa customize email confirmation (nanti)
4. Untuk development, bisa skip dulu

---

## 📝 Langkah 2: Konfigurasi Project (5 menit)

### 2.1 Edit File `.env.local`

1. Buka file `.env.local` di root project (sudah ada)
2. **Ganti** nilai-nilai berikut dengan credentials dari Supabase:

```bash
# Ganti dengan Project URL Anda
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Ganti dengan anon/public key Anda
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# Biarkan default untuk development
NEXTAUTH_URL=http://localhost:3000

# Generate random string (minimal 32 karakter)
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters-here
```

### 2.2 Generate NEXTAUTH_SECRET (Optional)

Cara generate random string:

**Windows (Git Bash):**

```bash
openssl rand -base64 32
```

**Atau gunakan string random apapun minimal 32 karakter:**

```
my-secret-key-12345678901234567890
```

### 2.3 Save File

Pastikan file `.env.local` sudah tersimpan!

---

## 📝 Langkah 3: Install Dependencies (2 menit)

```bash
npm install
```

Tunggu sampai selesai.

---

## 📝 Langkah 4: Jalankan Development Server (1 menit)

```bash
npm run dev
```

Tunggu sampai muncul:

```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## 📝 Langkah 5: Test Aplikasi (5 menit)

### 5.1 Buka Browser

1. Buka http://localhost:3000
2. Website klinik akan muncul

### 5.2 Register User Baru

1. Klik **"Sign in / Sign up"** di navbar (kanan atas)
2. Klik **"Daftar"**
3. Isi form:
   - **Nama**: Nama Anda
   - **Email**: email@example.com (gunakan email asli Anda)
   - **Password**: minimal 6 karakter
4. Klik **"Daftar"**
5. Akan muncul pesan **"Registrasi berhasil!"**
6. Otomatis redirect ke halaman login

### 5.3 Login

1. Isi email & password yang tadi didaftarkan
2. Klik **"Masuk"**
3. Akan redirect ke homepage
4. **Cek navbar** - nama Anda akan muncul di kanan atas!

### 5.4 Test Protected Pages

1. Klik menu atau buka:
   - http://localhost:3000/appointment
   - http://localhost:3000/schedule
   - http://localhost:3000/consultation
   - http://localhost:3000/chat
2. Halaman akan terbuka (karena Anda sudah login)
3. Coba **Logout** dari navbar
4. Coba akses halaman tadi lagi
5. Akan **redirect ke login** otomatis ✅

### 5.5 Verifikasi di Supabase Dashboard

1. Buka dashboard Supabase
2. Klik **🔐 Authentication** > **Users**
3. User yang baru didaftarkan akan muncul disini!

---

## ✅ Selesai!

Jika semua step berhasil, berarti backend & frontend sudah **tersambung sempurna**! 🎉

---

## 🎯 Fitur Yang Sudah Berfungsi

- ✅ **Register** - Daftar user baru
- ✅ **Login** - Masuk dengan email & password
- ✅ **Logout** - Keluar dari sistem
- ✅ **Protected Pages** - Halaman yang perlu login
- ✅ **Session Management** - Session tersimpan di localStorage
- ✅ **User Info** - Nama user muncul di navbar
- ✅ **Auto Redirect** - Redirect ke login jika belum login

---

## 🐛 Troubleshooting

### Error: "Invalid API credentials"

**Solusi**:

- Cek `.env.local` apakah URL dan Key sudah benar
- Copy ulang dari Supabase dashboard
- Restart dev server (`Ctrl+C` lalu `npm run dev`)

### Error: "User already registered"

**Solusi**:

- Email sudah dipakai
- Gunakan email lain
- Atau hapus user di Supabase dashboard (Authentication > Users)

### Error: "Failed to fetch"

**Solusi**:

- Cek koneksi internet
- Cek Supabase project masih active
- Restart dev server

### Halaman blank atau tidak bisa login

**Solusi**:

1. Buka Console browser (F12)
2. Lihat error di tab Console
3. Clear localStorage: `localStorage.clear()` di Console
4. Refresh browser
5. Coba register ulang

### Session hilang setelah refresh

**Solusi**:

- Cek localStorage di DevTools (F12 > Application > Local Storage)
- Pastikan ada item `auth_session`
- Jika tidak ada, login ulang

---

## 📚 Next Steps

Setelah setup berhasil:

1. **Kustomisasi halaman protected** (appointment, schedule, dll)
2. **Tambah fitur database** untuk menyimpan appointment
3. **Setup chat realtime** (perlu buat table di Supabase)
4. **Deploy ke production** (Vercel/Netlify)

Baca dokumentasi lengkap:

- [BACKEND_README.md](./BACKEND_README.md) - API Documentation
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deployment guide

---

## 💡 Tips

1. **Jangan commit** file `.env.local` ke Git (sudah ada di `.gitignore`)
2. **Backup** credentials Supabase Anda
3. **Test logout** secara berkala untuk memastikan session management bekerja
4. **Monitor Supabase** usage di dashboard (free tier: 50K MAU)

---

**Selamat! Backend authentication Anda sudah siap digunakan! 🚀**

Jika ada masalah, buka issue atau hubungi developer.
