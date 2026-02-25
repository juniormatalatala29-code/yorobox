import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/salons.css";
 
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
 
type SubscriptionType = "standard" | "vip" | "premium";
 
type SalonDoc = {
  salonName?: string;
  bio?: string;
  city?: string;
 
  profileImage?: string;
  bannerImage?: string;
 
  status?: "active" | "pending" | "disabled";
  subscriptionType?: SubscriptionType;
  createdAt?: any;
};
 
const Salons: React.FC = () => {
  const [salons, setSalons] = useState<Array<{ id: string } & SalonDoc>>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // ✅ salons actifs seulement
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
        // fallback si index / champs manquants
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
 
  const grouped = useMemo(() => {
    const premium: Array<{ id: string } & SalonDoc> = [];
    const vip: Array<{ id: string } & SalonDoc> = [];
    const standard: Array<{ id: string } & SalonDoc> = [];
 
    salons.forEach((s) => {
      const plan = (s.subscriptionType || "standard") as SubscriptionType;
      if (plan === "premium") premium.push(s);
      else if (plan === "vip") vip.push(s);
      else standard.push(s);
    });
 
    return { premium, vip, standard };
  }, [salons]);
 
  const renderGroup = (
    title: string,
    plan: SubscriptionType,
    items: Array<{ id: string } & SalonDoc>
  ) => {
    if (items.length === 0) return null;
 
    return (
      <section className="salons-group">
        <div className="salons-groupHeader">
          <h2 className="salons-groupTitle">{title}</h2>
          <span className={`salons-groupPill ${plan}`}>{items.length}</span>
        </div>
 
        <div className="salons-list">
          {items.map((salon) => {
            const name = salon.salonName || "Salon";
            const city = salon.city || "Kinshasa";
            const bio = salon.bio || "Salon de coiffure & beauté.";
            const avatar = salon.profileImage || salon.bannerImage || "";
 
            return (
              <Link
                key={salon.id}
                to={`/salon/${salon.id}`}
                className={`salon-item ${plan}`}
              >
                <div className="salon-avatarWrap">
                  {avatar ? (
                    <img className="salon-avatar" src={avatar} alt={name} />
                  ) : (
                    <div className="salon-avatar salon-avatar--placeholder" />
                  )}
                </div>
 
                <div className="salon-info">
                  <div className="salon-row1">
                    <div className="salon-name">{name}</div>
                    <span className={`salon-badge ${plan}`}>
                      {plan.toUpperCase()}
                    </span>
                  </div>
 
                  <div className="salon-city">{city}</div>
                  <div className="salon-bio">{bio}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  };
 
  return (
    <div className="salons-page">
      <h1 className="salons-title">LISTE DES SALONS</h1>
 
      {loading && <p className="salons-loading">Chargement...</p>}
 
      {!loading && salons.length === 0 && (
        <p className="salons-empty">Aucun salon disponible pour le moment.</p>
      )}
 
      {!loading && salons.length > 0 && (
        <>
          {renderGroup("SALONS PREMIUM", "premium", grouped.premium)}
          {renderGroup("SALONS VIP", "vip", grouped.vip)}
          {renderGroup("SALONS STANDARD", "standard", grouped.standard)}
        </>
      )}
    </div>
  );
};
 
export default Salons;