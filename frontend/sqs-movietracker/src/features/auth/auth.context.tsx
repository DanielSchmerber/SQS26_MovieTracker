import { createContext, useContext, useState } from "react";
import type { User, AuthContextType } from "#/features/auth/auth.model.ts";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("movietracker_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  function login(user: User) {
    localStorage.setItem("movietracker_user", JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("movietracker_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
