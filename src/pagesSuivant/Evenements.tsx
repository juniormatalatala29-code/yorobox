import React from "react";
 
const GOLD = "#D4AF37";
const BG = "#0B0B0F";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(212,175,55,0.25)";
 
const Evenements: React.FC = () => {
  const whatsappNumber = "243000000000"; // ✅ Mets ton numéro WhatsApp (format international, sans +)
  const message = encodeURIComponent(
    "Bonjour Yaka 👋 Je voudrais des infos sur l’Espace événementielle (mariage, fête, shooting)."
  );
 
  const openWhatsapp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };
 
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.hero}>
        <div style={styles.overlay} />
        <div style={styles.heroContent}>
          <div style={styles.badge}>YAKA • ÉVÉNEMENTIEL</div>
          <h1 style={styles.title}>Espace événementielle</h1>
          <p style={styles.subtitle}>
            Mariage, fêtes, shooting… Des packs beauté & coiffure premium, gérés
            par Yaka.
          </p>
 
          <button style={styles.whatsappBtn} onClick={openWhatsapp}>
            Contacter sur WhatsApp →
          </button>
        </div>
      </div>
 
      {/* Sections */}
      <div style={styles.container}>
        {/* Services */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Nos services</h2>
          <div style={styles.grid3}>
            {[
              { title: "Mariage", desc: "Coiffure + maquillage + retouches." },
              { title: "Fêtes", desc: "Looks soirée, glam, classy." },
              { title: "Shooting", desc: "Mise en beauté photo/vidéo." },
            ].map((x) => (
              <div key={x.title} style={styles.card}>
                <div style={styles.cardTitle}>{x.title}</div>
                <div style={styles.cardText}>{x.desc}</div>
              </div>
            ))}
          </div>
        </section>
 
        {/* Galerie */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Galerie</h2>
          <p style={styles.p}>
            Ici tu mettras tes images Cloudinary plus tard (via dashboard admin).
          </p>
 
          <div style={styles.gallery}>
            {[
              "https://images.unsplash.com/photo-1529634897861-1f63f74aa44b?auto=format&fit=crop&w=1200&q=60",
              "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=60",
              "https://images.unsplash.com/photo-1520975958225-9e8a0b7b0b5c?auto=format&fit=crop&w=1200&q=60",
              "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=60",
            ].map((url, i) => (
              <div
                key={i}
                style={{
                  ...styles.galleryItem,
                  backgroundImage: `url(${url})`,
                }}
              />
            ))}
          </div>
        </section>
 
        {/* Packs */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Packs & tarifs</h2>
          <div style={styles.grid3}>
            <div style={styles.card}>
              <div style={styles.tag}>Standard</div>
              <div style={styles.price}>$ 30</div>
              <div style={styles.cardText}>Coiffure + finition</div>
            </div>
 
            <div style={styles.card}>
              <div style={styles.tag}>Premium</div>
              <div style={styles.price}>$ 60</div>
              <div style={styles.cardText}>Coiffure + maquillage</div>
            </div>
 
            <div style={styles.card}>
              <div style={styles.tag}>VIP</div>
              <div style={styles.price}>$ 100</div>
              <div style={styles.cardText}>Pack complet + déplacement</div>
            </div>
          </div>
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
    padding: "42px 18px 28px",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1529634897861-1f63f74aa44b?auto=format&fit=crop&w=1600&q=60)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(11,11,15,0.93))",
  },
  heroContent: {
    position: "relative",
    maxWidth: 980,
    margin: "0 auto",
  },
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
  p: { margin: "0 0 14px", opacity: 0.85, lineHeight: 1.5 },
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
  tag: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${BORDER}`,
    color: GOLD,
    fontWeight: 900,
    marginBottom: 10,
  },
  price: { fontSize: 22, fontWeight: 900, marginBottom: 6 },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  galleryItem: {
    height: 170,
    borderRadius: 16,
    border: `1px solid ${BORDER}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};
 
export default Evenements;