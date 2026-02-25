import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

import "../styles/salons.css";
import "../styles/detail.css";

type SalonDoc = {
  salonName?: string;
  bio?: string;
  city?: string;
  horaires?: string;

  subscriptionType?: "standard" | "vip" | "premium";

  bannerImage?: string;
  profileImage?: string;

  // listes
  gallery?: string[];
  tarifs?: Array<{ service: string; price: string }>;
  catalogue?: Array<{ produit: string; price: string }>;

  whatsapp?: string; // ex: "243811298054"
};

const DEFAULT_WHATSAPP = "243811298054";

const SalonDetail: React.FC = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState<SalonDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;

        const snap = await getDoc(doc(db, "salons", id));
        if (snap.exists()) {
          setSalon(snap.data() as SalonDoc);
        } else {
          setSalon(null);
        }
      } catch (e) {
        setSalon(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-container normal">
        <div className="detail-content">
          <h2 style={{ textAlign: "center", opacity: 0.9 }}>Chargement...</h2>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="detail-container normal">
        <div className="detail-content">
          <h2 style={{ textAlign: "center" }}>Salon introuvable</h2>
        </div>
      </div>
    );
  }

  const plan = salon.subscriptionType || "standard";
  const name = salon.salonName || "Salon";
  const bio = salon.bio || "Salon de coiffure & beauté.";
  const city = salon.city || "Kinshasa";
  const horaires = salon.horaires || "Horaires non renseignés";
  const whatsapp = salon.whatsapp || DEFAULT_WHATSAPP;

  const tarifs = salon.tarifs || [];
  const catalogue = salon.catalogue || [];
  const gallery = salon.gallery || [];

  return (
    <div className={`detail-container ${plan}`}>
      {/* Bannière */}
      {salon.bannerImage ? (
        <img src={salon.bannerImage} className="banner" alt={name} />
      ) : (
        <div className="banner placeholder" />
      )}

      <div className="detail-content">
        {/* Titre */}
        <h1>{name}</h1>
        <p className="city">{city}</p>

        {/* Badge plan */}
        <span className={`badge ${plan}`}>{plan.toUpperCase()}</span>

        {/* ⭐ étoiles cliquables uniquement premium */}
        <div className="stars">
          {[1, 2, 3, 4, 5, 6].map((star) => (
            <span
              key={star}
              onClick={() => plan === "premium" && setRating(star)}
              style={{
                cursor: plan === "premium" ? "pointer" : "default",
                color: star <= rating ? "gold" : "#555",
                fontSize: "24px",
                marginRight: "4px",
                userSelect: "none",
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* À propos */}
        <section>
          <h3>À propos</h3>
          <p>{bio}</p>
        </section>

        {/* Horaires */}
        <section>
          <h3>Horaires</h3>
          <p>{horaires}</p>
        </section>

        {/* Tarifs */}
        <section>
          <h3>Tarifs</h3>
          {tarifs.length === 0 ? (
            <p style={{ opacity: 0.75 }}>Aucun tarif renseigné.</p>
          ) : (
            tarifs.map((t, i) => (
              <div key={i} className="row">
                <span>{t.service}</span>
                <span>{t.price}</span>
              </div>
            ))
          )}
        </section>

        {/* Catalogue - seulement si premium */}
        {plan === "premium" && (
          <section>
            <h3>Catalogue</h3>
            {catalogue.length === 0 ? (
              <p style={{ opacity: 0.75 }}>Aucun produit renseigné.</p>
            ) : (
              catalogue.map((c, i) => (
                <div key={i} className="row">
                  <span>{c.produit}</span>
                  <span>{c.price}</span>
                </div>
              ))
            )}
          </section>
        )}

        {/* Galerie */}
        <section>
          <h3>Galerie</h3>
          {gallery.length === 0 ? (
            <p style={{ opacity: 0.75 }}>Aucune image pour le moment.</p>
          ) : (
            <div className="gallery">
              {gallery.map((img, i) => (
                <img key={i} src={img} alt={`gallery ${i + 1}`} />
              ))}
            </div>
          )}
        </section>

        {/* Boutons */}
        <button className="order-btn">Commander</button>

        {(plan === "premium" || plan === "vip") && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            Écrire sur WhatsApp
          </a>
        )}

        {plan === "premium" && (
          <button className="review-btn">Nous laisser un avis</button>
        )}
      </div>
    </div>
  );
};

export default SalonDetail;