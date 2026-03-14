import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/finmessage.css";

const FinMessage: React.FC = () => {
  const location = useLocation();

  const reservation = location.state as {
    nomComplet: string;
    avenue: string;
    quartier: string;
    commune: string;
    reference?: string;
    nbPersonnes: number;
    date: string;
    heure: string;
  };

  return (
    <div className="yakaSuccess-root">
      <div className="yakaSuccess-shell">

        <div className="yakaSuccess-glow" />
        <div className="yakaSuccess-reflection" />

        <div className="yakaSuccess-content">

          <h1 className="yakaSuccess-title">
            Merci {reservation?.nomComplet} pour votre réservation !
          </h1>

          <p className="yakaSuccess-text">
            Un message vous sera envoyé sur WhatsApp pour confirmer votre
            réservation et recevoir votre modèle de coiffure.
          </p>

          <div className="yakaSuccess-card">

            <h3>Détails de votre réservation</h3>

            <ul>
              <li>
                Adresse : {reservation?.avenue},{" "}
                {reservation?.quartier}, {reservation?.commune}
              </li>

              {reservation.reference && (
                <li>Référence : {reservation.reference}</li>
              )}

              <li>Nombre de personnes : {reservation?.nbPersonnes}</li>
              <li>Date : {reservation?.date}</li>
              <li>Heure : {reservation?.heure}</li>
            </ul>

          </div>

          <p className="yakaSuccess-contact">
            Besoin de nous contacter ou laisser un avis ?
            <Link to="/Nouscontacter"> Cliquez ici</Link>
          </p>

          <Link to="/Salons">
            <button className="yakaSuccess-button">
               Retour aux salons
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default FinMessage;
