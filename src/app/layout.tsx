import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "../components/session-provider";
import AppShell from "@/components/app-shell";
import ChatbotWidget from "@/components/chatbot-widget";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Klinik dr. Donny Mulizar, MKM",
  description: "Layanan kesehatan terpercaya untuk keluarga Anda",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <body className={`${jakarta.variable} bg-white overflow-x-hidden w-full max-w-[100vw]`}>
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
        <ChatbotWidget />
      </body>
    </html>
  );
}
