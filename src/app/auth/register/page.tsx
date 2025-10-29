"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal daftar");
      }

      setOk(true);
      // Auto redirect ke login dengan callbackUrl setelah 2 detik
      setTimeout(() => {
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Gagal daftar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6 min-h-screen pt-55">
      <h1 className="text-2xl font-bold">Daftar</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6 shadow-lg">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {ok && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">Registrasi berhasil! Mengalihkan ke halaman login...</div>}
        <div>
          <label className="text-sm font-medium">Nama</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Nama lengkap" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="email@example.com" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Minimal 6 karakter" />
        </div>
        <button disabled={loading || ok} className="w-full rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white disabled:opacity-60 hover:bg-gray-800 transition">
          {loading ? "Memproses..." : "Daftar"}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Sudah punya akun?{" "}
          <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold hover:text-blue-500 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </main>
  );
}
