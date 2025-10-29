"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Message = {
  id: string;
  roomId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender: { name: string | null; email: string };
};

type Room = {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  _count: { messages: number };
  unreadCount?: number;
};

export default function AdminChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRoomId = searchParams.get("room");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch rooms
  useEffect(() => {
    fetch("/api/admin/chat/rooms")
      .then((r) => r.json())
      .then((data) => setRooms(data.rooms || []))
      .catch(console.error);
  }, []);

  // Fetch messages when room is selected
  useEffect(() => {
    if (!activeRoomId) {
      setMessages([]);
      return;
    }

    fetch(`/api/chat/messages/${activeRoomId}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages || []))
      .catch(console.error);
  }, [activeRoomId]);

  const handleSendMessage = async () => {
    if (!activeRoomId || !newMessage.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/chat/messages/${activeRoomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newMessage.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Room List (Left Sidebar) */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pesan Pasien</h2>
          <p className="text-xs text-gray-500 mt-1">Balas konsultasi pasien</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">Belum ada percakapan</div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => router.push(`/admin/chat?room=${room.id}`)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${activeRoomId === room.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{room.user.name || room.user.email}</p>
                  {room.unreadCount && room.unreadCount > 0 ? <span className="bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5">{room.unreadCount}</span> : null}
                </div>
                <p className="text-xs text-gray-500 mt-1">{room._count.messages} pesan</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(room.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Conversation Area (Right) */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!activeRoomId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-4">💬</p>
              <p className="text-sm">Pilih percakapan untuk memulai</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <p className="font-semibold text-gray-900">{rooms.find((r) => r.id === activeRoomId)?.user.name || "Pasien"}</p>
              <p className="text-xs text-gray-500">{rooms.find((r) => r.id === activeRoomId)?.user.email}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">Belum ada pesan</p>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.sender.email === "admin@gmail.com";
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-md px-4 py-2 rounded-lg ${isAdmin ? "bg-blue-600 text-white" : "bg-white text-gray-900 border border-gray-200"}`}>
                        <p className="text-sm">{msg.body}</p>
                        <p className={`text-xs mt-1 ${isAdmin ? "text-blue-100" : "text-gray-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Box */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Ketik balasan..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button onClick={handleSendMessage} disabled={loading || !newMessage.trim()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                  {loading ? "..." : "Kirim"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
