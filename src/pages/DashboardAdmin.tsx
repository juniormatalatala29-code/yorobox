import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
 
type Tab = "salons" | "ads" | "events" | "home" | "admins";
 
type Salon = {
  id: string;
  salonName?: string;
  city?: string;
  email?: string;
  status?: "active" | "inactive";
  subscriptionType?: "free" | "vip" | "premium";
};
 
type Ad = {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  active: boolean;
};
 
type EventItem = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  whatsapp: string;
  active: boolean;
};
 
type Admin = {
  id: string;
  role: "admin";
};
 
type HomeSettings = {
  offersTitle: string;
  offersSubtitle: string;
  offersCoverUrl: string;
  eventsTitle: string;
  eventsSubtitle: string;
  eventsCoverUrl: string;
};
 
const GOLD = "#D4AF37";
const BG = "#0B0B0F";
const CARD = "rgba(255,255,255,0.06)";
const BORDER = "rgba(212,175,55,0.25)";
const MUTED = "rgba(255,255,255,0.72)";
 
const DEFAULT_HOME: HomeSettings = {
  offersTitle: "Offres du Moment",
  offersSubtitle: "Promotions et publicités (gérées par le dashboard admin).",
  offersCoverUrl: "",
  eventsTitle: "Espace événementielle",
  eventsSubtitle: "Mariage, fêtes, shooting… Packs beauté & coiffure.",
  eventsCoverUrl: "",
};
 
const uploadToCloudinary = async (file: File) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
 
  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary env manquants: VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET"
    );
  }
 
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
 
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
 
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Upload échoué");
 
  return data.secure_url as string;
};
 
