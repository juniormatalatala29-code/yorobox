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
  desc?: string;
  badge?: string;
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
 
        const qy = query(
          collection(db, "ads"),
          where("active", "==", true),
          orderBy("createdAt", "desc")
        );
 
        const snap = await getDocs(qy);
 
        const data: Offre[] = snap.docs.map((d) => {
          const ad = d.data() as AdDoc;
 
          return {
            id: d.id,
            title: ad.title?.trim() || "Offre",
            desc: ad.desc?.trim() || "Cliquez pour voir l’offre.",
            imageUrl: ad.imageUrl?.trim() || "",
            link: ad.targetUrl?.trim() || "#",
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
    const cleanUrl = url.trim();
 
    if (!cleanUrl || cleanUrl === "#") return;
 
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      window.open(`https://${cleanUrl}`, "_blank", "noopener,noreferrer");
      return;
    }
 
    window.open(cleanUrl, "_blank", "noopener,noreferrer");
  };
 
  const hasData = useMemo(
    () =>
      offres.some(
        (o) => Boolean(o.imageUrl) && Boolean(o.link) && o.link !== "#"
      ),
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
          <div style={styles.stateBox}>Chargement…</div>
        ) : offres.length === 0 ? (
          <div style={styles.stateBox}>Aucune offre disponible pour le moment.</div>
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
                <div style={styles.coverWrap}>
                  {o.imageUrl ? (
                    <img
                      src={o.imageUrl.trim()}
                      alt={o.title}
                      style={styles.coverImg}
                    />
                  ) : (
                    <div style={styles.noImage}>Aucune image</div>
                  )}
 
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
          <div style={styles.bottomInfo}>
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
 
  container: { maxWidth: 1080, margin: "0 auto", padding: 18 },
 
  header: { marginBottom: 16, marginTop: 50 },
 
  title: { margin: 0, fontSize: 28, fontWeight: 900 },
 
  subtitle: { margin: "8px 0 0", opacity: 0.85, lineHeight: 1.5 },
 
  stateBox: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 16,
    opacity: 0.9,
  },
 
  grid: {
    display: "grid",
    gap: 14,
    marginTop: 14,
  },
 
  cardBtn: {
    textAlign: "left",
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    overflow: "hidden",
    cursor: "pointer",
    padding: 0,
    color: "white",
    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
  },
 
  coverWrap: {
    position: "relative",
    height: 180,
    background: "rgba(255,255,255,0.04)",
  },
 
  coverImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
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
    top: 12,
    left: 12,
    background: "rgba(0,0,0,0.65)",
    border: `1px solid ${BORDER}`,
    color: GOLD,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
  },
 
  body: { padding: 14 },
 
  cardTitle: {
    fontWeight: 900,
    marginBottom: 8,
    fontSize: 17,
  },
 
  desc: {
    opacity: 0.85,
    lineHeight: 1.5,
    marginBottom: 12,
    minHeight: 48,
  },
 
  link: {
    color: GOLD,
    fontWeight: 900,
  },
 
  bottomInfo: {
    marginTop: 12,
    opacity: 0.75,
    fontSize: 13,
  },
};
 
export default Offres;