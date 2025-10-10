import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta", // biar enak dipakai di Tailwind
});

export const metadata: Metadata = {
  title: "Klinik dr. Donny Mulizar, MKM",
  description: "Layanan kesehatan terpercaya untuk keluarga Anda",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} bg-gradient-to-b from-white to-[#eaf4ff]`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
