"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "bot" | "user";
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", content: "Halo! Ada yang bisa saya bantu terkait layanan Klinik dr. Donny?" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Referensi untuk fitur auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const CHATBOT_API_URL = "https://milano2004-medical-chatbot-api.hf.space/chat";

  // Efek untuk otomatis scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          session_id: "klinik-session",
          lang_mode: "id",
        }),
      });

      if (!response.ok) throw new Error("Gagal mengambil respons API");

      const data = await response.json();
      const botReply = data.reply ?? data.response ?? "Maaf, respons tidak terbaca dengan benar.";

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Maaf, sistem sedang gangguan atau koneksi ke AI terputus." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        // UI Diperlebar (w-96) dan ditinggikan sedikit (h-[32rem]) agar lebih lega membaca diagnosis
        <div className="w-96 h-[32rem] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden font-sans">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 font-semibold flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-2">
              <span className="text-xl">🩺</span>
              <span>Asisten Medis Klinik</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Area Chat */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"}`}
                >
                  {/* Gunakan ReactMarkdown khusus untuk pesan bot agar format tebal dll terbaca */}
                  {msg.role === "bot" ? (
                    <div className="markdown-content space-y-2 [&>p]:mb-2 [&>hr]:my-3 [&>hr]:border-gray-200 [&>ul]:list-disc [&>ul]:ml-4">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Animasi Loading yang lebih elegan */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
            {/* Elemen kosong untuk target auto-scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik keluhan Anda di sini..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Tombol Bulat (Floating Button) */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg shadow-blue-200 flex items-center justify-center hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
