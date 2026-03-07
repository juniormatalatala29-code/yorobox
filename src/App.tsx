import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
 
import "./styles/global.css";
import Menu from "./components/Menu";
 
// Pages publiques
import Accueil from "./pages/Accueil";
import Tarifs from "./pages/Tarifs";
import Contact from "./pages/Contact";
import Nouscontacter from "./pages/Nouscontacter";
import Salons from "./pages/Salons";
import SalonDetail from "./pages/SalonDetail";
 
// Pages "suivantes"
import SuivantTarifs from "./pagesSuivant/SuivantTarifs";
import Formulaire from "./pagesSuivant/formulaire";
import Finmessage from "./pagesSuivant/finmessage";
 
// Nouvelles pages
import Evenements from "./pagesSuivant/Evenements";
import Offres from "./pagesSuivant/Offres";
 
// Auth
import Register from "./pages/Register";
import Login from "./pages/Login";
 
// Dashboard
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
 
const AppContent: React.FC = () => {
  const location = useLocation();
 
  // Routes où on cache le menu
  const hideMenuOn = [
    "/suivanttarifs",
    "/formulaire",
    "/finmessage",
    "/login",
    "/register",
    "/dashboard",
  ];
 
  const shouldHideMenu = hideMenuOn.some((path) =>
    location.pathname.startsWith(path)
  );
 
  return (
    <>
      {!shouldHideMenu && <Menu />}
 
      <Routes>
        {/* 🌍 Public */}
        <Route path="/" element={<Accueil />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/nouscontacter" element={<Nouscontacter />} />
        <Route path="/contact" element={<Contact />} />
 
        {/* ➡️ Page après accueil */}
        <Route path="/suivanttarifs" element={<SuivantTarifs />} />
 
        {/* 📩 Pages suivantes */}
        <Route path="/formulaire" element={<Formulaire />} />
        <Route path="/finmessage" element={<Finmessage />} />
 
        {/* 🟨 Nos services */}
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/offres" element={<Offres />} />
 
        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
 
        {/* 🔒 Dashboard ADMIN */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
 
        {/* 🔒 Dashboard SALON */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
 
        {/* ❓ Route inconnue -> accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
 
export default AppContent;