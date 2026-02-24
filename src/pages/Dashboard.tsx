import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      <h1 style={{ color: "#d4af37", marginBottom: 12 }}>Espace Salon</h1>
      <p style={{ opacity: 0.9 }}>
        Connecté en tant que : <b>{user?.email}</b>
      </p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 16,
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #d4af37",
          background: "transparent",
          color: "#d4af37",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;