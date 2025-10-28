# 🏥 Klinik dr. Donny Mulizar, MKM

Website klinik dengan sistem autentikasi menggunakan **Next.js 15** dan **Supabase**.

## ✨ Fitur

- ✅ **Login & Register** dengan Supabase Auth
- ✅ **Session Management** dengan localStorage
- ✅ **Protected Pages** (Appointment, Schedule, dll)
- ✅ **User Info di Navbar**
- ✅ **Responsive Design** dengan Tailwind CSS
- ✅ **Type-safe** dengan TypeScript

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project di https://supabase.com
2. Copy `.env.local.example` menjadi `.env.local`
3. Isi dengan credentials Supabase Anda

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

### 3. Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000 🎉

## 📚 Dokumentasi

- **[QUICK_START.md](./QUICK_START.md)** - Panduan cepat mulai dari awal
- **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)** - Setup Supabase detail
- **[BACKEND_README.md](./BACKEND_README.md)** - Dokumentasi API & Backend
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - Rangkuman perubahan
- **[COMPARISON.md](./COMPARISON.md)** - Perbandingan sistem lama vs baru

## 🔐 API Endpoints

### Register

```bash
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Logout

```bash
POST /api/logout
Content-Type: application/json

{
  "access_token": "..."
}
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Session**: localStorage + JWT

## 📁 Struktur Project

```
my-klinik/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── register/route.ts      # Register endpoint
│   │   │   ├── login/route.ts         # Login endpoint
│   │   │   └── logout/route.ts        # Logout endpoint
│   │   ├── auth/
│   │   │   ├── login/page.tsx         # Login page
│   │   │   └── register/page.tsx      # Register page
│   │   ├── appointment/page.tsx       # Protected page example
│   │   └── layout.tsx                 # Root layout
│   ├── components/
│   │   ├── auth-provider.tsx          # Auth context
│   │   └── navbar.tsx                 # Navigation
│   ├── lib/
│   │   ├── auth.ts                    # Auth helpers
│   │   └── supabase.ts                # Supabase client
│   └── hooks/
│       └── useProtectedPage.ts        # Protected page hook
├── .env.local.example                 # Environment template
└── package.json
```

## 💻 Penggunaan

### Login

```tsx
import { loginUser } from "@/lib/auth";

await loginUser(email, password);
```

### Register

```tsx
import { registerUser } from "@/lib/auth";

await registerUser(name, email, password);
```

### Get Current User

```tsx
import { useAuth } from "@/components/auth-provider";

const { user, logout } = useAuth();
```

### Protect Page

```tsx
import { useProtectedPage } from "@/hooks/useProtectedPage";

export default function ProtectedPage() {
  useProtectedPage(); // Auto redirect to login if not authenticated
  return <div>Protected Content</div>;
}
```

## 🎨 Halaman

- **/** - Homepage
- **/auth/login** - Login page
- **/auth/register** - Register page
- **/appointment** - Appointment (protected)
- **/schedule** - Schedule (bisa diproteksi)
- **/consultation** - Consultation (bisa diproteksi)
- **/chat** - Chat (bisa diproteksi)

## 🧪 Testing

1. Register user baru di `/auth/register`
2. Login dengan credentials tadi di `/auth/login`
3. Navbar akan menampilkan nama user
4. Akses `/appointment` (akan redirect ke login jika belum login)
5. Klik Logout untuk keluar

## 🐛 Troubleshooting

**Error: Invalid API credentials**
→ Cek `.env.local`, pastikan URL dan API key benar

**Error: User already registered**
→ Email sudah dipakai, gunakan email lain

**Redirect loop di login**
→ Hapus localStorage dan refresh browser

**Session hilang setelah refresh**
→ Check localStorage, pastikan `auth_session` ada

## 📝 Notes

- File Prisma dan NextAuth masih ada tapi tidak digunakan
- Semua autentikasi sekarang menggunakan Supabase
- Session tersimpan di localStorage (bisa diupgrade ke cookies)
- Password minimal 6 karakter

## 🔮 Future Enhancements

- [ ] Email verification
- [ ] Password reset
- [ ] Social login (Google, GitHub)
- [ ] Profile management
- [ ] Change password
- [ ] 2FA/MFA
- [ ] Role-based access control

## 📄 License

Private project

## 👨‍💻 Developer

Developed with ❤️ for Klinik dr. Donny Mulizar, MKM

---

**Last Updated**: 27 Oktober 2025
**Version**: 2.0 (Supabase Integration)
