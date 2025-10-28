// src/app/chat/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useAuth } from "@/components/auth-provider";

type Msg = { id: string; room_id: string; username: string; text: string; created_at: string };

export default function ChatPage() {
  // Proteksi halaman - redirect ke login jika belum login
  useProtectedPage();

  const { user } = useAuth();
  const roomId = "general";
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ch: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data } = await supabase.from("messages").select("*").eq("room_id", roomId).order("created_at", { ascending: true }).limit(200);
      setMsgs(data ?? []);
      ch = supabase
        .channel("realtime:messages")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` }, (payload) => {
          setMsgs((p) => [...p, payload.new as Msg]);
          endRef.current?.scrollIntoView({ behavior: "smooth" });
        })
        .subscribe();
    })();
    return () => {
      if (ch) supabase.removeChannel(ch);
    };
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !user) return;

    const username = user.name || user.email || "User";
    await supabase.from("messages").insert({ room_id: roomId, username, text: t });
    setText("");
  }

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Chat Realtime</h1>
      <div className="mb-3 flex gap-2">
        <div className="text-sm text-gray-600">
          Logged in as: <span className="font-semibold">{user?.name || user?.email}</span>
        </div>
        <div className="ml-auto text-xs text-gray-500">Room: {roomId}</div>
      </div>
      <div className="h-[60vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-4">
        {msgs.length === 0 && <div className="text-center text-gray-500 mt-10">Belum ada pesan. Mulai chat sekarang!</div>}
        {msgs.map((m) => (
          <div key={m.id} className="mb-3">
            <div className="text-xs text-gray-500">
              {m.username} • {new Date(m.created_at).toLocaleTimeString()}
            </div>
            <div className="inline-block rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-800">{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input className="flex-1 rounded-xl border px-3 py-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ketik pesan..." maxLength={1000} />
        <button className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:opacity-90">Kirim</button>
      </form>
    </main>
  );
}
