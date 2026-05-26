import { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContextType } from "#/features/auth/auth.model.ts";
import { logoutUser, getMe } from "#/features/auth/auth.queries.ts";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  function login(user: User) {
    setUser(user);
  }

  async function logout() {
    await logoutUser();
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
