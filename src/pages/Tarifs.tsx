import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
 
type SubscriptionType = "standard" | "vip" | "premium";
 
type SalonDoc = {
  salonName?: string;
  city?: string;
  bio?: string;
  bannerImage?: string;
  profileImage?: string;
  subscriptionType?: SubscriptionType;
  status?: "active" | "pending" | "disabled";
  createdAt?: any;
};
 
type PremiumSalon = {
  id: string;
  name: string;
  city: string;
  rating: number;
  distance: string;
  coverUrl?: string;
  plan?: SubscriptionType;
};
 
type HomeCovers = {
  offresCoverUrl?: string;
  evenementsCoverUrl?: string;
  offresTitle?: string;
  offresSubtitle?: string;
  evenementsTitle?: string;
  evenementsSubtitle?: string;
 
  // Optionnel si un jour tu veux gérer aussi l'image du hero
  heroCoverUrl?: string;
};
 
const GOLD = "#D4AF37";
const BG = "#0B0B0F";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(212,175,55,0.25)";
 
const ROTATE_EVERY_MS = 2 * 60 * 1000;
 
function pickRandom<T>(arr: T[], n: number) {
  if (arr.length <= n) return arr;
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
 
const NosServices: React.FC = () => {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState("");
 
  const [loading, setLoading] = useState(true);
  const [allPremium, setAllPremium] = useState<PremiumSalon[]>([]);
  const [rotating3, setRotating3] = useState<PremiumSalon[]>([]);
  const [cols, setCols] = useState(3);
 
  // ✅ Couvertures (depuis Firestore app_home/main)
  const [covers, setCovers] = useState<HomeCovers>({
    offresTitle: "Offres du Moment",
    offresSubtitle: "Promotions et publicités (gérées par le dashboard admin).",
    evenementsTitle: "Espace événementielle",
    evenementsSubtitle:
      "Mariage, fêtes, shooting… Un espace “Yaka” avec photos, produits, services.",
    offresCoverUrl: "",
    evenementsCoverUrl: "",
  });
 
  // responsive grid
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 560) setCols(1);
      else if (w < 900) setCols(2);
      else setCols(3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
 
  // ✅ Charger les couvertures depuis Firestore: app_home/main
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "app_home", "main"));
        if (snap.exists()) {
          const data = snap.data() as HomeCovers;
          setCovers((prev) => ({ ...prev, ...data }));
        } else {
          console.warn("⚠️ Firestore: app_home/main n'existe pas.");
        }
      } catch (e) {
        console.error("❌ load covers error:", e);
      }
    })();
  }, []);
 
  // ✅ Charger salons Premium/VIP actifs depuis Firestore
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
 
        // Query principale: status active + subscriptionType in (premium/vip)
        const qy = query(
          collection(db, "salons"),
          where("status", "==", "active"),
          where("subscriptionType", "in", ["premium", "vip"])
        );
 
        const snap = await getDocs(qy);
 
        const data: PremiumSalon[] = snap.docs.map((d) => {
          const s = d.data() as SalonDoc;
 
          const name = s.salonName?.trim() || "Salon";
          const city = s.city?.trim() || "Kinshasa";
          const coverUrl = s.bannerImage || s.profileImage || undefined;
 
          // petit rating fake (si tu n'as pas encore un vrai champ rating)
          const rating = 4.7 + Math.random() * 0.2;
 
          return {
            id: d.id,
            name,
            city,
            rating,
            distance: "",
            coverUrl,
            plan: s.subscriptionType,
          };
        });
 
        setAllPremium(data);
        setRotating3(pickRandom(data, 3));
      } catch (e) {
        // Fallback si index manquant OU règles bloquent la query "in"
        console.error("❌ NosServices load salons error:", e);
 
        try {
          const snap2 = await getDocs(
            query(collection(db, "salons"), where("status", "==", "active"))
          );
 
          const data2: PremiumSalon[] = snap2.docs
            .map((d) => {
              const s = d.data() as SalonDoc;
              return {
                id: d.id,
                name: s.salonName?.trim() || "Salon",
                city: s.city?.trim() || "Kinshasa",
                rating: 4.7 + Math.random() * 0.2,
                distance: "",
                coverUrl: s.bannerImage || s.profileImage || undefined,
                plan: s.subscriptionType,
              };
            })
            .filter((x) => x.plan === "premium" || x.plan === "vip");
 
          setAllPremium(data2);
          setRotating3(pickRandom(data2, 3));
        } catch (e2) {
          console.error("❌ Fallback salons error:", e2);
          setAllPremium([]);
          setRotating3([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  // ✅ Rotation automatique (si + de 3)
  useEffect(() => {
    if (allPremium.length <= 3) return;
    const interval = setInterval(() => {
      setRotating3((prev) => {
        const next = pickRandom(allPremium, 3);
        const prevIds = prev.map((p) => p.id).sort().join(",");
        const nextIds = next.map((p) => p.id).sort().join(",");
        if (prevIds === nextIds) return pickRandom(allPremium, 3);
        return next;
      });
    }, ROTATE_EVERY_MS);
 
    return () => clearInterval(interval);
  }, [allPremium]);
 
  // Search
  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return allPremium;
    return allPremium.filter((s) => s.name.toLowerCase().includes(q));
  }, [queryText, allPremium]);
 
  const showcase = useMemo(() => {
    const q = queryText.trim();
    if (!q) return rotating3;
    return filtered.slice(0, 3);
  }, [queryText, rotating3, filtered]);
 
  // Hero image: soit Firestore heroCoverUrl (si tu le crées), sinon l'image par défaut
  const heroBg = covers.heroCoverUrl?.trim()
    ? `url(${covers.heroCoverUrl})`
    : `url(https://images.unsplash.com/photo-1560067174-8943bd8f2662?auto=format&fit=crop&w=1400&q=60)`;
 
  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={{ ...styles.hero, backgroundImage: heroBg }}>
        <div style={styles.overlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Trouvez votre salon de coiffure</h1>
          <p style={styles.subtitle}>Réservez en quelques clics</p>
 
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              style={styles.searchInput}
              placeholder="Rechercher un salon..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
            <button
              style={styles.searchButton}
              onClick={() => {
                if (filtered.length === 1) navigate(`/salon/${filtered[0].id}`);
                else navigate("/salons");
              }}
            >
              Rechercher
            </button>
          </div>
 
          <div style={styles.quickRow}>
            <button style={styles.quickBtn} onClick={() => navigate("/salons")}>
              Catégories
            </button>
            <button style={styles.quickBtn} onClick={() => navigate("/salons")}>
              À proximité
            </button>
          </div>
        </div>
      </div>
 
      {/* Offres */}
      <section style={styles.section}>
        <div style={styles.cardWide}>
          <div>
            <h2 style={styles.h2}>{covers.offresTitle || "Offres du Moment"}</h2>
            <p style={styles.p}>
              {covers.offresSubtitle ||
                "Promotions et publicités (gérées par le dashboard admin)."}
            </p>
            <button style={styles.cta} onClick={() => navigate("/offres")}>
              Voir les offres →
            </button>
          </div>
 
          <div
            style={{
              ...styles.wideImage,
              backgroundImage: covers.offresCoverUrl
                ? `url(${covers.offresCoverUrl})`
                : "none",
              backgroundColor: covers.offresCoverUrl
                ? undefined
                : "rgba(255,255,255,0.06)",
            }}
          >
            {!covers.offresCoverUrl && (
              <div style={styles.noImage}>Aucune couverture</div>
            )}
          </div>
        </div>
      </section>
 
      {/* Premium salons */}
      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.h2}>Nos Salons (Premium)</h2>
          <button style={styles.linkBtn} onClick={() => navigate("/salons")}>
            Voir tout →
          </button>
        </div>
 
        {loading ? (
          <div style={{ opacity: 0.85, padding: "8px 2px" }}>Chargement…</div>
        ) : allPremium.length === 0 ? (
          <div style={{ opacity: 0.85, padding: "8px 2px" }}>
            Aucun salon Premium/VIP disponible pour le moment.
          </div>
        ) : (
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {showcase.map((salon) => (
              <button
                key={salon.id}
                style={styles.salonCard}
                onClick={() => navigate("/salon/" + salon.id)}
              >
                <div
                  style={{
                    ...styles.salonImg,
                    backgroundImage: salon.coverUrl ? `url(${salon.coverUrl})` : "none",
                    backgroundColor: salon.coverUrl ? undefined : "rgba(255,255,255,0.06)",
                  }}
                >
                  {!salon.coverUrl && <div style={styles.noImage}>Pas d’image</div>}
                </div>
 
                <div style={styles.salonBody}>
                  <div style={styles.salonName}>{salon.name}</div>
 
                  <div style={styles.salonMeta}>
                    <span style={styles.star}>★</span>
                    <span style={styles.rating}>{salon.rating.toFixed(1)}</span>
                  </div>
 
                  <div style={styles.city}>{salon.city}</div>
 
                  <div style={{ marginTop: 10 }}>
                    <span style={styles.planBadge}>
                      {(salon.plan || "premium").toUpperCase()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
 
      {/* Événements */}
      <section style={styles.section}>
        <div style={styles.cardWideAlt}>
          <div>
            <h2 style={styles.h2}>
              {covers.evenementsTitle || "Espace événementielle"}
            </h2>
            <p style={styles.p}>
              {covers.evenementsSubtitle ||
                "Mariage, fêtes, shooting… Un espace “Yaka” avec photos, produits, services."}
            </p>
            <button style={styles.cta} onClick={() => navigate("/evenements")}>
              Découvrir →
            </button>
          </div>
 
          <div
            style={{
              ...styles.wideImageAlt,
              backgroundImage: covers.evenementsCoverUrl
                ? `url(${covers.evenementsCoverUrl})`
                : "none",
              backgroundColor: covers.evenementsCoverUrl
                ? undefined
                : "rgba(255,255,255,0.06)",
            }}
          >
            {!covers.evenementsCoverUrl && (
              <div style={styles.noImage}>Aucune couverture</div>
            )}
          </div>
        </div>
      </section>
 
      <div style={{ height: 24 }} />
    </div>
  );
};
 
const styles: Record<string, React.CSSProperties> = {
  page: { background: BG, color: "white", minHeight: "100vh" },
 
  hero: {
    position: "relative",
    padding: "42px 18px 28px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(11,11,15,0.90))",
  },
  heroContent: { position: "relative", maxWidth: 980, margin: "0 auto" },
  title: {
    margin: 0,
    fontSize: "clamp(22px, 4vw, 32px)",
    fontWeight: 800,
    letterSpacing: 0.3,
    textShadow: "0 2px 18px rgba(0,0,0,0.6)",
  },
  subtitle: { margin: "6px 0 18px", opacity: 0.9 },
 
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(0,0,0,0.55)",
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: "12px 12px",
    backdropFilter: "blur(8px)",
  },
  searchIcon: { opacity: 0.8, fontSize: 18 },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: 14,
    minWidth: 120,
  },
  searchButton: {
    background: GOLD,
    border: "none",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
 
  quickRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  quickBtn: {
    background: "rgba(255,255,255,0.08)",
    border: `1px solid ${BORDER}`,
    color: "white",
    padding: "10px 12px",
    borderRadius: 14,
    cursor: "pointer",
  },
 
  section: { maxWidth: 980, margin: "0 auto", padding: "18px" },
  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
 
  h2: { margin: 0, fontSize: 18, fontWeight: 900, color: "white" },
  p: { margin: "8px 0 14px", opacity: 0.85, lineHeight: 1.4 },
 
  cardWide: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 14,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  wideImage: {
    height: 130,
    borderRadius: 14,
    border: `1px solid ${BORDER}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.95,
    position: "relative",
    overflow: "hidden",
  },
 
  cardWideAlt: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 14,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  wideImageAlt: {
    height: 130,
    borderRadius: 14,
    border: `1px solid ${BORDER}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.95,
    position: "relative",
    overflow: "hidden",
  },
 
  noImage: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    opacity: 0.8,
    fontWeight: 900,
  },
 
  cta: {
    background: GOLD,
    border: "none",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
  linkBtn: {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    color: "white",
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
  },
 
  grid: { display: "grid", gap: 12 },
 
  salonCard: {
    textAlign: "left",
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    padding: 0,
    color: "white",
  },
  salonImg: {
    height: 140,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  salonBody: { padding: 12 },
  salonName: { fontWeight: 900, marginBottom: 6, fontSize: 16 },
  salonMeta: { display: "flex", alignItems: "center", gap: 6, opacity: 0.9 },
  star: { color: GOLD, fontWeight: 900 },
  rating: { fontWeight: 900 },
  city: { marginTop: 6, opacity: 0.75, fontSize: 13 },
  planBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${BORDER}`,
    background: "rgba(0,0,0,0.35)",
    color: GOLD,
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.6,
  },
};
 
export default NosServices;

/*import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "../pages/Multimedia.css";

import "swiper/css/bundle";

const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",
  "/images/image7.jpg",
  "/images/image8.jpg",
  "/images/image9.jpg",
  "/images/image10.jpg",
  "/images/image11.jpg",
  "/images/image12.jpg",
  "/images/image13.jpg",
];

export default function Multimedia() {
  return (
    <section className="multimedia-section">

      <div className="content-wrapper">
        {/* CARD }
        <div className="glass-card">
          <h2 className="title">Nos Modèles Signature</h2>
          <p className="subtitle">
            Découvrez l’élégance, le style et la perfection de nos coiffures
          </p>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop
            className="swiper-container"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="image-wrapper">
                  <img src={img} alt={`Modèle ${index}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* BOUTON SOUS LA CARD  }
        <div className="bottom-section">
          <Link to="/formulaire">
            <button className="cta-button">Commencer ma réservation</button>
          </Link>
          <footer className="Tarifs-footer">
            Une Application Web développée par YoroBox
          </footer>
        </div>
      </div>
    </section>
  );
} */
