# Backend Authentication dengan Supabase - My Klinik

Aplikasi ini menggunakan **Supabase** untuk autentikasi (login & register) yang terintegrasi dengan Next.js.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

Ikuti panduan lengkap di [SETUP_SUPABASE.md](./SETUP_SUPABASE.md)

Ringkasan:

1. Buat project di https://supabase.com
2. Enable Email Authentication
3. Copy Project URL dan API Key
4. Buat file `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
```

### 3. Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## 📁 Struktur Backend

```
src/
├── app/
│   └── api/
│       ├── register/
│       │   └── route.ts          # API endpoint untuk register
│       ├── login/
│       │   └── route.ts          # API endpoint untuk login
│       └── logout/
│           └── route.ts          # API endpoint untuk logout
├── lib/
│   ├── supabase.ts               # Konfigurasi Supabase client
│   └── auth.ts                   # Helper functions untuk auth
└── components/
    └── auth-provider.tsx         # Context Provider untuk auth state
```

## 🔐 Fitur Autentikasi

### Register

- **Endpoint**: `POST /api/register`
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response Success**:

```json
{
  "id": "user-id",
  "email": "john@example.com",
  "message": "Registrasi berhasil."
}
```

### Login

- **Endpoint**: `POST /api/login`
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response Success**:

```json
{
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "session": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_at": 1234567890
  }
}
```

### Logout

- **Endpoint**: `POST /api/logout`
- **Request Body**:

```json
{
  "access_token": "..."
}
```

## 💻 Penggunaan di Frontend

### Login Page

```tsx
import { loginUser } from "@/lib/auth";

const handleLogin = async () => {
  try {
    await loginUser(email, password);
    // Redirect atau update UI
  } catch (error) {
    console.error(error.message);
  }
};
```

### Register Page

```tsx
import { registerUser } from "@/lib/auth";

const handleRegister = async () => {
  try {
    await registerUser(name, email, password);
    // Tampilkan success message
  } catch (error) {
    console.error(error.message);
  }
};
```

### Menggunakan Auth Context

```tsx
import { useAuth } from "@/components/auth-provider";

function MyComponent() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <a href="/auth/login">Login</a>;
}
```

## 🛡️ Session Management

Session disimpan di **localStorage** dengan key `auth_session`.

Struktur session:

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "..."
  },
  "session": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_at": 1234567890
  }
}
```

## 📝 Helper Functions

Di `src/lib/auth.ts`:

- `loginUser(email, password)` - Login user
- `registerUser(name, email, password)` - Register user baru
- `logoutUser()` - Logout user
- `getSession()` - Get current session
- `isLoggedIn()` - Check apakah user sudah login
- `getCurrentUser()` - Get current user data

## 🎨 Frontend (Tidak Diubah)

Semua tampilan frontend tetap sama, hanya fungsi backend yang diupdate:

- ✅ Login page (`/auth/login`)
- ✅ Register page (`/auth/register`)
- ✅ Navbar dengan user info & logout button
- ✅ Semua styling tetap sama

## 🔧 Teknologi yang Digunakan

- **Next.js 15** - Framework React
- **Supabase** - Backend as a Service (Authentication)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (tidak diubah)

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

## ⚠️ Notes

1. File Prisma dan NextAuth masih ada tapi tidak digunakan
2. Semua autentikasi sekarang menggunakan Supabase
3. Tampilan frontend 100% sama, hanya backend yang berubah
4. Session management menggunakan localStorage (client-side)

## 🐛 Troubleshooting

Jika ada error, pastikan:

1. ✅ File `.env.local` sudah dibuat dan terisi dengan benar
2. ✅ Supabase project sudah dibuat dan email auth sudah enabled
3. ✅ Dependencies sudah terinstall (`npm install`)
4. ✅ Development server sudah running (`npm run dev`)

Untuk bantuan lebih lanjut, lihat [SETUP_SUPABASE.md](./SETUP_SUPABASE.md)
