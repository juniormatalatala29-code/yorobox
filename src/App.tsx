import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Menu from "./components/Menu";
import Accueil from "./pages/Accueil";
import Tarifs from "./pages/Tarifs";
import Contact from "./pages/Contact";
import Nouscontacter from "./pages/Nouscontacter";
import SuivantTarifs from "./pagesSuivant/SuivantTarifs";
import Formulaire from "./pagesSuivant/formulaire";
import Finmessage from "./pagesSuivant/finmessage";

// 🔥 NOUVELLES PAGES
import Salons from "./pages/Salons";
import SalonDetail from "./pages/SalonDetail";

import "./styles/global.css";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Pages où on cache le menu et on affiche bouton retour
  const hideMenuOn = ["/SuivantTarifs", "/formulaire", "/finmessage"];

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
        {/* Pages existantes */}
        <Route path="/" element={<Accueil />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/Nouscontacter" element={<Nouscontacter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/suivanttarifs" element={<SuivantTarifs />} />
        <Route path="/formulaire" element={<Formulaire />} />
        <Route path="/finmessage" element={<Finmessage />} />

        {/* 🔥 NOUVELLES ROUTES SALONS */}
        <Route path="/salons" element={<Salons />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
      </Routes>
    </>
  );
};

export default App;