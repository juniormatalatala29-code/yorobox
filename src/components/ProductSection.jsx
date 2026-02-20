import React from "react";
import { Link } from "react-router-dom";
import "../styles/salons.css";

import bella2 from "../assets/salons/bella-2.jpg";

const salons = [
  {
    id: 1,
    name: "Salon Premium Gold",
    plan: "premium",
    bannerImage: bella2,
    bio: "Un salon premium avec une expérience haut de gamme.",
  },
  {
    id: 2,
    name: "Salon VIP Élégance",
    plan: "vip",
    bannerImage: bella2,
    bio: "Un salon VIP élégant et raffiné.",
  },
  {
    id: 3,
    name: "Salon Standard Beauté",
    plan: "normal",
    bannerImage: bella2,
    bio: "Salon standard simple et accessible.",
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
          <img src={salon.bannerImage} className="salon-image" alt="salon" />

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