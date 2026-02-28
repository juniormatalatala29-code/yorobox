import React from "react";
 
const GOLD = "#D4AF37";
const BG = "#0B0B0F";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(212,175,55,0.25)";
 
type Offre = {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  link: string; // ✅ lien vers site annonceur
  badge?: string;
};
 
const Offres: React.FC = () => {
  // ✅ Demo offres (plus tard : Firestore via dashboard admin)
  const offres: Offre[] = [
    {
      id: "1",
      title: "Promo mèches -50%",
      desc: "Réduction limitée, cliquez pour voir l’offre.",
      imageUrl:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=60",
      link: "https://example.com",
      badge: "-50%",
    },
    {
      id: "2",
      title: "Formation coiffure",
      desc: "Inscription ouverte. Cliquez pour plus d’infos.",
      imageUrl:
        "https://images.unsplash.com/photo-1560067174-8943bd8f2662?auto=format&fit=crop&w=1200&q=60",
      link: "https://example.com",
      badge: "NEW",
    },
    {
      id: "3",
      title: "Produits beauté",
      desc: "Nouveaux produits disponibles.",
      imageUrl:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=60",
      link: "https://example.com",
    },
  ];
 
  const openLink = (url: string) => {
    window.open(url, "_blank");
  };
 
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Offres du moment</h1>
          <p style={styles.subtitle}>
            Publicités & promotions (tu les contrôles plus tard via le dashboard
            admin).
          </p>
        </div>
 
        <div style={styles.grid}>
          {offres.map((o) => (
            <button
              key={o.id}
              style={styles.cardBtn}
              onClick={() => openLink(o.link)}
            >
              <div
                style={{
                  ...styles.cover,
                  backgroundImage: `url(${o.imageUrl})`,
                }}
              >
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
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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