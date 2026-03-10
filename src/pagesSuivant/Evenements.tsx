import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
 
const GOLD = "#D4AF37";
const BG = "#0B0B0F";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(212,175,55,0.25)";
const YAKA_WHATSAPP = "243977506981";
 
type EventDoc = {
  title?: string;
  description?: string;
  coverUrl?: string;
  whatsapp?: string;
  active?: boolean;
  createdAt?: any;
};
 
type UiHomeDoc = {
  eventsCoverUrl?: string;
  eventsTitle?: string;
  eventsSubtitle?: string;
  offersCoverUrl?: string;
};
 
type EventItem = {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  whatsapp?: string;
};
 
const Evenements: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [ui, setUi] = useState<UiHomeDoc>({});
  const [cols, setCols] = useState(3);
 
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 700) setCols(1);
      else if (w < 1024) setCols(2);
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
 
        const uiSnap = await getDoc(doc(db, "app_home", "nos_services"));
        if (uiSnap.exists()) {
          setUi(uiSnap.data() as UiHomeDoc);
        }
 
        const qy = query(
          collection(db, "events"),
          where("active", "==", true),
          orderBy("createdAt", "desc")
        );
 
        const snap = await getDocs(qy);
 
        const data: EventItem[] = snap.docs.map((d) => {
          const ev = d.data() as EventDoc;
          return {
            id: d.id,
            title: ev.title?.trim() || "Événement",
            description: ev.description?.trim() || "",
            coverUrl: ev.coverUrl?.trim() || "",
            whatsapp: ev.whatsapp?.trim() || "",
          };
        });
 
        setEvents(data);
      } catch (e) {
        console.error("❌ Evenements load error:", e);
        setUi({});
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  const heroTitle = ui.eventsTitle?.trim() || "Espace événementielle";
  const heroSubtitle =
    ui.eventsSubtitle?.trim() ||
    "Mariage, fêtes, shooting… Des packs beauté & coiffure premium, gérés par Yaka.";
 
  const heroCover = ui.eventsCoverUrl?.trim() || "";
 
  const openWhatsapp = (whatsappNumber?: string) => {
    const number = (whatsappNumber || "").replace(/\D/g, "");
    if (!number) {
      alert("Numéro WhatsApp manquant (à configurer dans l’admin).");
      return;
    }
 
    const message = encodeURIComponent(
      "Bonjour Yaka 👋 Je voudrais des infos sur l’Espace événementielle (mariage, fête, shooting)."
    );
 
    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
 
  const firstWhatsapp = useMemo(() => {
    const found = events.find((e) => !!e.whatsapp);
    return found?.whatsapp;
  }, [events]);
 
  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.hero,
          backgroundImage: heroCover ? `url(${heroCover})` : "none",
          backgroundColor: heroCover ? undefined : "rgba(255,255,255,0.03)",
        }}
      >
        <div style={styles.overlay} />
        <div style={styles.heroContent}>
          <div style={styles.badge}>YAKA • ÉVÉNEMENTIEL</div>
 
          <h1 style={styles.title}>{heroTitle}</h1>
          <p style={styles.subtitle}>{heroSubtitle}</p>
 
          <div style={styles.heroActions}>
            <button
              style={styles.whatsappBtn}
              onClick={() => openWhatsapp(YAKA_WHATSAPP)}
            >
              Nous contacter sur WhatsApp →
            </button>
          </div>
 
          {!heroCover && (
            <div style={styles.infoText}>
              Aucune couverture définie pour cette page.
            </div>
          )}
        </div>
      </div>
 
      <div style={styles.container}>
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <div>
              <h2 style={styles.h2}>Événements / Packs</h2>
              <p style={styles.sectionSubtitle}>
                Découvrez les offres événementielles actuellement disponibles.
              </p>
            </div>
          </div>
 
          {loading ? (
            <div style={styles.stateBox}>Chargement…</div>
          ) : events.length === 0 ? (
            <div style={styles.stateBox}>
              Aucun événement actif pour le moment.
            </div>
          ) : (
            <div
              style={{
                ...styles.grid,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {events.map((ev) => (
                <div key={ev.id} style={styles.card}>
                  <div style={styles.previewWrap}>
                    {ev.coverUrl ? (
                      <img
                        src={ev.coverUrl}
                        alt={ev.title}
                        style={styles.previewImage}
                      />
                    ) : (
                      <div style={styles.noImage}>Aucune image</div>
                    )}
                  </div>
 
                  <div style={styles.cardBody}>
                    <div style={styles.cardTitle}>{ev.title}</div>
 
                    {!!ev.description && (
                      <div style={styles.cardText}>{ev.description}</div>
                    )}
 
                    <div style={styles.cardFooter}>
                      {ev.whatsapp ? (
                        <button
                          style={styles.smallBtn}
                          onClick={() => openWhatsapp(ev.whatsapp)}
                        >
                          WhatsApp →
                        </button>
                      ) : (
                        <div style={styles.mutedText}>WhatsApp non défini</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
 
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};
 
const styles: Record<string, React.CSSProperties> = {
  page: {
    background: BG,
    color: "white",
    minHeight: "100vh",
  },
 
  hero: {
    position: "relative",
    minHeight: 320,
    padding: "60px 18px 32px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "end",
  },
 
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.50), rgba(11,11,15,0.92))",
  },
 
  heroContent: {
    position: "relative",
    maxWidth: 980,
    width: "100%",
    margin: "0 auto",
    zIndex: 1,
  },
 
  badge: {
    display: "inline-block",
    border: `1px solid ${BORDER}`,
    background: "rgba(0,0,0,0.45)",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: GOLD,
    marginBottom: 14,
    backdropFilter: "blur(6px)",
  },
 
  title: {
    margin: 0,
    fontSize: "clamp(30px, 5vw, 52px)",
    fontWeight: 900,
    lineHeight: 1.05,
    textShadow: "0 6px 24px rgba(0,0,0,0.45)",
  },
 
  subtitle: {
    margin: "12px 0 18px",
    opacity: 0.92,
    maxWidth: 760,
    lineHeight: 1.6,
    fontSize: 16,
  },
 
  heroActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 10,
  },
 
  whatsappBtn: {
    background: GOLD,
    border: "none",
    padding: "12px 16px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    color: "black",
    boxShadow: "0 10px 22px rgba(0,0,0,0.25)",
  },
 
  infoText: {
    marginTop: 12,
    opacity: 0.72,
    fontSize: 13,
  },
 
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "22px 18px",
  },
 
  section: {
    marginTop: 6,
  },
 
  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 12,
    marginBottom: 16,
  },
 
  h2: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
  },
 
  sectionSubtitle: {
    margin: "6px 0 0",
    opacity: 0.74,
    lineHeight: 1.5,
  },
 
  stateBox: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    padding: 18,
    opacity: 0.88,
  },
 
  grid: {
    display: "grid",
    gap: 16,
  },
 
  card: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },
 
  previewWrap: {
    position: "relative",
    height: 220,
    background: "rgba(255,255,255,0.04)",
  },
 
  previewImage: {
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
 
  cardBody: {
    padding: 16,
  },
 
  cardTitle: {
    fontWeight: 900,
    marginBottom: 8,
    color: "white",
    fontSize: 18,
    lineHeight: 1.2,
  },
 
  cardText: {
    opacity: 0.86,
    lineHeight: 1.55,
    minHeight: 60,
  },
 
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },
 
  smallBtn: {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    color: "white",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
 
  mutedText: {
    opacity: 0.68,
    fontSize: 13,
  },
};
 
export default Evenements;