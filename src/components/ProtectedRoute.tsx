import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ⚠️ adapte le chemin si ton dossier s'appelle "context" ou "contexts"
 
interface Props {
  children: React.ReactNode;
}
 
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();
 
  // ✅ on attend que Firebase finisse de restaurer la session
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        Chargement...
      </div>
    );
  }
 
  // ✅ si pas connecté => login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
 
  // ✅ connecté => on affiche la page protégée
  return <>{children}</>;
};
 
export default ProtectedRoute;