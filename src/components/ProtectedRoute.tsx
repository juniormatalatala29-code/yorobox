import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
 
interface Props {
  children: React.ReactNode;
}
 
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();
 
  // 🔄 On attend que Firebase termine la vérification
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        Chargement...
      </div>
    );
  }
 
  // 🚫 Pas connecté → redirection login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
 
  // ✅ Connecté → accès autorisé
  return <>{children}</>;
};
 
export default ProtectedRoute;