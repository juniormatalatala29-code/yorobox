import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
 
import "./styles/global.css";
 
import Menu from "./components/Menu";
 
import Accueil from "./pages/Accueil";
import Tarifs from "./pages/Tarifs";
import Contact from "./pages/Contact";
import Nouscontacter from "./pages/Nouscontacter";
import Salons from "./pages/Salons";
import SalonDetail from "./pages/SalonDetail";
 
import SuivantTarifs from "./pagesSuivant/SuivantTarifs";
import Formulaire from "./pagesSuivant/formulaire";
import Finmessage from "./pagesSuivant/finmessage";
import Evenements from "./pagesSuivant/Evenements";
import Offres from "./pagesSuivant/Offres";
 
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
 
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (location.pathname !== "/") {
      setShowSplash(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);
 
  const hideMenuOn = [
    "/suivanttarifs",
    "/formulaire",
    "/finmessage",
    "/login",
    "/register",
    "/dashboard",
  ];
 
  const isDashboard = location.pathname.startsWith("/dashboard");
 
  const shouldHideMenu = hideMenuOn.some((path) =>
    location.pathname.startsWith(path)
  );
 
  // ✅ Pages où le bouton retour doit apparaître
  const shouldShowBackButton =
    !isDashboard &&
    (
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/offres" ||
      location.pathname === "/evenements" ||
      location.pathname === "/SuivantTarifs" ||
      location.pathname === "/formulaire" ||
      location.pathname.startsWith("/salon/")
    );

  if (showSplash && location.pathname === "/") {
    return <SplashScreen />;
  }
 
  return (
    <>
      {!shouldHideMenu && <Menu />}
 
      {shouldShowBackButton && (
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
 
        {/* ➡️ Pages suivantes */}
        <Route path="/suivanttarifs" element={<SuivantTarifs />} />
        <Route path="/formulaire" element={<Formulaire />} />
        <Route path="/finmessage" element={<Finmessage />} />
 
        {/* 🟨 Nos services */}
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/offres" element={<Offres />} />
 
        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
 
        {/* 🔒 Dashboard protégé */}
        <Route
          path="/dashboard/*"
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
