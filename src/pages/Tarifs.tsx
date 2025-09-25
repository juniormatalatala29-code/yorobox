import React from "react";
import { Link } from "react-router-dom";
import "../styles/Tarifs.css";
import bg from "../assets/image1.jpg"; // ton image

const Accueil: React.FC = () => {
  return (
    <div className="accueil-root">
      {/* Fond noir complet */}
      <div className="background-black"></div>

      {/* Image de fond responsive */}
      <img src={bg} alt="fond" className="bg-image" />

      {/* Contenu par-dessus */}
      <header className="Tarifs-header"></header>

      <div className="bottom-section">
        <Link to="/formulaire">
          <button className="cta-button">Commencer ma réservation</button>
        </Link>
        <footer className="Tarifs-footer">
          Une Application Web développée par YoroBox
        </footer>
      </div>
    </div>
  );
};

export default Accueil;
