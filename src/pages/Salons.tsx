import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/salons.css";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Modèle salon dans Firestore (collection: "salons")
 * docId = uid
 */
type SalonDoc = {
  salonName?: string;
  email?: string;
  subscriptionType?: "standard" | "vip" | "premium";
  bio?: string;
  bannerImage?: string; // URL ou chemin (si plus tard)
  status?: "active" | "pending" | "disabled";
  createdAt?: any;
};

const Salons: React.FC = () => {
  const [salons, setSalons] = useState<Array<{ id: string } & SalonDoc>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ Afficher seulement les salons actifs (recommandé)
        const q = query(
          collection(db, "salons"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as SalonDoc),
        }));

        setSalons(data);
      } catch (e) {
        // Si tu n'as pas encore "status" ou "createdAt" indexé, on fallback simple
        const snap = await getDocs(collection(db, "salons"));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as SalonDoc),
        }));
        setSalons(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="salons-container">
        <h1 className="salons-title">Liste des Salons</h1>
        <p style={{ opacity: 0.8, textAlign: "center" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="salons-container">
      <h1 className="salons-title">Liste des Salons</h1>

      {salons.length === 0 && (
        <p style={{ opacity: 0.85, textAlign: "center" }}>
          Aucun salon disponible pour le moment.
        </p>
      )}

      {salons.map((salon) => {
        const plan = salon.subscriptionType || "standard";
        const name = salon.salonName || "Salon";
        const bio = salon.bio || "Salon de coiffure & beauté.";

        return (
          <Link
            key={salon.id}
            to={`/salon/${salon.id}`}
            className={`salon-card ${plan}`}
          >
            {/* ✅ Image : si pas d'image, on affiche un bloc placeholder */}
            {salon.bannerImage ? (
              <img src={salon.bannerImage} className="salon-image" alt={name} />
            ) : (
              <div className="salon-image placeholder" />
            )}

            <div className="salon-info">
              <h2>{name}</h2>

              <span className={`badge ${plan}`}>
                {plan.toUpperCase()}
              </span>

              <p>{bio}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Salons;