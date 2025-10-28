// src/components/auth-provider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User, getSession, getCurrentUser, logoutUser } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    // Check session on mount
    refreshUser();
    setLoading(false);

    // Listen untuk perubahan localStorage dari tab lain
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_session") {
        refreshUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    window.location.href = "/auth/login";
  };

  return <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>{children}</AuthContext.Provider>;
}
