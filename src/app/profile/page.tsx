"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  bpjsNumber: string | null;
};

function splitName(full?: string | null) {
  const s = (full || "").trim().replace(/\s+/g, " ");
  if (!s) return { first: "", last: "" };
  const parts = s.split(" ");
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") ?? "" };
}

function joinName(first: string, last: string) {
  return [first.trim(), last.trim()].filter(Boolean).join(" ") || null;
}

function avatarSrc(name?: string | null, email?: string | null, image?: string | null) {
  if (image) return image;
  const label = name || email || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=dfe8f5&color=17202a&bold=true`;
}

export default function ProfilePage() {
  const { status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // form state
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bpjs, setBpjs] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/profile", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Gagal memuat profil");
        return;
      }
      setProfile(data);
      const { first, last } = splitName(data.name);
      setFirst(first);
      setLast(last);
      setEmail(data.email ?? "");
      setPhone(data.phone ?? "");
      setBpjs(data.bpjsNumber ?? "");
      setImage(data.image ?? "");
    };
    if (status !== "loading") void run();
  }, [status]);

  const displayName = useMemo(() => profile?.name || profile?.email || "User", [profile]);

  async function onSave() {
    setSaving(true);
    setError("");
    const payload = {
      name: joinName(first, last),
      phone: phone.trim() || null,
      bpjsNumber: bpjs.trim() || null,
      image: image.trim() || null,
    };
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data?.error || "Gagal menyimpan perubahan");
      return;
    }
    setProfile((p) => (p ? { ...p, ...data } : data));
    setEditing(false);
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-40 w-full animate-pulse rounded-2xl bg-gray-100" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pt-40">
      <div className="rounded-2xl border ring-1 ring-black/5 bg-white shadow-[0_6px_0_rgba(0,0,0,0.08)] p-6 md:p-8">
        {/* Bar atas: avatar + nama di kiri, tombol di kanan */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image src={avatarSrc(profile.name, profile.email, image || profile.image)} alt={displayName} width={88} height={88} className="h-22 w-22 rounded-full object-cover ring-1 ring-black/10" priority />
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-gray-900 drop-shadow-[0_1px_0_rgba(0,0,0,0.12)]">{displayName}</div>
              <div className="text-sm text-gray-600">{email}</div>
              {editing && (
                <div className="mt-2">
                  <input type="text" placeholder="Tempel URL foto (opsional)" disabled={!editing} value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                Edit
              </button>
            ) : (
              <>
                <button disabled={saving} onClick={() => setEditing(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-black/10 hover:ring-black/20">
                  Cancel
                </button>
                <button disabled={saving} onClick={onSave} className="rounded-full bg-gradient-to-b from-[#cfe0f5] to-[#a7c3e6] px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:opacity-95 disabled:opacity-70">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {/* Form fields */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="First Name">
            <input disabled={!editing} value={first} onChange={(e) => setFirst(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" placeholder="First name" />
          </Field>
          <Field label="Last Name">
            <input disabled={!editing} value={last} onChange={(e) => setLast(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" placeholder="Last name" />
          </Field>

          <Field label="Email">
            <input disabled value={email} className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-50" placeholder="email" />
          </Field>
          <Field label="Mobile Number">
            <input disabled={!editing} value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" placeholder="+62 8xx xxxx xxxx" />
          </Field>

          {/* ID = Nomor BPJS */}
          <Field label="ID (Nomor BPJS)">
            <input disabled={!editing} value={bpjs} onChange={(e) => setBpjs(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" placeholder="16 digit (opsional)" />
          </Field>
          <div />
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}
