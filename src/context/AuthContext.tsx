// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth"; // ✅ type-only import
import { app } from "../firebase/firebase";
 
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
 
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
 
  const auth = getAuth(app);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
 
    return () => unsubscribe();
  }, [auth]);
 
  const logout = () => signOut(auth);
 
  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};