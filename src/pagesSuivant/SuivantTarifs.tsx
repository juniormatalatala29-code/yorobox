import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ShieldCheck, FileText } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from "react-icons/fa6";
import { Link } from "react-router-dom";
 
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
 
/** ✅ CHAMPS = EXACTEMENT ceux du dashboard (anglais) */
type HomeCovers = {
  offersCoverUrl?: string;
  offersTitle?: string;
  offersSubtitle?: string;
 
  eventsCoverUrl?: string;
  eventsTitle?: string;
  eventsSubtitle?: string;
 
  heroCoverUrl?: string; // optionnel si un jour tu l'ajoutes dans le dashboard
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
 
  // ✅ Valeurs par défaut (si Firestore vide)
  const [covers, setCovers] = useState<HomeCovers>({
    offersTitle: "Offres du Moment",
    offersSubtitle: "Promotions et publicités.",
    eventsTitle: "Espace événementielle",
    eventsSubtitle: "Mariage, fêtes, shooting… Un espace “Yaka” avec photos, produits, services.",
    offersCoverUrl: "",
    eventsCoverUrl: "",
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
 
  // ✅ Lire EXACTEMENT le même doc que le dashboard: app_home/nos_services
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "app_home", "nos_services"));
        if (snap.exists()) {
          const data = snap.data() as HomeCovers;
          setCovers((prev) => ({ ...prev, ...data }));
        } else {
          console.warn("⚠️ app_home/nos_services n'existe pas (crée-le via dashboard).");
        }
      } catch (e) {
        console.error("❌ load covers error:", e);
      }
    })();
  }, []);
 
  // ✅ Charger salons Premium/VIP actifs
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
 
        const qy = query(
          collection(db, "salons"),
          where("status", "==", "active"),
          where("subscriptionType", "in", ["premium", "vip"])
        );
 
        const snap = await getDocs(qy);
 
        const data: PremiumSalon[] = snap.docs.map((d) => {
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
        });
 
        setAllPremium(data);
        setRotating3(pickRandom(data, 3));
      } catch (e) {
        console.error("❌ NosServices load salons error:", e);
        setAllPremium([]);
        setRotating3([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  useEffect(() => {
    if (allPremium.length <= 3) return;
    const interval = setInterval(() => {
      setRotating3(() => pickRandom(allPremium, 3));
    }, ROTATE_EVERY_MS);
    return () => clearInterval(interval);
  }, [allPremium]);
 
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
 
  // ✅ Hero: uniquement Firestore (sinon pas d'image)
  const heroBg = covers.heroCoverUrl?.trim() ? `url(${covers.heroCoverUrl})` : "none";
 
  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={{ ...styles.hero, backgroundImage: heroBg, backgroundColor: heroBg === "none" ? "rgba(255,255,255,0.03)" : undefined }}>
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
            <h2 style={styles.h2}>{covers.offersTitle || "Offres du Moment"}</h2>
            <p style={styles.p}>{covers.offersSubtitle || "Promotions et publicités."}</p>
            <button style={styles.cta} onClick={() => navigate("/offres")}>
              Voir les offres →
            </button>
          </div>
 
          <div
            style={{
              ...styles.wideImage,
              backgroundImage: covers.offersCoverUrl ? `url(${covers.offersCoverUrl})` : "none",
              backgroundColor: covers.offersCoverUrl ? undefined : "rgba(255,255,255,0.06)",
            }}
          >
            {!covers.offersCoverUrl && <div style={styles.noImage}>Aucune couverture</div>}
          </div>
        </div>
      </section>
 
      {/* Premium salons */}
      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.h2}>Nos Salons</h2>
          <button style={styles.linkBtn} onClick={() => navigate("/salons")}>
            Voir tout →
          </button>
        </div>
 
        {loading ? (
          <div style={{ opacity: 0.85, padding: "8px 2px" }}>Chargement…</div>
        ) : allPremium.length === 0 ? (
          <div style={{ opacity: 0.85, padding: "8px 2px" }}>Aucun salon Premium/VIP disponible pour le moment.</div>
        ) : (
          <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {showcase.map((salon) => (
              <button key={salon.id} style={styles.salonCard} onClick={() => navigate("/salon/" + salon.id)}>
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
                    <span style={styles.planBadge}>{(salon.plan || "premium").toUpperCase()}</span>
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
            <h2 style={styles.h2}>{covers.eventsTitle || "Espace événementielle"}</h2>
            <p style={styles.p}>{covers.eventsSubtitle || "Mariage, fêtes, shooting… Un espace “Yaka” avec photos, produits, services."}</p>
            <button style={styles.cta} onClick={() => navigate("/evenements")}>
              Découvrir →
            </button>
          </div>
 
          <div
            style={{
              ...styles.wideImageAlt,
              backgroundImage: covers.eventsCoverUrl ? `url(${covers.eventsCoverUrl})` : "none",
              backgroundColor: covers.eventsCoverUrl ? undefined : "rgba(255,255,255,0.06)",
            }}
          >
            {!covers.eventsCoverUrl && <div style={styles.noImage}>Aucune couverture</div>}
          </div>
        </div>
      </section>
 
      <YakaFooter />
      <div style={{ height: 24 }} />
    </div>
  );
};

const footerSocialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/share/1DYxq5CTHW/", icon: FaFacebookF },
  { name: "WhatsApp", href: "https://wa.me/243977506981", icon: FaWhatsapp },
  { name: "TikTok", href: "https://www.tiktok.com/@yaaaka50?_r=1&_t=ZS-94gcyKcHFhI", icon: FaTiktok },
  { name: "Instagram", href: "https://www.instagram.com/yaaaka50?igsh=bGhhZGNzaGp1dDNv", icon: FaInstagram },
  { name: "YouTube", href: "https://www.facebook.com/share/1DYxq5CTHW/", icon: FaYoutube },
];

function YakaFooter() {
  return (
    <footer style={styles.footerWrap}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={styles.footerCard}
      >
        <div style={styles.footerGlow} />
        <div style={styles.footerGlass} />

        <div style={styles.footerInner}>
          <div style={styles.footerTop}>
            <div style={styles.footerBrandBlock}>
              <div style={styles.footerBadge}>YAKA</div>
              <h3 style={styles.footerTitle}>Restez connectés à notre univers.</h3>
              <p style={styles.footerText}>
                Retrouvez YAKA sur nos réseaux sociaux et consultez nos pages légales en toute simplicité.
              </p>
            </div>

            <div style={styles.footerIcons}>
              {footerSocialLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    title={item.name}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    whileHover={{ y: -8, scale: 1.08, rotateX: 10, rotateY: -10 }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.footerIconLink}
                  >
                    <span style={styles.footerIconGlow} />
                    <Icon size={18} style={{ position: "relative", zIndex: 2 }} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div style={styles.footerDivider} />

          <div style={styles.footerBottom}>
            <div style={styles.footerLegalLinks}>
              <Link to="/politique-confidentialite" style={styles.footerLegalBtn}>
                <ShieldCheck size={16} />
                <span>Politique de confidentialité</span>
              </Link>

               <Link to="/conditions-utilisation" style={styles.footerLegalBtn}>
                 <FileText size={16} />
                 <span>Conditions d'utilisation</span>
                 </Link>
            </div>

            <p style={styles.footerCopyright}>© 2026 YAKA. Tous droits réservés.</p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
 
const styles: Record<string, React.CSSProperties> = {
  page: { background: BG, color: "white", minHeight: "100vh" },
 
  hero: { position: "relative", padding: "60px 18px 28px", backgroundSize: "cover", backgroundPosition: "center" },
  overlay: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(11,11,15,0.90))" },
  heroContent: { position: "relative", maxWidth: 980, margin: "0 auto" },
  title: { margin: 0, fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, letterSpacing: 0.3, textShadow: "0 2px 18px rgba(0,0,0,0.6)" },
  subtitle: { margin: "6px 0 18px", opacity: 0.9 },
 
  searchWrap: { display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.55)", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "12px 12px", backdropFilter: "blur(8px)" },
  searchIcon: { opacity: 0.8, fontSize: 18 },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 14, minWidth: 120 },
  searchButton: { background: GOLD, border: "none", padding: "10px 12px", borderRadius: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
 
  quickRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  quickBtn: { background: "rgba(255,255,255,0.08)", border: `1px solid ${BORDER}`, color: "white", padding: "10px 12px", borderRadius: 14, cursor: "pointer" },
 
  section: { maxWidth: 980, margin: "0 auto", padding: "18px" },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 },
  h2: { margin: 0, fontSize: 18, fontWeight: 900, color: "white" },
  p: { margin: "8px 0 14px", opacity: 0.85, lineHeight: 1.4 },
 
  cardWide: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 16, alignItems: "center" },
  wideImage: { height: 130, borderRadius: 14, border: `1px solid ${BORDER}`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.95, position: "relative", overflow: "hidden" },
 
  cardWideAlt: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 16, alignItems: "center" },
  wideImageAlt: { height: 130, borderRadius: 14, border: `1px solid ${BORDER}`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.95, position: "relative", overflow: "hidden" },
 
  noImage: { position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 0.8, fontWeight: 900 },
 
  cta: { background: GOLD, border: "none", padding: "10px 14px", borderRadius: 12, fontWeight: 900, cursor: "pointer" },
  linkBtn: { background: "transparent", border: `1px solid ${BORDER}`, color: "white", padding: "8px 12px", borderRadius: 12, cursor: "pointer" },
 
  grid: { display: "grid", gap: 12 },
  salonCard: { textAlign: "left", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", padding: 0, color: "white" },
  salonImg: { height: 140, backgroundSize: "cover", backgroundPosition: "center", position: "relative" },
  salonBody: { padding: 12 },
  salonName: { fontWeight: 900, marginBottom: 6, fontSize: 16 },
  salonMeta: { display: "flex", alignItems: "center", gap: 6, opacity: 0.9 },
  star: { color: GOLD, fontWeight: 900 },
  rating: { fontWeight: 900 },
  city: { marginTop: 6, opacity: 0.75, fontSize: 13 },
  planBadge: { display: "inline-block", padding: "6px 10px", borderRadius: 999, border: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.35)", color: GOLD, fontWeight: 900, fontSize: 12, letterSpacing: 0.6 },

  footerWrap: { maxWidth: 980, margin: "6px auto 0", padding: "0 18px 18px" },
  footerCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 28,
    border: `1px solid ${BORDER}`,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.35)",
  },
  footerGlow: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(212,175,55,0.12), transparent 28%)",
  },
  footerGlass: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04), transparent)",
  },
  footerInner: { position: "relative", padding: 22 },
  footerTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" },
  footerBrandBlock: { maxWidth: 520 },
  footerBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid rgba(212,175,55,0.28)",
    background: "rgba(212,175,55,0.10)",
    color: "#F5E7A1",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 2.2,
    marginBottom: 10,
  },
  footerTitle: { margin: 0, color: "white", fontSize: 24, fontWeight: 900, lineHeight: 1.2 },
  footerText: { margin: "10px 0 0", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, maxWidth: 500 },
  footerIcons: { display: "flex", gap: 12, flexWrap: "wrap" },
  footerIconLink: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    backdropFilter: "blur(16px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
    textDecoration: "none",
    transformStyle: "preserve-3d",
  },
  footerIconGlow: {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    background: "radial-gradient(circle, rgba(212,175,55,0.36), transparent 68%)",
    opacity: 0,
    transition: "opacity 220ms ease",
  },
  footerDivider: {
    height: 1,
    margin: "18px 0",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
  },
  footerBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" },
  footerLegalLinks: { display: "flex", gap: 10, flexWrap: "wrap" },
  footerLegalBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.88)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
  },
  footerCopyright: { margin: 0, color: "rgba(255,255,255,0.60)", fontSize: 13 },
};
 
export default NosServices;