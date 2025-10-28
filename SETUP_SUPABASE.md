# Setup Supabase untuk My-Klinik

## 1. Buat Project di Supabase

1. Buka https://supabase.com dan login
2. Klik "New Project"
3. Isi detail project:
   - Name: my-klinik (atau nama lain)
   - Database Password: (buat password yang kuat)
   - Region: pilih yang terdekat
4. Tunggu project selesai dibuat

## 2. Enable Email Authentication

1. Di dashboard Supabase, buka **Authentication** > **Providers**
2. Pastikan **Email** provider sudah enabled
3. Konfigurasi email settings jika diperlukan

## 3. Setup Database (Optional)

Supabase Auth sudah menyediakan tabel users secara otomatis.
Jika ingin custom fields, bisa update di **Authentication** > **Users**.

## 4. Dapatkan API Keys

1. Buka **Settings** > **API**
2. Copy:
   - **Project URL** (URL)
   - **anon/public** key (API Key)

## 5. Setup Environment Variables

1. Buat file `.env.local` di root project
2. Copy dari `.env.local.example`
3. Isi dengan credentials dari Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key
```

Generate NEXTAUTH_SECRET dengan:

```bash
openssl rand -base64 32
```

## 6. Testing

1. Jalankan development server:

```bash
npm run dev
```

2. Buka http://localhost:3000/auth/register
3. Daftar dengan email dan password
4. Login dengan credentials yang sama

## 7. Verifikasi di Supabase

1. Buka **Authentication** > **Users** di dashboard Supabase
2. User yang baru didaftarkan akan muncul disini

## Troubleshooting

### Error: Invalid API Key

- Pastikan API key di `.env.local` benar
- Pastikan menggunakan `anon/public` key, bukan `service_role` key

### Error: Email already registered

- User dengan email tersebut sudah terdaftar
- Gunakan email lain atau hapus user di dashboard Supabase

### Error: Password too short

- Password minimal 6 karakter

## Fitur yang Tersedia

✅ Register user baru
✅ Login dengan email & password
✅ Logout
✅ Session management dengan localStorage
✅ Protected routes (bisa ditambahkan)
✅ User info di navbar

## Next Steps

Untuk fitur tambahan:

- Password reset
- Email verification
- Social login (Google, GitHub, dll)
- Protected pages/routes
- User profile management

Baca dokumentasi Supabase: https://supabase.com/docs/guides/auth
