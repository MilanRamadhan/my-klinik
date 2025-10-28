// src/lib/auth.ts
import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

export interface AuthSession {
  user: User;
  session: Session;
}

// Login user
export async function loginUser(email: string, password: string): Promise<AuthSession> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login gagal");
  }

  const data = await response.json();

  // Simpan session di localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_session", JSON.stringify(data));
  }

  return data;
}

// Register user
export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registrasi gagal");
  }

  return await response.json();
}

// Logout user
export async function logoutUser() {
  const session = getSession();

  await fetch("/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token: session?.session.access_token }),
  });

  // Hapus session dari localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_session");
  }
}

// Get current session
export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const sessionStr = localStorage.getItem("auth_session");
  if (!sessionStr) return null;

  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  const session = getSession();
  if (!session) return false;

  // Cek apakah token sudah expired
  if (session.session.expires_at) {
    const now = Math.floor(Date.now() / 1000);
    if (now >= session.session.expires_at) {
      // Token expired, hapus session
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_session");
      }
      return false;
    }
  }

  return true;
}

// Get current user
export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}
