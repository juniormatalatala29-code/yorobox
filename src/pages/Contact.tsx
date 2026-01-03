import React from "react";
import { Link } from "react-router-dom";
import "../styles/Contact.css";
import bg from "../assets/image.jpg"; // la partie image

const Contact: React.FC = () => {
  return (
    <div className="accueil-root">
      {/* Fond noir complet */}
      <div className="background-black"></div>

      {/* Image de fond responsive */}
      <img src={bg} alt="fond" className="bg-imaget" />

      {/* Contenu par-dessus */}
      <header className="accueil-header">
        <div className="title-containers">
          <p className="small-titles">Yaka</p>
          <h1 className="logos">Qui sommes-nous ?</h1>
          <p className="subtitles">
            Yorobox est une entreprise innovante dédiée à la conception et au déploiement de solutions technologiques avancées, visant à transformer et optimiser les divers secteurs d’activité. Notre mission est de rendre la technologie accessible et utile à tous, en proposant des services et produits qui répondent aux besoins réels des utilisateurs tout en anticipant les évolutions du marché.</p>
        <p className="subtitles">
Parmi nos solutions phares, Yaka Mobile se distingue comme une application révolutionnaire dans le domaine de la coiffure et du bien-être. Développée par l’équipe Yorobox, Yaka Mobile permet aux utilisateurs de réserver facilement des services de coiffure, de découvrir de nouveaux salons et coiffeurs, et de bénéficier d’une expérience personnalisée, simple et rapide.
        </p>
        
        </div>
      </header>

      <div className="bottom-sections">
        <Link to="/Nouscontacter">
          <button className="cta-buttons">Contacter l'entreprise</button>
        </Link>
        <footer className="accueil-footers">
          Une Application Web développée par YoroBox
        </footer>
      </div>
    </div>
  );
};

export default Contact;
