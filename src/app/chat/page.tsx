"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { roomChannel } from "@/lib/supabase";

type Msg = { id?: string; body: string; senderId: string; createdAt: string };

export default function ConsultationPage() {
  const { data: session } = useSession();
  const myId = (session?.user as any)?.id ?? ""; // pastikan callbacks NextAuth sudah inject id
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof roomChannel> | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/chat/room", { method: "POST" });
      if (!r.ok) return;
      const { id } = await r.json();
      setRoomId(id);
    })();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    let unsub = () => {};
    (async () => {
      const r = await fetch(`/api/chat/messages/${roomId}`);
      if (!r.ok) {
        console.error("Failed to fetch messages:", r.status);
        return;
      }
      const data = await r.json();
      const rows: Msg[] = data.messages || data || [];
      setMessages(rows);
      scrollBottom();

      const ch = roomChannel(roomId);
      ch.on("broadcast", { event: "new_message" }, (payload: any) => {
        // Skip jika payload kosong atau body kosong
        if (!payload || !payload.body || payload.body.trim() === "") return;

        // pastikan payload punya createdAt valid
        const createdAt = toIso(payload?.createdAt);
        setMessages((m) => [...m, { ...payload, createdAt }]);
        scrollBottom();
      });
      ch.subscribe();
      channelRef.current = ch;
      unsub = () => ch.unsubscribe();
    })();
    return () => unsub();
  }, [roomId]);

  function scrollBottom() {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  async function send() {
    const body = input.trim();
    if (!body || !roomId) return;

    // Optimistic add (supaya terasa responsif)
    const optimistic: Msg = {
      id: undefined,
      body,
      senderId: myId,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    scrollBottom();
    setInput("");

    // Simpan ke server
    const r = await fetch(`/api/chat/messages/${roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!r.ok) {
      console.error("Failed to send message:", r.status);
      // Remove optimistic message if failed
      setMessages((m) => m.filter((msg) => msg !== optimistic));
      return;
    }

    // Dapatkan data "resmi" dari server (punya id) lalu broadcast
    const data = await r.json();
    const saved: Msg = data.message || data;

    // Validasi message yang disimpan
    if (!saved || !saved.body || saved.body.trim() === "") {
      console.error("Invalid message received from server");
      setMessages((m) => m.filter((msg) => msg !== optimistic));
      return;
    }

    const payload: Msg = {
      id: saved.id,
      body: saved.body,
      senderId: saved.senderId ?? myId,
      createdAt: toIso(saved.createdAt),
    };
    channelRef.current?.send({
      type: "broadcast",
      event: "new_message",
      payload,
    });

    // Ganti entry optimistik tanpa id dengan versi punya id (opsional)
    setMessages((m) => {
      const lastIdx = m.findIndex((x) => x === optimistic);
      if (lastIdx === -1) return m;
      const copy = [...m];
      copy[lastIdx] = payload;
      return copy;
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      {/* Header dengan tombol Kembali */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 drop-shadow-[0_1px_0_rgba(0,0,0,0.12)]">Konsultasi</h1>
        <Link href="/#service" className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-black/10 hover:ring-black/20">
          Kembali
        </Link>
      </div>

      <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
        <div className="px-6 pt-4 pb-3">
          <p className="text-center text-sm text-gray-600">Chat dengan dokter kami</p>
        </div>
        <hr className="mx-6 border-gray-200" />

        <div ref={scrollerRef} className="px-6 py-5 h-[calc(100vh-320px)] min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages.length === 0 && <ChatRow side="left" avatar="/image/dokter.png" bubble="Halo, ada yang bisa kami bantu?" />}

          {messages.map((m, idx) => {
            // Skip jika body kosong
            if (!m.body || m.body.trim() === "") return null;

            const mine = m.senderId === myId;
            const key = m.id ?? `${m.createdAt}-${idx}`; // FIX: key selalu unik
            const time = safeTime(m.createdAt);
            return <ChatRow key={key} side={mine ? "right" : "left"} avatar={mine ? undefined : "/image/dokter.png"} bubble={m.body} time={time} />;
          })}
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 flex items-center gap-2 p-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ketik pesan Anda di sini…" className="flex-1 rounded-full px-4 py-3 outline-none" />
            <button onClick={send} className="grid h-11 w-11 place-items-center rounded-full bg-[#7aa6d8] hover:brightness-95 transition" aria-label="Kirim">
              <Send className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ChatRow({ side, avatar, bubble, time }: { side: "left" | "right"; avatar?: string; bubble: string; time?: string }) {
  const isLeft = side === "left";
  return (
    <div className={`mb-4 flex items-end gap-3 ${isLeft ? "" : "justify-end"}`}>
      {isLeft && (
        <div className="relative h-8 w-8">
          <Image src={avatar ?? "/image/dokter.png"} alt="admin" fill className="rounded-full object-contain" />
        </div>
      )}
      <div className={["max-w-[75%] rounded-2xl px-4 py-2 text-sm", isLeft ? "bg-[#d9ecff]" : "bg-gray-100"].join(" ")}>
        <div className="text-gray-900">{bubble}</div>
        {time && <div className="mt-1 text-[10px] text-gray-500">{time}</div>}
      </div>
    </div>
  );
}

/* Utils defensif */
function toIso(x: any) {
  try {
    const d = new Date(x ?? Date.now());
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}
function safeTime(x: string) {
  const d = new Date(x);
  return isNaN(d.getTime()) ? "" : d.toLocaleTimeString();
}
