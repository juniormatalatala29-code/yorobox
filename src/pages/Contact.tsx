import React from "react";
import { Link } from "react-router-dom";
import "../styles/Contact.css";
import bg from "../assets/image.jpg";

const Contact: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-bg-black"></div>
      <img src={bg} alt="fond" className="about-bg-image" />

      <div className="about-container">
        <div className="about-card">
          <div className="about-card-glow" />
          <div className="about-card-reflection" />

          <div className="about-content">
            <div className="about-badge">YAKA</div>

            <h1 className="about-title">Qui sommes-nous ?</h1>

            <p className="about-text">
              Yorobox est une entreprise innovante dédiée à la conception et au
              déploiement de solutions technologiques avancées, visant à
              transformer et optimiser les divers secteurs d’activité. Notre
              mission est de rendre la technologie accessible et utile à tous,
              en proposant des services et produits qui répondent aux besoins
              réels des utilisateurs tout en anticipant les évolutions du
              marché.
            </p>

            <p className="about-text">
              Parmi nos solutions phares, Yaka Mobile se distingue comme une
              application révolutionnaire dans le domaine de la coiffure et du
              bien-être. Développée par l’équipe Yorobox, Yaka Mobile permet aux
              utilisateurs de réserver facilement des services de coiffure, de
              découvrir de nouveaux salons et coiffeurs, et de bénéficier d’une
              expérience personnalisée, simple et rapide.
            </p>

            <div className="about-actions">
              <Link to="/Nouscontacter">
                <button className="about-button">Contacter l'entreprise</button>
              </Link>
            </div>

            <footer className="about-footer">
              Une application web développée par YoroBox
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
