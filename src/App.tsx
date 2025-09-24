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
import "./styles/global.css";

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Liste des pages où on veut afficher un bouton retour au lieu du menu
  const hideMenuOn = ["/SuivantTarifs","/formulaire","/finmessage"];

  return (
    <>
      {/* Si on est sur une page spéciale → bouton retour, sinon → menu */}
      {!hideMenuOn.includes(location.pathname) ? (
        <Menu />
      ) : (
        <button className="back-button" onClick={() => navigate(-1)}>
         Retour
        </button>
      )}

      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/Nouscontacter" element={<Nouscontacter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/suivanttarifs" element={<SuivantTarifs />} />
        <Route path="/formulaire" element={<Formulaire />} />
        <Route path="/finmessage" element={<Finmessage />} />
      </Routes>
    </>
  );
};

export default AppContent;
