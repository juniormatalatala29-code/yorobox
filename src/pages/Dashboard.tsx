// src/pagess/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// ✅ IMPORTANT : adapte ce chemin à TON projet si besoin
// Tu m'as montré un fichier utils/uploadToCloudinary.ts
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

type TarifItem = { service: string; price: string };
type CatalogueItem = { produit: string; price: string };

type SalonDoc = {
  uid: string;
  email: string;

  salonName: string;
  city: string;
  bio: string;
  horaires: string;
  whatsapp: string; // ex: 243811298054

  subscriptionType: "standard" | "vip" | "premium";
  status: "active" | "pending" | "disabled";

  profileImage?: string;
  bannerImage?: string;
  gallery?: string[];

  tarifs?: TarifItem[];
  catalogue?: CatalogueItem[];

  createdAt?: any;
  updatedAt?: any;
  subscriptionEndDate?: any | null;
};

const gold = "#d4af37";
const bg = "#000";
const panel = "rgba(255,255,255,0.06)";
const border = "rgba(212,175,55,0.35)";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const uid = user?.uid || "";
  const email = user?.email || "";

  const [tab, setTab] = useState<
    "profil" | "images" | "tarifs" | "catalogue" | "preview"
  >("profil");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{
    profile?: boolean;
    banner?: boolean;
    gallery?: boolean;
  }>({});

  const [form, setForm] = useState<SalonDoc>({
    uid,
    email,
    salonName: "",
    city: "",
    bio: "",
    horaires: "",
    whatsapp: "",
    subscriptionType: "standard",
    status: "active",
    profileImage: "",
    bannerImage: "",
    gallery: [],
    tarifs: [],
    catalogue: [],
    subscriptionEndDate: null,
  });

  const salonRef = useMemo(() => (uid ? doc(db, "salons", uid) : null), [uid]);

  // ✅ Charger le doc salon existant
  useEffect(() => {
    const run = async () => {
      if (!uid || !salonRef) return;

      try {
        setLoading(true);
        const snap = await getDoc(salonRef);

        if (snap.exists()) {
          const data = snap.data() as Partial<SalonDoc>;
          setForm((prev) => ({
            ...prev,
            ...data,
            uid,
            email,
            salonName: data.salonName || prev.salonName,
            city: data.city || prev.city,
            bio: data.bio || prev.bio,
            horaires: data.horaires || prev.horaires,
            whatsapp: data.whatsapp || prev.whatsapp,
            subscriptionType: (data.subscriptionType as any) || prev.subscriptionType,
            status: (data.status as any) || prev.status,
            profileImage: data.profileImage || prev.profileImage,
            bannerImage: data.bannerImage || prev.bannerImage,
            gallery: Array.isArray(data.gallery) ? data.gallery : prev.gallery,
            tarifs: Array.isArray(data.tarifs) ? data.tarifs : prev.tarifs,
            catalogue: Array.isArray(data.catalogue) ? data.catalogue : prev.catalogue,
          }));
        } else {
          // ✅ Créer le doc minimal dès la première connexion
          await setDoc(
            salonRef,
            {
              uid,
              email,
              status: "active",
              subscriptionType: "standard",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              subscriptionEndDate: null,
              salonName: "",
              city: "",
              bio: "",
              horaires: "",
              whatsapp: "",
              profileImage: "",
              bannerImage: "",
              gallery: [],
              tarifs: [],
              catalogue: [],
            },
            { merge: true }
          );
        }
      } catch (e) {
        console.error("❌ load salon error", e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [uid, email, salonRef]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const setField = <K extends keyof SalonDoc>(key: K, value: SalonDoc[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const saveAll = async () => {
    if (!salonRef) return;

    // ✅ validations simples
    if (!form.salonName.trim()) return alert("Ajoute le nom du salon.");
    if (!form.city.trim()) return alert("Ajoute la ville.");
    if (form.whatsapp && !/^\d{8,15}$/.test(form.whatsapp.trim())) {
      return alert("WhatsApp doit être uniquement des chiffres (ex: 243811298054).");
    }

    try {
      setSaving(true);
      await setDoc(
        salonRef,
        {
          ...form,
          uid,
          email,
          updatedAt: serverTimestamp(),
          // createdAt ne doit pas être écrasé si déjà présent
          createdAt: form.createdAt || serverTimestamp(),
        },
        { merge: true }
      );

      alert("✅ Profil salon enregistré !");
    } catch (e) {
      console.error("❌ save error", e);
      alert("❌ Erreur lors de l’enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Upload (Cloudinary) helpers
  const uploadOne = async (file: File, folder: string) => {
    // uploadToCloudinary() -> { url, publicId }
    const res: any = await uploadToCloudinary(file);
    if (!res?.url) throw new Error("Upload Cloudinary échoué.");
    return res.url as string;
  };

  const onUploadProfile = async (file?: File | null) => {
    if (!file) return;
    try {
      setUploading((p) => ({ ...p, profile: true }));
      const url = await uploadOne(file, "salons/profile");
      setField("profileImage", url);
      if (salonRef) await updateDoc(salonRef, { profileImage: url, updatedAt: serverTimestamp() });
    } catch (e) {
      console.error(e);
      alert("❌ Upload photo profil échoué.");
    } finally {
      setUploading((p) => ({ ...p, profile: false }));
    }
  };

  const onUploadBanner = async (file?: File | null) => {
    if (!file) return;
    try {
      setUploading((p) => ({ ...p, banner: true }));
      const url = await uploadOne(file, "salons/banner");
      setField("bannerImage", url);
      if (salonRef) await updateDoc(salonRef, { bannerImage: url, updatedAt: serverTimestamp() });
    } catch (e) {
      console.error(e);
      alert("❌ Upload bannière échoué.");
    } finally {
      setUploading((p) => ({ ...p, banner: false }));
    }
  };

  const onUploadGallery = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setUploading((p) => ({ ...p, gallery: true }));

      const toUpload = Array.from(files).slice(0, 6); // ✅ max 6 par ajout (UX)
      const urls: string[] = [];

      for (const f of toUpload) {
        const url = await uploadOne(f, "salons/gallery");
        urls.push(url);
      }

      setForm((p) => {
        const next = [...(p.gallery || []), ...urls].slice(0, 12); // ✅ max 12 images au total
        return { ...p, gallery: next };
      });

      if (salonRef) {
        const current = form.gallery || [];
        const next = [...current, ...urls].slice(0, 12);
        await updateDoc(salonRef, { gallery: next, updatedAt: serverTimestamp() });
      }
    } catch (e) {
      console.error(e);
      alert("❌ Upload galerie échoué.");
    } finally {
      setUploading((p) => ({ ...p, gallery: false }));
    }
  };

  const removeGalleryItem = async (idx: number) => {
    const next = (form.gallery || []).filter((_, i) => i !== idx);
    setField("gallery", next);
    if (salonRef) await updateDoc(salonRef, { gallery: next, updatedAt: serverTimestamp() });
  };

  // ✅ Tarifs
  const addTarif = () => {
    setForm((p) => ({
      ...p,
      tarifs: [...(p.tarifs || []), { service: "", price: "" }],
    }));
  };
  const updateTarif = (i: number, key: keyof TarifItem, value: string) => {
    setForm((p) => {
      const list = [...(p.tarifs || [])];
      list[i] = { ...list[i], [key]: value };
      return { ...p, tarifs: list };
    });
  };
  const removeTarif = (i: number) => {
    setForm((p) => ({
      ...p,
      tarifs: (p.tarifs || []).filter((_, idx) => idx !== i),
    }));
  };

  // ✅ Catalogue
  const addCatalogue = () => {
    setForm((p) => ({
      ...p,
      catalogue: [...(p.catalogue || []), { produit: "", price: "" }],
    }));
  };
  const updateCatalogue = (i: number, key: keyof CatalogueItem, value: string) => {
    setForm((p) => {
      const list = [...(p.catalogue || [])];
      list[i] = { ...list[i], [key]: value };
      return { ...p, catalogue: list };
    });
  };
  const removeCatalogue = (i: number) => {
    setForm((p) => ({
      ...p,
      catalogue: (p.catalogue || []).filter((_, idx) => idx !== i),
    }));
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: bg, color: "#fff", padding: 24 }}>
        <h2 style={{ color: gold }}>Espace Salon</h2>
        <p>Tu dois te connecter.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: bg, color: "#fff", padding: 24 }}>
        <h2 style={{ color: gold }}>Espace Salon</h2>
        <p style={{ opacity: 0.85 }}>Chargement…</p>
      </div>
    );
  }

  const badgePlan =
    form.subscriptionType === "premium"
      ? "PREMIUM"
      : form.subscriptionType === "vip"
      ? "VIP"
      : "STANDARD";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: "#fff", padding: 18 }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: gold, margin: 0, fontSize: 26 }}>Espace Salon</h1>
          <div style={{ marginTop: 6, opacity: 0.9, fontSize: 13 }}>
            Connecté : <b>{user.email}</b> — Abonnement :{" "}
            <span style={{ color: gold, fontWeight: 800 }}>{badgePlan}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: `1px solid ${gold}`,
            background: "transparent",
            color: gold,
            fontWeight: 800,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Se déconnecter
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        {[
          { k: "profil", label: "Profil" },
          { k: "images", label: "Images" },
          { k: "tarifs", label: "Tarifs" },
          { k: "catalogue", label: "Catalogue" },
          { k: "preview", label: "Aperçu" },
        ].map((t: any) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: `1px solid ${tab === t.k ? gold : border}`,
              background: tab === t.k ? "rgba(212,175,55,0.15)" : panel,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          marginTop: 14,
          background: panel,
          border: `1px solid ${border}`,
          borderRadius: 18,
          padding: 16,
        }}
      >
        {/* PROFIL */}
        {tab === "profil" && (
          <div style={{ display: "grid", gap: 14 }}>
            <SectionTitle title="Informations du salon" subtitle="Ces infos seront visibles par les clients." />

            <Field label="Nom du salon">
              <input
                value={form.salonName}
                onChange={(e) => setField("salonName", e.target.value)}
                placeholder="Ex: Bella Beauty"
                style={inputStyle}
              />
            </Field>

            <Field label="Ville">
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="Ex: Kinshasa"
                style={inputStyle}
              />
            </Field>

            <Field label="Bio (courte description)">
              <textarea
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
                placeholder="Ex: Spécialiste locks & tresses haut de gamme…"
                style={{ ...inputStyle, minHeight: 90, resize: "vertical" as const }}
              />
            </Field>

            <Field label="Horaires">
              <input
                value={form.horaires}
                onChange={(e) => setField("horaires", e.target.value)}
                placeholder="Ex: Lundi - Samedi : 8h - 19h"
                style={inputStyle}
              />
            </Field>

            <Field label="WhatsApp (chiffres uniquement)">
              <input
                value={form.whatsapp}
                onChange={(e) => setField("whatsapp", e.target.value.replace(/\s/g, ""))}
                placeholder="Ex: 243811298054"
                style={inputStyle}
              />
              <SmallHint text="Astuce: mets l’indicatif pays (243…)." />
            </Field>

            <Field label="Statut du salon">
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value as any)}
                style={inputStyle}
              >
                <option value="active">active</option>
                <option value="pending">pending</option>
                <option value="disabled">disabled</option>
              </select>
            </Field>

            <Field label="Type d’abonnement (catégorie)">
              <select
                value={form.subscriptionType}
                onChange={(e) => setField("subscriptionType", e.target.value as any)}
                style={inputStyle}
              >
                <option value="standard">standard</option>
                <option value="vip">vip</option>
                <option value="premium">premium</option>
              </select>
              <SmallHint text="Tes salons seront classés par Premium / VIP / Standard côté client." />
            </Field>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <PrimaryButton onClick={saveAll} loading={saving} text="Enregistrer" />
              <SecondaryButton
                onClick={() => setTab("images")}
                text="Continuer → Images"
              />
            </div>
          </div>
        )}

        {/* IMAGES */}
        {tab === "images" && (
          <div style={{ display: "grid", gap: 16 }}>
            <SectionTitle title="Images" subtitle="Photo profil, bannière et galerie (Cloudinary)." />

            <div style={grid2}>
              <Card title="Photo Profil" desc="Affichée dans la carte du salon">
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 999,
                      border: `2px solid ${gold}`,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {form.profileImage ? (
                      <img
                        src={form.profileImage}
                        alt="profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : null}
                  </div>

                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onUploadProfile(e.target.files?.[0])}
                      style={{ display: "none" }}
                    />
                    <span style={fileBtnStyle}>
                      {uploading.profile ? "Upload…" : "Choisir un fichier"}
                    </span>
                  </label>
                </div>
              </Card>

              <Card title="Bannière" desc="En haut de la page détail salon">
                <div style={{ display: "grid", gap: 10 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 110,
                      borderRadius: 14,
                      border: `1px solid ${border}`,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    {form.bannerImage ? (
                      <img
                        src={form.bannerImage}
                        alt="banner"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : null}
                  </div>

                  <label style={{ cursor: "pointer", width: "fit-content" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onUploadBanner(e.target.files?.[0])}
                      style={{ display: "none" }}
                    />
                    <span style={fileBtnStyle}>
                      {uploading.banner ? "Upload…" : "Choisir un fichier"}
                    </span>
                  </label>
                </div>
              </Card>
            </div>

            <Card
              title="Galerie"
              desc="Tu peux ajouter jusqu’à 12 images (par lots de 6)."
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onUploadGallery(e.target.files)}
                    style={{ display: "none" }}
                  />
                  <span style={fileBtnStyle}>
                    {uploading.gallery ? "Upload…" : "Ajouter des images"}
                  </span>
                </label>

                <span style={{ opacity: 0.85, fontSize: 13 }}>
                  {form.gallery?.length || 0}/12
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
                {(form.gallery || []).map((url, i) => (
                  <div
                    key={url + i}
                    style={{
                      position: "relative",
                      borderRadius: 14,
                      overflow: "hidden",
                      border: `1px solid ${border}`,
                      background: "rgba(255,255,255,0.05)",
                      aspectRatio: "1 / 1",
                    }}
                  >
                    <img
                      src={url}
                      alt={`g${i}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      onClick={() => removeGalleryItem(i)}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        borderRadius: 10,
                        border: "none",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryButton onClick={saveAll} loading={saving} text="Enregistrer" />
              <SecondaryButton onClick={() => setTab("tarifs")} text="Continuer → Tarifs" />
            </div>
          </div>
        )}

        {/* TARIFS */}
        {tab === "tarifs" && (
          <div style={{ display: "grid", gap: 14 }}>
            <SectionTitle title="Tarifs" subtitle="Les clients verront la liste des prestations + prix." />

            <div style={{ display: "grid", gap: 10 }}>
              {(form.tarifs || []).length === 0 && (
                <div style={{ opacity: 0.85 }}>Aucun tarif. Ajoute-en un.</div>
              )}

              {(form.tarifs || []).map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 44px", gap: 10 }}>
                  <input
                    value={t.service}
                    onChange={(e) => updateTarif(i, "service", e.target.value)}
                    placeholder="Ex: Locks"
                    style={inputStyle}
                  />
                  <input
                    value={t.price}
                    onChange={(e) => updateTarif(i, "price", e.target.value)}
                    placeholder="Ex: 40$"
                    style={inputStyle}
                  />
                  <button
                    onClick={() => removeTarif(i)}
                    style={{
                      borderRadius: 12,
                      border: `1px solid ${border}`,
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 900,
                    }}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button onClick={addTarif} style={addBtnStyle}>
                + Ajouter un tarif
              </button>

              <SmallHint text="Astuce: Mets les services les plus demandés en haut." />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryButton onClick={saveAll} loading={saving} text="Enregistrer" />
              <SecondaryButton onClick={() => setTab("catalogue")} text="Continuer → Catalogue" />
            </div>
          </div>
        )}

        {/* CATALOGUE */}
        {tab === "catalogue" && (
          <div style={{ display: "grid", gap: 14 }}>
            <SectionTitle title="Catalogue" subtitle="Produits vendus par le salon (optionnel)." />

            <div style={{ display: "grid", gap: 10 }}>
              {(form.catalogue || []).length === 0 && (
                <div style={{ opacity: 0.85 }}>Aucun produit. Ajoute-en un si tu veux.</div>
              )}

              {(form.catalogue || []).map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 44px", gap: 10 }}>
                  <input
                    value={c.produit}
                    onChange={(e) => updateCatalogue(i, "produit", e.target.value)}
                    placeholder="Ex: Perruque brésilienne"
                    style={inputStyle}
                  />
                  <input
                    value={c.price}
                    onChange={(e) => updateCatalogue(i, "price", e.target.value)}
                    placeholder="Ex: 120$"
                    style={inputStyle}
                  />
                  <button
                    onClick={() => removeCatalogue(i)}
                    style={{
                      borderRadius: 12,
                      border: `1px solid ${border}`,
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 900,
                    }}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button onClick={addCatalogue} style={addBtnStyle}>
                + Ajouter un produit
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryButton onClick={saveAll} loading={saving} text="Enregistrer" />
              <SecondaryButton onClick={() => setTab("preview")} text="Voir l’aperçu →" />
            </div>
          </div>
        )}

        {/* PREVIEW */}
        {tab === "preview" && (
          <div style={{ display: "grid", gap: 14 }}>
            <SectionTitle
              title="Aperçu (client)"
              subtitle="Voici comment ton salon apparaîtra côté client (approximatif)."
            />

            <div
              style={{
                borderRadius: 18,
                border: `1px solid ${border}`,
                overflow: "hidden",
                background: "rgba(0,0,0,0.35)",
              }}
            >
              <div style={{ height: 170, background: "rgba(255,255,255,0.06)" }}>
                {form.bannerImage ? (
                  <img
                    src={form.bannerImage}
                    alt="banner"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ height: "100%", display: "grid", placeItems: "center", opacity: 0.75 }}>
                    Bannière (vide)
                  </div>
                )}
              </div>

              <div style={{ padding: 16, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 999,
                      border: `2px solid ${gold}`,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {form.profileImage ? (
                      <img
                        src={form.profileImage}
                        alt="profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : null}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: gold, lineHeight: 1.1 }}>
                      {form.salonName || "Nom du salon"}
                    </div>
                    <div style={{ opacity: 0.9 }}>{form.city || "Ville"}</div>
                    <div style={{ marginTop: 6 }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 999,
                          border: `1px solid ${gold}`,
                          color: gold,
                          fontWeight: 900,
                          fontSize: 12,
                        }}
                      >
                        {badgePlan}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ opacity: 0.92 }}>{form.bio || "Bio du salon…"}</div>

                {!!form.horaires && (
                  <div style={{ opacity: 0.92 }}>
                    <span style={{ color: gold, fontWeight: 900 }}>Horaires:</span> {form.horaires}
                  </div>
                )}

                <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                  <button style={primaryWideBtn}>Commander</button>

                  {form.whatsapp ? (
                    <a
                      href={`https://wa.me/${form.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      style={whatsBtn}
                    >
                      Écrire sur WhatsApp
                    </a>
                  ) : (
                    <div style={{ opacity: 0.7, fontSize: 13 }}>
                      Ajoute ton WhatsApp pour activer le bouton.
                    </div>
                  )}

                  {form.subscriptionType === "premium" && (
                    <button style={outlineWideBtn}>Nous laisser un avis</button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryButton onClick={saveAll} loading={saving} text="Enregistrer" />
              <SecondaryButton onClick={() => navigate("/salons")} text="Voir la liste des salons" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

/* ---------------- UI components ---------------- */

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 18, fontWeight: 950, color: gold }}>{title}</div>
      {subtitle ? <div style={{ opacity: 0.85, marginTop: 4, fontSize: 13 }}>{subtitle}</div> : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 900, color: gold }}>{label}</div>
      {children}
    </div>
  );
}

function SmallHint({ text }: { text: string }) {
  return <div style={{ opacity: 0.7, fontSize: 12 }}>{text}</div>;
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.30)",
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 950, color: gold }}>{title}</div>
        {desc ? <div style={{ opacity: 0.8, fontSize: 13 }}>{desc}</div> : null}
      </div>
      {children}
    </div>
  );
}

function PrimaryButton({ onClick, loading, text }: { onClick: () => void; loading?: boolean; text: string }) {
  return (
    <button
      onClick={onClick}
      disabled={!!loading}
      style={{
        padding: "12px 16px",
        borderRadius: 14,
        border: `1px solid ${gold}`,
        background: gold,
        color: "#000",
        fontWeight: 950,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.75 : 1,
      }}
    >
      {loading ? "Enregistrement…" : text}
    </button>
  );
}

function SecondaryButton({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: 14,
        border: `1px solid ${border}`,
        background: "transparent",
        color: "#fff",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
}

/* ---------------- styles ---------------- */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 14,
  border: `1px solid ${border}`,
  outline: "none",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: 14,
};

const fileBtnStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 14,
  border: `1px solid ${border}`,
  background: "transparent",
  color: "#fff",
  fontWeight: 900,
};

const addBtnStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "12px 14px",
  borderRadius: 14,
  border: `1px dashed ${border}`,
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 900,
  textAlign: "left" as const,
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const primaryWideBtn: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: `1px solid ${gold}`,
  background: gold,
  color: "#000",
  fontWeight: 950,
  cursor: "pointer",
  fontSize: 16,
};

const outlineWideBtn: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: `2px solid ${gold}`,
  background: "transparent",
  color: gold,
  fontWeight: 950,
  cursor: "pointer",
  fontSize: 16,
};

const whatsBtn: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,0.2)",
  background: "#22c55e",
  color: "#fff",
  fontWeight: 950,
  textAlign: "center",
  textDecoration: "none",
  fontSize: 16,
};