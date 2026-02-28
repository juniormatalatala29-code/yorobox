import React from "react";
import ReactDOM from "react-dom/client";
import AppContent from "./App"; // ton fichier AppContent
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // ✅ Ajout du Router
import "./styles/global.css";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);