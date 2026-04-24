"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const targetCb = email === "admin@gmail.com" ? "/admin" : callbackUrl;

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: targetCb,
      });

      setLoading(false);

      if (res?.error) {
        setError("Email atau password salah");
        return;
      }

      // Sukses - redirect ke target callback (admin or provided callback)
      window.location.href = (res?.url as string) || targetCb;
    } catch (err: any) {
      setError(err.message || "Email atau password salah");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6 shadow-lg">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div>
        <label className="text-sm font-medium">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="email@example.com" />
      </div>
      <div>
        <label className="text-sm font-medium">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="********" />
      </div>
      <button disabled={loading} className="w-full rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white disabled:opacity-60 hover:bg-gray-800 transition">
        {loading ? "Memproses..." : "Masuk"}
      </button>
      <p className="text-sm text-gray-600 text-center">
        Belum punya akun?{" "}
        <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold hover:text-blue-500 hover:underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-6 min-h-screen pt-55">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <Suspense fallback={<div className="mt-6 text-center text-gray-500">Memuat form login...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