const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
 
  const [tab, setTab] = useState<Tab>("salons");
 
  const [salons, setSalons] = useState<Salon[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
 
  const [home, setHome] = useState<HomeSettings>(DEFAULT_HOME);
 
  const [adForm, setAdForm] = useState({
    title: "",
    imageUrl: "",
    targetUrl: "",
    active: true,
  });
 
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    coverUrl: "",
    whatsapp: "",
    active: true,
  });
 
  const [adminUid, setAdminUid] = useState("");
 
  const [uploading, setUploading] = useState(false);
  const [savingHome, setSavingHome] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
 
  const loadAll = async () => {
    setLoadingPage(true);
 
    try {
      const salonsSnap = await getDocs(collection(db, "salons"));
      setSalons(salonsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } catch (e) {
      console.error("❌ salons load error:", e);
      setSalons([]);
    }
 
    try {
      const adsSnap = await getDocs(
        query(collection(db, "ads"), orderBy("createdAt", "desc"))
      );
      setAds(adsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } catch (e) {
      console.error("❌ ads load error:", e);
      setAds([]);
    }
 
    try {
      const eventsSnap = await getDocs(
        query(collection(db, "events"), orderBy("createdAt", "desc"))
      );
      setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } catch (e) {
      console.error("❌ events load error:", e);
      setEvents([]);
    }
 
    try {
      const homeSnap = await getDoc(doc(db, "app_home", "nos_services"));
      if (homeSnap.exists()) {
        setHome({ ...DEFAULT_HOME, ...(homeSnap.data() as any) });
      } else {
        setHome(DEFAULT_HOME);
      }
    } catch (e) {
      console.error("❌ home settings load error:", e);
      setHome(DEFAULT_HOME);
    }
 
    // ⚠️ admins list peut être bloquée par les règles
    try {
      const adminsSnap = await getDocs(collection(db, "admins"));
      setAdmins(adminsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } catch (e) {
      console.warn("⚠️ admins list bloquée par les rules:", e);
      setAdmins([]);
    }
 
    setLoadingPage(false);
  };
 
  useEffect(() => {
    loadAll();
  }, []);
 
  const headerTitle = useMemo(() => {
    if (tab === "salons") return "Gestion des salons";
    if (tab === "ads") return "Offres / Publicités";
    if (tab === "events") return "Espace événementiel";
    if (tab === "home") return "Page Nos services (couvertures)";
    return "Admins";
  }, [tab]);
 
  const setSalonStatus = async (id: string, status: "active" | "inactive") => {
    await updateDoc(doc(db, "salons", id), { status });
    setSalons((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };
 
  const setSalonSub = async (
    id: string,
    subscriptionType: "free" | "vip" | "premium"
  ) => {
    await updateDoc(doc(db, "salons", id), { subscriptionType });
    setSalons((prev) =>
      prev.map((s) => (s.id === id ? { ...s, subscriptionType } : s))
    );
  };
 
  const addAd = async () => {
    if (!adForm.title || !adForm.imageUrl || !adForm.targetUrl) {
      alert("Remplis tous les champs");
      return;
    }
 
    const ref = await addDoc(collection(db, "ads"), {
      ...adForm,
      createdAt: serverTimestamp(),
    });
 
    setAds((prev) => [{ id: ref.id, ...(adForm as any) }, ...prev]);
    setAdForm({ title: "", imageUrl: "", targetUrl: "", active: true });
  };
 
  const toggleAd = async (id: string, active: boolean) => {
    await updateDoc(doc(db, "ads", id), { active });
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, active } : a)));
  };
 
  const removeAd = async (id: string) => {
    await deleteDoc(doc(db, "ads", id));
    setAds((prev) => prev.filter((a) => a.id !== id));
  };
 
  const addEvent = async () => {
    if (!eventForm.title || !eventForm.coverUrl || !eventForm.whatsapp) {
      alert("Remplis titre, image, whatsapp");
      return;
    }
 
    const ref = await addDoc(collection(db, "events"), {
      ...eventForm,
      createdAt: serverTimestamp(),
    });
 
    setEvents((prev) => [{ id: ref.id, ...(eventForm as any) }, ...prev]);
 
    setEventForm({
      title: "",
      description: "",
      coverUrl: "",
      whatsapp: "",
      active: true,
    });
  };
 
  const toggleEvent = async (id: string, active: boolean) => {
    await updateDoc(doc(db, "events", id), { active });
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, active } : e)));
  };
 
  const removeEvent = async (id: string) => {
    await deleteDoc(doc(db, "events", id));
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };
 
  const addAdmin = async () => {
    const uid = adminUid.trim();
    if (!uid) {
      alert("Mets un UID");
      return;
    }
 
    await setDoc(
      doc(db, "admins", uid),
      { role: "admin", createdAt: serverTimestamp() },
      { merge: true }
    );
 
    setAdmins((prev) => [{ id: uid, role: "admin" }, ...prev]);
    setAdminUid("");
  };
 
  const removeAdmin = async (uid: string) => {
    await deleteDoc(doc(db, "admins", uid));
    setAdmins((prev) => prev.filter((a) => a.id !== uid));
  };
 
  const saveHome = async () => {
    setSavingHome(true);
    try {
      await setDoc(
        doc(db, "app_home", "nos_services"),
        { ...home, updatedAt: serverTimestamp() },
        { merge: true }
      );
      alert("✅ Couvertures enregistrées");
    } catch (e: any) {
      alert(e?.message || "Erreur sauvegarde");
    } finally {
      setSavingHome(false);
    }
  };
 
  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <div style={styles.brand}>Yaka Admin</div>
          <div style={styles.subtitle}>{headerTitle}</div>
        </div>
 
        <div style={styles.topActions}>
          <button style={styles.btnOutline} onClick={loadAll}>
            Rafraîchir
          </button>
          <button style={styles.btnGold} onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>
 
      <div style={styles.tabs}>
        <button style={tabBtn(tab === "salons")} onClick={() => setTab("salons")}>
          Salons
        </button>
        <button style={tabBtn(tab === "ads")} onClick={() => setTab("ads")}>
          Offres
        </button>
        <button style={tabBtn(tab === "events")} onClick={() => setTab("events")}>
          Événements
        </button>
        <button style={tabBtn(tab === "home")} onClick={() => setTab("home")}>
          Couvertures
        </button>
        <button style={tabBtn(tab === "admins")} onClick={() => setTab("admins")}>
          Admins
        </button>
      </div>
 
      {loadingPage && <div style={styles.loadingBox}>Chargement du dashboard…</div>}
 
      {!loadingPage && tab === "salons" && (
        <div style={styles.card}>
          <div style={styles.grid}>
            {salons.map((s) => (
              <div key={s.id} style={styles.item}>
                <div style={styles.itemTitle}>{s.salonName || "Salon"}</div>
                <div style={styles.itemMeta}>
                  {s.city || ""} {s.email ? `• ${s.email}` : ""}
                </div>
 
                <div style={styles.row}>
                  <label style={styles.label}>Status</label>
                  <select
                    style={styles.select}
                    value={s.status || "inactive"}
                    onChange={(e) => setSalonStatus(s.id, e.target.value as any)}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>
 
                <div style={styles.row}>
                  <label style={styles.label}>Abonnement</label>
                  <select
                    style={styles.select}
                    value={s.subscriptionType || "free"}
                    onChange={(e) => setSalonSub(s.id, e.target.value as any)}
                  >
                    <option value="free">free</option>
                    <option value="vip">vip</option>
                    <option value="premium">premium</option>
                  </select>
                </div>
 
                <div style={styles.smallId}>uid: {s.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}       
               {!loadingPage && tab === "ads" && (
        <div style={styles.card}>
          <div style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Titre"
              value={adForm.title}
              onChange={(e) => setAdForm((p) => ({ ...p, title: e.target.value }))}
            />
 
            <div style={styles.stacked}>
              <button
                style={styles.btnOutline}
                disabled={uploading}
                onClick={() => {
                  const el = document.getElementById("adUpload") as HTMLInputElement;
                  el?.click();
                }}
              >
                {uploading ? "Upload..." : "Importer image"}
              </button>
 
              <input
                id="adUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
 
                  setUploading(true);
                  try {
                    const url = await uploadToCloudinary(file);
                    setAdForm((p) => ({ ...p, imageUrl: url }));
                  } catch (err: any) {
                    alert(err?.message || "Upload échoué");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
 
              <input
                style={styles.input}
                placeholder="Image URL (auto après upload)"
                value={adForm.imageUrl}
                onChange={(e) => setAdForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            </div>
 
            <input
              style={styles.input}
              placeholder="Lien (targetUrl)"
              value={adForm.targetUrl}
              onChange={(e) =>
                setAdForm((p) => ({ ...p, targetUrl: e.target.value }))
              }
            />
 
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={adForm.active}
                onChange={(e) => setAdForm((p) => ({ ...p, active: e.target.checked }))}
              />
              Actif
            </label>
 
            <button style={styles.btnGold} onClick={addAd}>
              Ajouter
            </button>
          </div>
 
          <div style={styles.grid}>
            {ads.map((a) => (
              <div key={a.id} style={styles.item}>
                <div style={styles.itemTitle}>{a.title}</div>
 
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt="ad" style={styles.previewImage} />
                ) : null}
 
                <div style={styles.itemMeta} title={a.targetUrl}>
                  {a.targetUrl}
                </div>
 
                <div style={styles.rowWrap}>
                  <button
                    style={styles.btnOutline}
                    onClick={() => toggleAd(a.id, !a.active)}
                  >
                    {a.active ? "Désactiver" : "Activer"}
                  </button>
                  <button style={styles.btnDanger} onClick={() => removeAd(a.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {!loadingPage && tab === "events" && (
        <div style={styles.card}>
          <div style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Titre"
              value={eventForm.title}
              onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
            />
 
            <div style={styles.stacked}>
              <button
                style={styles.btnOutline}
                disabled={uploading}
                onClick={() => {
                  const el = document.getElementById("eventUpload") as HTMLInputElement;
                  el?.click();
                }}
              >
                {uploading ? "Upload..." : "Importer cover"}
              </button>
 
              <input
                id="eventUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
 
                  setUploading(true);
                  try {
                    const url = await uploadToCloudinary(file);
                    setEventForm((p) => ({ ...p, coverUrl: url }));
                  } catch (err: any) {
                    alert(err?.message || "Upload échoué");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
 
              <input
                style={styles.input}
                placeholder="Cover URL (auto après upload)"
                value={eventForm.coverUrl}
                onChange={(e) =>
                  setEventForm((p) => ({ ...p, coverUrl: e.target.value }))
                }
              />
            </div>
 
            <input
              style={styles.input}
              placeholder="WhatsApp (+243...)"
              value={eventForm.whatsapp}
              onChange={(e) =>
                setEventForm((p) => ({ ...p, whatsapp: e.target.value }))
              }
            />
 
            <textarea
              style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm((p) => ({ ...p, description: e.target.value }))
              }
            />
 
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={eventForm.active}
                onChange={(e) =>
                  setEventForm((p) => ({ ...p, active: e.target.checked }))
                }
              />
              Actif
            </label>
 
            <button style={styles.btnGold} onClick={addEvent}>
              Ajouter
            </button>
          </div>
 
          <div style={styles.grid}>
            {events.map((ev) => (
              <div key={ev.id} style={styles.item}>
                <div style={styles.itemTitle}>{ev.title}</div>
 
                {ev.coverUrl ? (
                  <img src={ev.coverUrl} alt="event" style={styles.previewImage} />
                ) : null}
 
                <div style={styles.itemMeta}>{ev.whatsapp}</div>
 
                <div style={styles.rowWrap}>
                  <button
                    style={styles.btnOutline}
                    onClick={() => toggleEvent(ev.id, !ev.active)}
                  >
                    {ev.active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    style={styles.btnDanger}
                    onClick={() => removeEvent(ev.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loadingPage && tab === "home" && (
        <div style={styles.card}>
          <div style={styles.doubleColumn}>
            <div style={styles.item}>
              <div style={styles.itemTitle}>Couverture Offres</div>
 
              <input
                style={styles.input}
                placeholder="Titre"
                value={home.offersTitle}
                onChange={(e) => setHome((p) => ({ ...p, offersTitle: e.target.value }))}
              />
              <input
                style={styles.input}
                placeholder="Sous-titre"
                value={home.offersSubtitle}
                onChange={(e) =>
                  setHome((p) => ({ ...p, offersSubtitle: e.target.value }))
                }
              />
 
              <div style={styles.rowWrap}>
                <button
                  style={styles.btnOutline}
                  disabled={uploading}
                  onClick={() => {
                    const el = document.getElementById("homeOfferUpload") as HTMLInputElement;
                    el?.click();
                  }}
                >
                  {uploading ? "Upload..." : "Importer image"}
                </button>
 
                <input
                  id="homeOfferUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const url = await uploadToCloudinary(file);
                      setHome((p) => ({ ...p, offersCoverUrl: url }));
                    } catch (err: any) {
                      alert(err?.message || "Upload échoué");
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
              </div>
 
              <input
                style={styles.input}
                placeholder="Image URL"
                value={home.offersCoverUrl}
                onChange={(e) =>
                  setHome((p) => ({ ...p, offersCoverUrl: e.target.value }))
                }
              />
 
              {home.offersCoverUrl ? (
                <img src={home.offersCoverUrl} alt="cover offres" style={styles.homePreview} />
              ) : null}
            </div>
 
            <div style={styles.item}>
              <div style={styles.itemTitle}>Couverture Événements</div>
 
              <input
                style={styles.input}
                placeholder="Titre"
                value={home.eventsTitle}
                onChange={(e) => setHome((p) => ({ ...p, eventsTitle: e.target.value }))}
              />
              <input
                style={styles.input}
                placeholder="Sous-titre"
                value={home.eventsSubtitle}
                onChange={(e) =>
                  setHome((p) => ({ ...p, eventsSubtitle: e.target.value }))
                }
              />
 
              <div style={styles.rowWrap}>
                <button
                  style={styles.btnOutline}
                  disabled={uploading}
                  onClick={() => {
                    const el = document.getElementById("homeEventUpload") as HTMLInputElement;
                    el?.click();
                  }}
                >
                  {uploading ? "Upload..." : "Importer image"}
                </button>
 
                <input
                  id="homeEventUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const url = await uploadToCloudinary(file);
                      setHome((p) => ({ ...p, eventsCoverUrl: url }));
                    } catch (err: any) {
                      alert(err?.message || "Upload échoué");
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
              </div>
 
              <input
                style={styles.input}
                placeholder="Image URL"
                value={home.eventsCoverUrl}
                onChange={(e) =>
                  setHome((p) => ({ ...p, eventsCoverUrl: e.target.value }))
                }
              />
 
              {home.eventsCoverUrl ? (
                <img src={home.eventsCoverUrl} alt="cover events" style={styles.homePreview} />
              ) : null}
            </div>
          </div>
 
          <div style={{ marginTop: 16 }}>
            <button
              style={styles.btnGold}
              onClick={saveHome}
              disabled={savingHome || uploading}
            >
              {savingHome ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}
 
      {!loadingPage && tab === "admins" && (
        <div style={styles.card}>
          <div style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="UID à rendre admin"
              value={adminUid}
              onChange={(e) => setAdminUid(e.target.value)}
            />
            <button style={styles.btnGold} onClick={addAdmin}>
              Ajouter admin
            </button>
          </div>
 
          <div style={styles.grid}>
            {admins.map((a) => (
              <div key={a.id} style={styles.item}>
                <div style={styles.itemTitle}>Admin</div>
                <div style={styles.itemMeta}>uid: {a.id}</div>
                <button style={styles.btnDanger} onClick={() => removeAdmin(a.id)}>
                  Retirer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
 
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: BG,
    color: "white",
    padding: 16,
  },
 
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
 
  topActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
 
  brand: {
    fontWeight: 900,
    fontSize: 22,
  },
 
  subtitle: {
    opacity: 0.8,
    marginTop: 4,
    color: MUTED,
  },
 
  tabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 14,
  },
 
  loadingBox: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
 
  card: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    padding: 14,
  },
 
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
 
  doubleColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 14,
  },
 
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
  },
 
  stacked: {
    display: "grid",
    gap: 8,
  },
 
  item: {
    background: "rgba(0,0,0,0.35)",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 12,
  },
 
  itemTitle: {
    fontWeight: 900,
  },
 
  itemMeta: {
    opacity: 0.8,
    fontSize: 13,
    marginTop: 6,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
 
  row: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
 
  rowWrap: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
 
  checkboxRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    opacity: 0.92,
    minHeight: 44,
  },
 
  smallId: {
    marginTop: 10,
    opacity: 0.6,
    fontSize: 12,
  },
 
  label: {
    width: 90,
    opacity: 0.85,
    fontSize: 13,
  },
 
  select: {
    flex: 1,
    padding: "10px 10px",
    borderRadius: 12,
    border: `1px solid ${BORDER}`,
    background: "rgba(0,0,0,0.35)",
    color: "white",
  },
 
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${BORDER}`,
    background: "rgba(0,0,0,0.35)",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },
 
  btnGold: {
    background: GOLD,
    border: "none",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
    color: "black",
  },
 
  btnOutline: {
    background: "transparent",
    border: `1px solid ${BORDER}`,
    color: "white",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
 
  btnDanger: {
    background: "#B42318",
    border: "none",
    color: "white",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
 
  previewImage: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 12,
    marginTop: 10,
    border: `1px solid ${BORDER}`,
  },
 
  homePreview: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
    marginTop: 10,
    border: `1px solid ${BORDER}`,
  },
};
 
const tabBtn = (active: boolean): React.CSSProperties => ({
  background: active ? GOLD : "rgba(255,255,255,0.06)",
  color: active ? "black" : "white",
  border: `1px solid ${BORDER}`,
  padding: "10px 14px",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
});
 
export default AdminDashboard;