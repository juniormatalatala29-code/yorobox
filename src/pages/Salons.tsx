import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/salons.css";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

type SubscriptionType = "standard" | "vip" | "premium";

type SalonDoc = {
  salonName?: string;
  email?: string;
  bio?: string;
  city?: string;

  // images (optionnel)
  profileImage?: string; // photo ronde (recommandé)
  bannerImage?: string; // fallback

  status?: "active" | "pending" | "disabled";
  subscriptionType?: SubscriptionType;

  createdAt?: any;
  uid?: string;
};

const PLAN_ORDER: Record<SubscriptionType, number> = {
  premium: 0,
  vip: 1,
  standard: 2,
};

const Salons: React.FC = () => {
  const [salons, setSalons] = useState<Array<{ id: string } & SalonDoc>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        // ✅ salons actifs
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
        // ✅ fallback si index manquant (ou createdAt absent)
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

  const sorted = useMemo(() => {
    return [...salons].sort((a, b) => {
      const pa = (a.subscriptionType || "standard") as SubscriptionType;
      const pb = (b.subscriptionType || "standard") as SubscriptionType;
      return PLAN_ORDER[pa] - PLAN_ORDER[pb];
    });
  }, [salons]);

  if (loading) {
    return (
      <div className="salons-page">
        <h1 className="salons-title">SALONS PREMIUM</h1>
        <p className="salons-loading">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="salons-page">
      <div className="salons-topbar">
        <h1 className="salons-title">SALONS PREMIUM</h1>
        <div className="salons-menu">☰</div>
      </div>

      {sorted.length === 0 && (
        <p className="salons-empty">Aucun salon disponible pour le moment.</p>
      )}

      <div className="salons-list">
        {sorted.map((salon) => {
          const plan = (salon.subscriptionType || "standard") as SubscriptionType;
          const name = salon.salonName || "Salon";
          const city = salon.city || "Kinshasa"; // ← si tu n'as pas city, on met un fallback
          const bio = salon.bio || "Salon de coiffure & beauté.";
          const avatar = salon.profileImage || salon.bannerImage || "";

          return (
            <Link
              key={salon.id}
              to={`/salon/${salon.id}`}
              className={`salon-card2 ${plan}`}
            >
              <div className="salon-left">
                {avatar ? (
                  <img className="salon-avatar" src={avatar} alt={name} />
                ) : (
                  <div className="salon-avatar placeholder" />
                )}
              </div>

              <div className="salon-middle">
                <div className="salon-name">{name}</div>
                <div className="salon-city">{city}</div>
                <div className="salon-bio">{bio}</div>
              </div>

              <div className="salon-right">
                <span className={`plan-badge ${plan}`}>{plan.toUpperCase()}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Salons;