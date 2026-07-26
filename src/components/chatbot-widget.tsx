"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Paperclip, Link as LinkIcon, Code, Mic, Send, Info, Bot, X } from "lucide-react";

interface Message {
  role: "bot" | "user";
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", content: "Halo! Ada yang bisa saya bantu terkait layanan Klinik dr. Donny?" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;

  // Referensi untuk fitur auto-scroll dan deteksi klik di luar
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const CHATBOT_API_URL = "https://milano2004-medical-chatbot-api.hf.space/chat";

  // Efek untuk otomatis scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        // Check if the click is not on the floating button
        if (!(event.target as Element).closest('.floating-ai-button')) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    setCharCount(value.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setCharCount(0);
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
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end">
      {/* Floating 3D Glowing AI Logo */}
      <button 
        className={`floating-ai-button relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(168,85,247,0.8) 100%)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(124, 58, 237, 0.5), 0 0 60px rgba(109, 40, 217, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* 3D effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
        
        {/* AI Icon */}
        <div className="relative z-10">
        { isOpen ? <X className="w-6 h-6 md:w-8 md:h-8 text-white" /> :  <Bot className="w-6 h-6 md:w-8 md:h-8 text-white" />}
        </div>
        
        {/* Glowing animation */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></div>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div 
          ref={chatRef}
          className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-max sm:min-w-[400px] max-w-[500px] transition-all duration-300 origin-bottom-right"
          style={{
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div className="relative flex flex-col h-[75vh] max-h-[40rem] rounded-3xl bg-gradient-to-br from-white/95 to-slate-50/95 border border-slate-200 shadow-2xl backdrop-blur-3xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2 z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700">Asisten Medis Klinik</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-2xl border border-slate-200">
                  AI
                </span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200/50 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Area Chat */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 z-10 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-md
                      ${msg.role === "user" ? "bg-indigo-600/90 text-white rounded-tr-sm border border-indigo-500/30" : "bg-white text-slate-700 border border-slate-200 rounded-tl-sm"}`}
                  >
                    {msg.role === "bot" ? (
                      <div className="markdown-content space-y-2 [&>p]:mb-2 [&>hr]:my-3 [&>hr]:border-slate-200 [&>ul]:list-disc [&>ul]:ml-4 [&_strong]:text-slate-900">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center backdrop-blur-md">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="relative z-10 bg-slate-50/80 border-t border-slate-200">
              <div className="relative overflow-hidden">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={isLoading}
                  className="w-full px-5 py-3 bg-transparent border-none outline-none resize-none text-sm font-normal leading-relaxed min-h-[48px] max-h-[120px] text-slate-800 placeholder-slate-400 scrollbar-none disabled:opacity-50"
                  placeholder="Ketik keluhan Anda di sini..."
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                />
              </div>

              {/* Controls Section */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-3">
                    {/* Character Counter */}
                    <div className="text-xs font-medium text-slate-500 hidden sm:block">
                      <span>{charCount}</span>/<span className="text-slate-400">{maxChars}</span>
                    </div>

                    {/* Send Button */}
                    <button 
                      onClick={() => handleSend()}
                      disabled={isLoading || !input.trim()}
                      className="group relative p-3 bg-gradient-to-r from-indigo-600 to-purple-600 border-none rounded-xl cursor-pointer transition-all duration-300 text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transform hover:-rotate-2"
                      style={{
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(99, 102, 241, 0.4)',
                      }}
                    >
                      <Send className="w-4 h-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12 group-hover:scale-110" />
                      
                      {/* Animated background glow */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-lg transform scale-110"></div>
                      
                      {/* Ripple effect on click */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl"></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 gap-6">
                  <div className="flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    <span>
                      Tekan <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-500 font-mono shadow-sm">Shift+Enter</kbd> baris baru
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Sistem Aktif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Overlay */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none z-0"
              style={{ 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent, rgba(168, 85, 247, 0.05))' 
              }}
            ></div>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        
        .floating-ai-button:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.9), 0 0 50px rgba(124, 58, 237, 0.7), 0 0 70px rgba(109, 40, 217, 0.5);
        }
      `}</style>
    </div>
  );
}
