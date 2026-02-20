import React from "react";
import { Link } from "react-router-dom";
import "../styles/salons.css";

// Même image pour les 3 salons, à remplacer par tes images locales
import salonImg from "../assets/salons/bella-1.jpg";

const salons = [
  {
    id: 1,
    name: "Salon Premium Gold",
    plan: "premium",
    bannerImage: salonImg,
    bio: "Un salon premium avec un service exceptionnel et une expérience VIP totale.",
  },
  {
    id: 2,
    name: "Salon VIP Élégance",
    plan: "vip",
    bannerImage: salonImg,
    bio: "Un salon VIP raffiné avec un service haut de gamme.",
  },
  {
    id: 3,
    name: "Salon Standard Beauté",
    plan: "normal",
    bannerImage: salonImg,
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