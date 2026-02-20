import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/salons.css";

import bella2 from "../assets/salons/bella-2.jpg";

const salons = [
  {
    id: 1,
    name: "Salon Premium Gold",
    plan: "premium",
    bannerImage: bella2,
    bio: "Salon premium avec une offre complète et innovante.",
  },
  {
    id: 2,
    name: "Salon VIP Élégance",
    plan: "vip",
    bannerImage: bella2,
    bio: "Salon VIP avec prestations haut de gamme.",
  },
  {
    id: 3,
    name: "Salon Standard Beauté",
    plan: "normal",
    bannerImage: bella2,
    bio: "Salon standard simple.",
  },
];

const SalonDetail = () => {
  const { id } = useParams();
  const salon = salons.find((s) => s.id === Number(id));
  const [rating, setRating] = useState(0);

  if (!salon) return <h2>Salon introuvable</h2>;

  return (
    <div className={`detail-container ${salon.plan}`}>
      <img src={salon.bannerImage} className="banner" alt="salon" />

      <h1>{salon.name}</h1>

      <span className={`badge ${salon.plan}`}>
        {salon.plan.toUpperCase()}
      </span>

      {/* ⭐ étoiles */}
      <div className="stars">
        {[1, 2, 3, 4, 5, 6].map((star) => (
          <span
            key={star}
            onClick={() =>
              salon.plan === "premium" && setRating(star)
            }
            style={{
              cursor: salon.plan === "premium" ? "pointer" : "default",
              color: star <= rating ? "gold" : "#555",
              fontSize: "24px",
              marginRight: "4px",
            }}
          >
            ★
          </span>
        ))}
      </div>

      <p className="bio">{salon.bio}</p>

      <button className="order-btn">Commander</button>

      {(salon.plan === "premium" || salon.plan === "vip") && (
        <a
          href="https://wa.me/243811298054"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          Écrire sur WhatsApp
        </a>
      )}

      {salon.plan === "premium" && (
        <button className="review-btn">Nous laisser un avis</button>
      )}
    </div>
  );
};

export default SalonDetail;