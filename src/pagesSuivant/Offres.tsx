import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
 
const GOLD = "#D4AF37";
const BG = "#0B0B0F";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(212,175,55,0.25)";
 
type AdDoc = {
  title?: string;
  imageUrl?: string;
  targetUrl?: string;
  desc?: string; // ✅ optionnel si tu l’ajoutes dans Firestore plus tard
  badge?: string; // ✅ optionnel
  active?: boolean;
  createdAt?: Timestamp | null;
};
 
type Offre = {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  link: string;
  badge?: string;
};
 
const Offres: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [cols, setCols] = useState(3);
 
  // ✅ Responsive columns
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
 
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
 
        // ✅ pubs actives, triées par date
        // ⚠️ Si Firestore demande un index, crée-le via le lien dans la console
        const qy = query(
          collection(db, "ads"),
          where("active", "==", true),
          orderBy("createdAt", "desc")
        );
 
        const snap = await getDocs(qy);
 
        const data: Offre[] = snap.docs.map((d) => {
          const ad = d.data() as AdDoc;
 
          const title = ad.title?.trim() || "Offre";
          const imageUrl = ad.imageUrl?.trim() || "";
          const link = ad.targetUrl?.trim() || "#";
 
          return {
            id: d.id,
            title,
            // ✅ si tu ajoutes "desc" dans Firestore, il sera pris automatiquement
            desc: ad.desc?.trim() || "Cliquez pour voir l’offre.",
            imageUrl,
            link,
            // ✅ si tu ajoutes "badge" dans Firestore, il sera pris automatiquement
            badge: ad.badge?.trim() || "",
          };
        });
 
        setOffres(data);
      } catch (e) {
        console.error("❌ Offres load error:", e);
        setOffres([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  const openLink = (url: string) => {
    if (!url || url === "#") return;
    window.open(url, "_blank", "noopener,noreferrer");
  };
 
  const hasData = useMemo(
    () => offres.some((o) => Boolean(o.imageUrl) && Boolean(o.link) && o.link !== "#"),
    [offres]
  );
 
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Offres du moment</h1>
          <p style={styles.subtitle}>Publicités & promotions.</p>
        </div>
 
        {loading ? (
          <div style={{ opacity: 0.85, padding: "8px 2px" }}>Chargement…</div>
        ) : offres.length === 0 ? (
          <div style={{ opacity: 0.85, padding: "8px 2px" }}>
            Aucune offre disponible pour le moment.
          </div>
        ) : (
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {offres.map((o) => (
              <button
                key={o.id}
                style={styles.cardBtn}
                onClick={() => openLink(o.link)}
                title={o.link}
              >
                <div
                  style={{
                    ...styles.cover,
                    backgroundImage: o.imageUrl ? `url(${o.imageUrl})` : "none",
                    backgroundColor: o.imageUrl ? undefined : "rgba(255,255,255,0.06)",
                  }}
                >
                  {!o.imageUrl && <div style={styles.noImage}>Aucune image</div>}
                  {o.badge ? <div style={styles.badge}>{o.badge}</div> : null}
                </div>
 
                <div style={styles.body}>
                  <div style={styles.cardTitle}>{o.title}</div>
                  <div style={styles.desc}>{o.desc}</div>
                  <div style={styles.link}>Voir →</div>
                </div>
              </button>
            ))}
          </div>
        )}
 
        {!loading && !hasData && offres.length > 0 && (
          <div style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
            Certaines offres n’ont pas encore d’image ou de lien.
          </div>
        )}
 
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};
 
const styles: Record<string, React.CSSProperties> = {
  page: { background: BG, color: "white", minHeight: "100vh" },
  container: { maxWidth: 980, margin: "0 auto", padding: 18 },
  header: { marginBottom: 14 },
  title: { margin: 0, fontSize: 26, fontWeight: 900 },
  subtitle: { margin: "8px 0 0", opacity: 0.85, lineHeight: 1.5 },
 
  grid: {
    display: "grid",
    gap: 12,
    marginTop: 14,
  },
 
  cardBtn: {
    textAlign: "left",
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    padding: 0,
    color: "white",
  },
  cover: {
    height: 140,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  noImage: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    opacity: 0.75,
    fontWeight: 900,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "rgba(0,0,0,0.65)",
    border: `1px solid ${BORDER}`,
    color: GOLD,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
  },
  body: { padding: 12 },
  cardTitle: { fontWeight: 900, marginBottom: 6 },
  desc: { opacity: 0.85, lineHeight: 1.4, marginBottom: 10 },
  link: { color: GOLD, fontWeight: 900 },
};
 
export default Offres;