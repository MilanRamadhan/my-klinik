# Perbedaan Sistem Lama vs Baru

## 🔄 Perubahan Utama

### Sebelum (Prisma + NextAuth + bcrypt)

```
Database: PostgreSQL (via Prisma)
Auth: NextAuth.js
Password: bcrypt manual
Session: Database session
```

### Sekarang (Supabase)

```
Database: Supabase (PostgreSQL managed)
Auth: Supabase Auth
Password: Handled by Supabase
Session: localStorage + JWT tokens
```

## 📊 Perbandingan Detail

| Aspek                  | Lama (Prisma)                             | Baru (Supabase)               |
| ---------------------- | ----------------------------------------- | ----------------------------- |
| **Setup Complexity**   | Tinggi (perlu setup DB, Prisma, NextAuth) | Rendah (tinggal copy API key) |
| **Database**           | Self-managed PostgreSQL                   | Managed by Supabase           |
| **Schema**             | Manual (Prisma schema)                    | Auto (managed by Supabase)    |
| **Migration**          | Manual (`prisma migrate`)                 | Otomatis                      |
| **Password Hash**      | Manual (bcrypt)                           | Otomatis (Supabase)           |
| **Session Storage**    | Database                                  | localStorage + JWT            |
| **Email Verification** | Manual setup                              | Built-in                      |
| **Social Login**       | Manual setup                              | Built-in                      |
| **Cost**               | Hosting DB + App                          | Free tier generous            |
| **Scalability**        | Manual scaling                            | Auto-scaling                  |

## 📁 File yang Tidak Digunakan Lagi

❌ **`src/lib/prisma.ts`** - Tidak digunakan
❌ **`src/app/api/auth/[...nextauth]/route.ts`** - Tidak digunakan
❌ **`prisma/schema.prisma`** - Tidak digunakan
❌ **bcrypt dependency** - Masih installed tapi tidak digunakan

> **Note**: File-file ini tidak dihapus untuk backwards compatibility dan bisa dihapus nanti jika perlu.

## 🆕 File Baru

✅ **`src/lib/auth.ts`** - Helper functions untuk auth
✅ **`src/app/api/login/route.ts`** - Login endpoint
✅ **`src/app/api/logout/route.ts`** - Logout endpoint
✅ **`src/components/auth-provider.tsx`** - Auth context
✅ **`src/hooks/useProtectedPage.ts`** - Protected page hook

## 💻 Perubahan Kode

### Login - Sebelum

```tsx
import { signIn } from "next-auth/react";

const res = await signIn("credentials", {
  email,
  password,
  redirect: false,
});
```

### Login - Sekarang

```tsx
import { loginUser } from "@/lib/auth";

const session = await loginUser(email, password);
// Session otomatis tersimpan di localStorage
```

### Register - Sebelum

```tsx
const res = await fetch("/api/register", {
  method: "POST",
  body: JSON.stringify({ name, email, password }),
});
// Password di-hash manual dengan bcrypt di backend
// User disimpan ke Prisma database
```

### Register - Sekarang

```tsx
import { registerUser } from "@/lib/auth";

await registerUser(name, email, password);
// Password di-hash otomatis oleh Supabase
// User disimpan di Supabase Auth
```

### Get User - Sebelum

```tsx
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const user = session?.user;
```

### Get User - Sekarang

```tsx
import { useAuth } from "@/components/auth-provider";

const { user } = useAuth();
```

## 🎯 Keuntungan Sistem Baru

1. **Setup Lebih Cepat**

   - Tidak perlu setup database sendiri
   - Tidak perlu konfigurasi Prisma
   - Tidak perlu migrate database
   - Copy-paste API key langsung jalan

2. **Lebih Aman**

   - Password hashing handled by Supabase
   - Token management otomatis
   - Built-in security best practices

3. **Fitur Lebih Banyak**

   - Email verification tinggal enable
   - Social login tinggal konfigurasi
   - Password reset built-in
   - 2FA ready

4. **Lebih Mudah Maintenance**

   - No database migration headaches
   - Auto-scaling
   - Monitoring built-in
   - Logs di dashboard

5. **Cost Effective**
   - Free tier: 50,000 monthly active users
   - No server hosting needed
   - Pay as you grow

## 🚨 Hal yang Perlu Diperhatikan

1. **Dependency pada Supabase**

   - Aplikasi bergantung pada service Supabase
   - Jika Supabase down, auth tidak berfungsi
   - Mitigasi: Supabase SLA 99.9% uptime

2. **Session di localStorage**

   - Lebih mudah tapi kurang secure dibanding httpOnly cookies
   - Bisa di-upgrade ke cookies di future
   - Untuk MVP sudah cukup

3. **Data Migration**
   - Jika sudah ada user di database lama, perlu migrate
   - Bisa dilakukan dengan Supabase Management API

## 📈 Migrasi dari Sistem Lama

Jika sudah ada users di database Prisma, langkah migrasi:

1. Export users dari database lama
2. Import ke Supabase via Management API
3. User perlu reset password (karena hash method berbeda)
4. Atau: gunakan temporary password dan minta user ganti

## 🔮 Future Enhancement

Sistem baru lebih mudah untuk tambah fitur:

- ✅ Email verification (tinggal enable)
- ✅ Password reset (built-in)
- ✅ Social login (Google, GitHub, dll)
- ✅ Magic link login
- ✅ Phone/SMS auth
- ✅ Multi-factor authentication (2FA)
- ✅ Role-based access control (RBAC)

## 💡 Kesimpulan

**Sistem Baru (Supabase) Lebih Baik Untuk:**

- Rapid development
- Scaling otomatis
- Built-in features
- Less maintenance
- Better security

**Sistem Lama (Prisma) Lebih Baik Untuk:**

- Full control over database
- Custom schema complex
- On-premise deployment
- Specific compliance requirements

Untuk klinik app ini, **Supabase adalah pilihan yang lebih baik** karena:

- Setup cepat
- Fitur lengkap
- Maintenance minimal
- Cost effective
- Scalable

---

**Rekomendasi**: Stick dengan sistem baru (Supabase) ✨
