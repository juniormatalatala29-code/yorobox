import React from "react";
import { Link } from "react-router-dom";
import "../styles/salons.css";


// Même image pour les 3 salons, à remplacer par tes images locales
import bella4 from "../assets/salons/bella-4.jpg";
import bella5 from "../assets/salons/bella-5.jpg";
import bella6 from "../assets/salons/bella-6.jpg";
import bellap from "../assets/salons/bellap7.jpg";

const salons = [
  {
    id: 1,
    name: "Precious Touch",
    plan: "premium",
    bannerImage: bellap,
    bio: "Maquillage, Coiffures, Décorations.",
  },
  {
    id: 2,
    name: "Salon VIP Élégance",
    plan: "vip",
    bannerImage: bella5,
    bio: "Un salon VIP raffiné avec un service haut de gamme.",
  },
  {
    id: 3,
    name: "Salon Standard Beauté",
    plan: "normal",
    bannerImage: bella6,
    bio: "Un salon standard proposant des services basiques.",
  },
];

const Salons = () => {
  return (
    <div className="salons-container">
      <h1 className="salons-title">Liste des Salons</h1>

      {salons.map((salon) => (
        <Link
          key={salon.id}
          to={`/salon/${salon.id}`}
          className={`salon-card ${salon.plan}`}
        >
          <img src={salon.bannerImage} className="salon-image" />

          <div className="salon-info">
            <h2>{salon.name}</h2>

            <span className={`badge ${salon.plan}`}>
              {salon.plan.toUpperCase()}
            </span>

            <p>{salon.bio}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Salons;