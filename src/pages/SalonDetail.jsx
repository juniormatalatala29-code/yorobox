import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/salons.css";
import "../styles/detail.css";

import bella2 from "../assets/salons/bella-2.jpg";
import bella1 from "../assets/salons/bella-1.jpg";
import bella3 from "../assets/salons/bella-3.jpg";
import bella4 from "../assets/salons/bella-4.jpg";
import Precious2 from "../assets/salons/Precious2.jpg";
import Precious3 from "../assets/salons/Precious3.jpg";
import Precious4 from "../assets/salons/Precious4.jpg";
import Precious5 from "../assets/salons/Precious5.jpg";
import Precious7 from "../assets/salons/Precious7.jpg";
import Precious8 from "../assets/salons/Precious8.jpg";


// Exemple de données salons
const salons = [
  {
    id: 1,
    name: "Precious Touch",
    plan: "premium",
    bannerImage: Precious2,
    bio: "Maquillage, Coiffures, Décorations.",
    city: "Kinshasa",
    horaires: "Lun - Sam: 9h - 19h",
    tarifs: [
      { service: "Coupe", price: "10$" },
      { service: "Coloration", price: "20$" },
    ],
    catalogue: [
      { produit: "Shampoing", price: "5$" },
      { produit: "Crème coiffante", price: "7$" },
    ],
    gallery: [Precious3, Precious4, Precious5, Precious7, Precious8],
  },
  {
    id: 2,
    name: "Salon VIP Élégance",
    plan: "vip",
    bannerImage: bella2,
    bio: "Salon VIP avec prestations haut de gamme.",
    city: "Lubumbashi",
    horaires: "Lun - Ven: 10h - 18h",
    tarifs: [
      { service: "Coupe", price: "15$" },
      { service: "Coloration", price: "25$" },
    ],
    catalogue: [
      { produit: "Shampoing", price: "6$" },
      { produit: "Soin capillaire", price: "8$" },
    ],
    gallery: [bella2, bella2],
  },
  {
    id: 3,
    name: "Salon Standard Beauté",
    plan: "normal",
    bannerImage: bella2,
    bio: "Salon standard simple.",
    city: "Goma",
    horaires: "Mar - Sam: 8h - 17h",
    tarifs: [
      { service: "Coupe", price: "8$" },
      { service: "Coloration", price: "15$" },
    ],
    catalogue: [{ produit: "Shampoing", price: "4$" }],
    gallery: [bella1,bella2,bella3,bella4],
  },
];

const SalonDetail = () => {
  const { id } = useParams();
  const salon = salons.find((s) => s.id === Number(id));
  const [rating, setRating] = useState(0);

  if (!salon) return <h2>Salon introuvable</h2>;

  return (
    <div className={`detail-container ${salon.plan}`}>
      {/* Bannière */}
      <img src={salon.bannerImage} className="banner" alt={salon.name} />

      <div className="detail-content">
        {/* Nom et ville */}
        <h1>{salon.name}</h1>
        <p className="city">{salon.city}</p>

        {/* Badge plan */}
        <span className={`badge ${salon.plan}`}>
          {salon.plan.toUpperCase()}
        </span>

        {/* ⭐ Étoiles pour les plans premium */}
        <div className="stars">
          {[1, 2, 3, 4, 5, 6].map((star) => (
            <span
              key={star}
              onClick={() => salon.plan === "premium" && setRating(star)}
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

        {/* Bio */}
        <section>
          <h3>À propos</h3>
          <p>{salon.bio}</p>
        </section>

        {/* Horaires */}
        <section>
          <h3>Horaires</h3>
          <p>{salon.horaires}</p>
        </section>

        {/* Tarifs */}
        <section>
          <h3>Tarifs</h3>
          {salon.tarifs.map((t, i) => (
            <div key={i} className="row">
              <span>{t.service}</span>
              <span>{t.price}</span>
            </div>
          ))}
        </section>

        {/* Catalogue */}
        <section>
          <h3>Catalogue</h3>
          {salon.catalogue.map((c, i) => (
            <div key={i} className="row">
              <span>{c.produit}</span>
              <span>{c.price}</span>
            </div>
          ))}
        </section>

        {/* Galerie */}
        <section>
          <h3>Galerie</h3>
          <div className="gallery">
            {salon.gallery.map((img, i) => (
              <img key={i} src={img} alt={`gallery ${i + 1}`} />
            ))}
          </div>
        </section>

        {/* Boutons */}
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
    </div>
  );
};

export default SalonDetail;