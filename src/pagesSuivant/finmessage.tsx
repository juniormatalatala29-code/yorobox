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
    <div className="finmessage-root">
      <h1> Merci {reservation?.nomComplet} pour votre réservation !</h1>

      <p>Un message vous sera envoyé sur WhatsApp pour confirmer votre réservation.</p>

      <p>Voici les détails de votre réservation :</p>
      <ul>
        <li>Adresse : {reservation?.avenue}, {reservation?.quartier}, {reservation?.commune}</li>
        {reservation.reference && <li>Référence : {reservation.reference}</li>}
        <li>Nombre de personnes : {reservation?.nbPersonnes}</li>
        <li>Date : {reservation?.date}</li>
        <li>Heure : {reservation?.heure}</li>
      </ul>

      <p>
        <p>Avez vous besoin de nous contacter ou laisser un avis?</p>Cliquez<Link to="/Nouscontacter">ici</Link>
      </p>
      <Link to="/">
        <button className="cta-button">Retour à l'accueil</button>
      </Link>
    </div>
  );
};

export default FinMessage;
