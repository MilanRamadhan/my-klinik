# ✅ CHECKLIST - Yang Harus Dilakukan

## 📋 Setup Checklist

Ikuti step ini untuk setup backend & frontend:

### ☐ 1. Buat Project Supabase

- [ ] Buka https://supabase.com
- [ ] Login/Register
- [ ] Klik "New Project"
- [ ] Isi nama project: `my-klinik`
- [ ] Isi database password (simpan baik-baik!)
- [ ] Pilih region: Singapore
- [ ] Klik "Create new project"
- [ ] Tunggu ~2 menit

### ☐ 2. Enable Email Authentication

- [ ] Di dashboard Supabase, klik "Authentication"
- [ ] Klik "Providers"
- [ ] Pastikan "Email" toggle hijau (enabled)
- [ ] Klik "Save"

### ☐ 3. Copy Credentials

- [ ] Klik "Settings" (⚙️)
- [ ] Klik "API"
- [ ] Copy "Project URL" (https://xxxxx.supabase.co)
- [ ] Copy "anon/public key" (string panjang)

### ☐ 4. Isi File `.env.local`

- [ ] Buka file `.env.local` di root project
- [ ] Paste Project URL ke `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Paste API Key ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Save file

### ☐ 5. Install Dependencies

```bash
npm install
```

- [ ] Tunggu sampai selesai
- [ ] Tidak ada error

### ☐ 6. Run Development Server

```bash
npm run dev
```

- [ ] Muncul "Ready in X.Xs"
- [ ] Tidak ada error

### ☐ 7. Test di Browser

- [ ] Buka http://localhost:3000
- [ ] Website klinik muncul
- [ ] Klik "Sign in / Sign up"
- [ ] Klik "Daftar"
- [ ] Isi nama, email, password
- [ ] Klik "Daftar"
- [ ] Muncul "Registrasi berhasil!"
- [ ] Auto redirect ke login
- [ ] Login dengan email & password tadi
- [ ] Muncul nama di navbar (kanan atas)
- [ ] Test klik "Logout"
- [ ] Nama hilang dari navbar

### ☐ 8. Test Protected Pages

- [ ] Login dulu
- [ ] Akses http://localhost:3000/appointment
- [ ] Halaman muncul (tidak redirect)
- [ ] Akses http://localhost:3000/schedule
- [ ] Halaman muncul (tidak redirect)
- [ ] Logout
- [ ] Akses http://localhost:3000/appointment lagi
- [ ] Auto redirect ke login ✅

### ☐ 9. Verifikasi di Supabase

- [ ] Buka dashboard Supabase
- [ ] Klik "Authentication" > "Users"
- [ ] User yang tadi didaftarkan muncul disini ✅

---

## 🎉 SELESAI!

Jika semua checklist ✅, berarti:

- Backend & frontend sudah tersambung sempurna
- Authentication berfungsi dengan baik
- Protected pages bekerja
- Siap untuk development lanjutan

---

## 📚 Next Steps

Setelah setup berhasil:

### Development

- [ ] Buat form appointment yang fungsional
- [ ] Buat tabel di Supabase untuk menyimpan appointment
- [ ] Buat API untuk CRUD appointment
- [ ] Tambah fitur upload foto (jika perlu)
- [ ] Setup chat realtime (perlu buat table messages)

### Documentation

- [ ] Baca [BACKEND_README.md](./BACKEND_README.md) untuk API docs
- [ ] Baca [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) untuk deploy

### Deployment

- [ ] Setup environment variables di Vercel/Netlify
- [ ] Deploy ke production
- [ ] Test di production URL
- [ ] Monitor usage di Supabase dashboard

---

## 🐛 Jika Ada Masalah

**Error di step 1-4 (Supabase)**
→ Baca [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) section "Langkah 1"

**Error di step 5-6 (Install/Run)**
→ Cek terminal untuk error detail
→ Pastikan Node.js versi 18+ installed

**Error di step 7-8 (Testing)**
→ Buka console browser (F12) > Console
→ Lihat error message
→ Baca [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) section "Troubleshooting"

---

**Good luck! 🚀**

Print checklist ini dan centang satu per satu!
