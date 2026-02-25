import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
 
import "../styles/detail.css";
 
type SubscriptionType = "standard" | "vip" | "premium";
 
type SalonDoc = {
  salonName?: string;
  bio?: string;
  city?: string;
  horaires?: string;
 
  subscriptionType?: SubscriptionType;
 
  bannerImage?: string;
  profileImage?: string;
 
  gallery?: string[];
  tarifs?: Array<{ service: string; price: string }>;
  catalogue?: Array<{ produit: string; price: string }>;
 
  whatsapp?: string;
};
 
const DEFAULT_WHATSAPP = "243811298054";
 
const SalonDetail: React.FC = () => {
  const { id } = useParams();
  const [salon, setSalon] = useState<SalonDoc | null>(null);
  const [loading, setLoading] = useState(true);
 
  // avis premium only
  const [rating, setRating] = useState<number>(0);
 
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (!id) {
          setSalon(null);
          return;
        }
        const snap = await getDoc(doc(db, "salons", id));
        setSalon(snap.exists() ? (snap.data() as SalonDoc) : null);
      } catch {
        setSalon(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
 
  const plan = useMemo<SubscriptionType>(() => {
    return (salon?.subscriptionType || "standard") as SubscriptionType;
  }, [salon]);
 
  const canWhatsApp = plan === "premium" || plan === "vip";
  const canReview = plan === "premium";
  const canCatalogue = plan === "premium";
 
  if (loading) {
    return (
      <div className={`detail-page ${plan}`}>
        <div className="detail-card">
          <p className="detail-loading">Chargement…</p>
        </div>
      </div>
    );
  }
 
  if (!salon) {
    return (
      <div className="detail-page standard">
        <div className="detail-card">
          <p className="detail-loading">Salon introuvable</p>
        </div>
      </div>
    );
  }
 
  const name = salon.salonName || "Salon";
  const city = salon.city || "Kinshasa";
  const bio = salon.bio || "Salon de coiffure & beauté.";
  const horaires = salon.horaires || "Horaires non renseignés";
  const whatsapp = salon.whatsapp || DEFAULT_WHATSAPP;
 
  const tarifs = salon.tarifs || [];
  const catalogue = salon.catalogue || [];
  const gallery = salon.gallery || [];
 
  const banner = salon.bannerImage || "";
  const avatar = salon.profileImage || salon.bannerImage || "";
 
  return (
    <div className={`detail-page ${plan}`}>
      <div className="detail-bannerWrap">
        {banner ? (
          <img src={banner} className="detail-banner" alt={name} />
        ) : (
          <div className="detail-bannerPlaceholder" />
        )}
 
        <div className="detail-bannerShade" />
 
        <div className="detail-headerOverlay">
          <div className="detail-avatarWrap">
            {avatar ? (
              <img src={avatar} className="detail-avatar" alt={name} />
            ) : (
              <div className="detail-avatarPlaceholder" />
            )}
          </div>
 
          <div className="detail-headerText">
            <h1 className="detail-title">{name}</h1>
            <p className="detail-city">{city}</p>
          </div>
 
          <span className={`detail-badge ${plan}`}>{plan.toUpperCase()}</span>
        </div>
      </div>
 
      <div className="detail-card">
        {/* ⭐ étoiles visibles, mais cliquables uniquement premium */}
        <div className="detail-stars">
          {[1, 2, 3, 4, 5, 6].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${star <= rating ? "active" : ""} ${
                canReview ? "clickable" : "locked"
              }`}
              onClick={() => canReview && setRating(star)}
              disabled={!canReview}
              aria-label={`Donner ${star} étoiles`}
            >
              ★
            </button>
          ))}
        </div>
 
        <section className="detail-section">
          <h3>À propos</h3>
          <p className="detail-text">{bio}</p>
        </section>
 
        <section className="detail-section">
          <h3>Horaires</h3>
          <p className="detail-text">{horaires}</p>
        </section>
 
        <section className="detail-section">
          <h3>Tarifs</h3>
          {tarifs.length === 0 ? (
            <p className="detail-muted">Aucun tarif renseigné.</p>
          ) : (
            <div className="detail-rows">
              {tarifs.map((t, i) => (
                <div key={i} className="detail-row">
                  <span className="row-left">{t.service}</span>
                  <span className="row-right">{t.price}</span>
                </div>
              ))}
            </div>
          )}
        </section>
 
        {/* ✅ Catalogue seulement si premium (sinon on NE MONTRE RIEN au client) */}
        {canCatalogue && (
          <section className="detail-section">
            <h3>Catalogue</h3>
            {catalogue.length === 0 ? (
              <p className="detail-muted">Aucun produit renseigné.</p>
            ) : (
              <div className="detail-rows">
                {catalogue.map((c, i) => (
                  <div key={i} className="detail-row">
                    <span className="row-left">{c.produit}</span>
                    <span className="row-right">{c.price}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
 
        <section className="detail-section">
          <h3>Galerie</h3>
          {gallery.length === 0 ? (
            <p className="detail-muted">Aucune image pour le moment.</p>
          ) : (
            <div className="detail-gallery">
              {gallery.map((img, i) => (
                <img key={i} src={img} alt={`Réalisation ${i + 1}`} />
              ))}
            </div>
          )}
        </section>
 
        <div className="detail-actions">
          <button className="btn-primary" type="button">
            Commander
          </button>
 
          {canWhatsApp && (
            <a
              className="btn-secondary"
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Écrire sur WhatsApp
            </a>
          )}
 
          {canReview && (
            <button className="btn-tertiary" type="button">
              Nous laisser un avis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default SalonDetail;