import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
 
const GOLD = "#D4AF37";
const BG = "#0B0B0F";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(212,175,55,0.25)";
 
type EventDoc = {
  title?: string;
  description?: string;
  coverUrl?: string;   // image principale de l’event (si tu veux)
  whatsapp?: string;   // numéro WhatsApp
  active?: boolean;
  createdAt?: any;
};
 
type UiHomeDoc = {
  eventsCoverUrl?: string; // ✅ couverture HERO de la page événements
  eventsTitle?: string;
  eventsSubtitle?: string;
 
  // (au cas où tu veux aussi gérer offres)
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
 
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
 
        // ✅ 1) Couverture HERO depuis ui/home
        const uiSnap = await getDoc(doc(db, "app_home", "nos_services"));
        if (uiSnap.exists()) setUi(uiSnap.data() as UiHomeDoc);
 
        // ✅ 2) Events actifs depuis collection events
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
            coverUrl: ev.coverUrl,
            whatsapp: ev.whatsapp,
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
  const heroCover = ui.eventsCoverUrl?.trim();
 
  const openWhatsapp = (whatsappNumber?: string) => {
    const number = (whatsappNumber || "").replace(/\D/g, ""); // garde que chiffres
    if (!number) return alert("Numéro WhatsApp manquant (à configurer dans l’admin).");
 
    const message = encodeURIComponent(
      "Bonjour Yaka 👋 Je voudrais des infos sur l’Espace événementielle (mariage, fête, shooting)."
    );
 
    window.open(`https://wa.me/${number}?text=${message}`, "_blank", "noopener,noreferrer");
  };
 
  const firstWhatsapp = useMemo(() => {
    // si tu veux un bouton global, on prend le 1er event qui a un whatsapp
    const found = events.find((e) => !!e.whatsapp);
    return found?.whatsapp;
  }, [events]);
 
  return (
    <div style={styles.page}>
      {/* Header */}
      <div
        style={{
          ...styles.hero,
          backgroundImage: heroCover ? `url(${heroCover})` : "none",
          backgroundColor: heroCover ? undefined : "rgba(255,255,255,0.04)",
        }}
      >
        <div style={styles.overlay} />
        <div style={styles.heroContent}>
          <div style={styles.badge}>YAKA • ÉVÉNEMENTIEL</div>
 
          <h1 style={styles.title}>{heroTitle}</h1>
          <p style={styles.subtitle}>{heroSubtitle}</p>
 
          <button style={styles.whatsappBtn} onClick={() => openWhatsapp(firstWhatsapp)}>
            Contacter sur WhatsApp →
          </button>
 
          {!heroCover && (
            <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13 }}>
              (Couverture non définie — à ajouter dans Firestore: ui/home → eventsCoverUrl)
            </div>
          )}
        </div>
      </div>
 
      {/* Contenu */}
      <div style={styles.container}>
        <section style={styles.section}>
          <h2 style={styles.h2}>Événements / Packs</h2>
 
          {loading ? (
            <div style={{ opacity: 0.85 }}>Chargement…</div>
          ) : events.length === 0 ? (
            <div style={{ opacity: 0.85 }}>
              Aucun événement actif pour le moment (à gérer dans le dashboard admin).
            </div>
          ) : (
            <div style={styles.grid3}>
              {events.map((ev) => (
                <div key={ev.id} style={styles.card}>
                  <div style={styles.cardTitle}>{ev.title}</div>
                  {!!ev.description && <div style={styles.cardText}>{ev.description}</div>}
 
                  <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                    {ev.whatsapp ? (
                      <button style={styles.smallBtn} onClick={() => openWhatsapp(ev.whatsapp)}>
                        WhatsApp →
                      </button>
                    ) : (
                      <div style={{ opacity: 0.7, fontSize: 13 }}>
                        WhatsApp non défini
                      </div>
                    )}
                  </div>
 
                  {!!ev.coverUrl && (
                    <div
                      style={{
                        ...styles.preview,
                        backgroundImage: `url(${ev.coverUrl})`,
                      }}
                    />
                  )}
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
    background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(11,11,15,0.93))",
  },
  heroContent: { position: "relative", maxWidth: 980, margin: "0 auto" },
 
  badge: {
    display: "inline-block",
    border: `1px solid ${BORDER}`,
    background: "rgba(0,0,0,0.45)",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 900,
    letterSpacing: 0.5,
    color: GOLD,
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 900,
    textShadow: "0 2px 18px rgba(0,0,0,0.6)",
  },
  subtitle: { margin: "10px 0 16px", opacity: 0.9, maxWidth: 700 },
 
  whatsappBtn: {
    background: GOLD,
    border: "none",
    padding: "12px 14px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
 
  container: { maxWidth: 980, margin: "0 auto", padding: 18 },
  section: { marginTop: 18 },
  h2: { margin: "0 0 10px", fontSize: 18, fontWeight: 900 },
 
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },
  card: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 14,
  },
  cardTitle: { fontWeight: 900, marginBottom: 6, color: "white" },
  cardText: { opacity: 0.85, lineHeight: 1.4 },
 
  smallBtn: {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    color: "white",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
 
  preview: {
    marginTop: 12,
    height: 140,
    borderRadius: 14,
    border: `1px solid ${BORDER}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};
 
export default Evenements;