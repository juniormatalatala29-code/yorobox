import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Menu from "./components/Menu";

// Pages principales
import Accueil from "./pages/Accueil";
import Tarifs from "./pages/Tarifs";
import Contact from "./pages/Contact";
import Nouscontacter from "./pages/Nouscontacter";
import Salons from "./pages/Salons";
import SalonDetail from "./pages/SalonDetail";

// Pages suivantes
import SuivantTarifs from "./pagesSuivant/SuivantTarifs";
import Formulaire from "./pagesSuivant/formulaire";
import Finmessage from "./pagesSuivant/finmessage";

// Auth
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();;
  const navigate = useNavigate();

  const hideMenuOn = [
    "/suivanttarifs",
    "/formulaire",
    "/finmessage",
    "/login",
    "/register"
  ];

  return (
    <>
      {!hideMenuOn.includes(location.pathname) ? (
        <Menu />
      ) : (
        <button className="back-button" onClick={() => navigate(-1)}>
          Retour
        </button>
      )}

      <Routes>
        {/* 🌍 Pages publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/nouscontacter" element={<Nouscontacter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/suivanttarifs" element={<SuivantTarifs />} />
        <Route path="/formulaire" element={<Formulaire />} />
        <Route path="/finmessage" element={<Finmessage />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 Dashboard protégé */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppContent;