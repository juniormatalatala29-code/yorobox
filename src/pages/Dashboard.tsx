import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [salonData, setSalonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 🔹 Charger les données salon
  useEffect(() => {
    const fetchSalon = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "salons", user.uid));
      if (snap.exists()) {
        setSalonData(snap.data());
      }
      setLoading(false);
    };

    fetchSalon();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // 🔹 Upload image (profil ou couverture)
  const handleSingleUpload = async (
    file: File,
    field: "profileImage" | "bannerImage"
  ) => {
    if (!user) return;
    setUploading(true);

    try {
      const { url } = await uploadToCloudinary(file);
      await updateDoc(doc(db, "salons", user.uid), {
        [field]: url,
      });

      setSalonData((prev: any) => ({ ...prev, [field]: url }));
    } catch (err) {
      alert("Erreur upload image");
    }

    setUploading(false);
  };

  // 🔹 Upload galerie
  const handleGalleryUpload = async (file: File) => {
    if (!user || !salonData) return;

    const limits = {
      standard: 5,
      vip: 10,
      premium: 15,
    };

    const max = limits[salonData.subscriptionType || "standard"];

    if ((salonData.gallery?.length || 0) >= max) {
      alert("Limite de photos atteinte pour votre abonnement");
      return;
    }

    setUploading(true);

    try {
      const { url } = await uploadToCloudinary(file);

      const updatedGallery = [...(salonData.gallery || []), url];

      await updateDoc(doc(db, "salons", user.uid), {
        gallery: updatedGallery,
      });

      setSalonData((prev: any) => ({
        ...prev,
        gallery: updatedGallery,
      }));
    } catch (err) {
      alert("Erreur upload galerie");
    }

    setUploading(false);
  };

  if (loading) return <div style={{ color: "white" }}>Chargement...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 24 }}>
      <h1 style={{ color: "#d4af37" }}>Espace Salon</h1>

      <p>
        Connecté : <b>{user?.email}</b>
      </p>

      <p>
        Abonnement :{" "}
        <b style={{ color: "#d4af37" }}>
          {salonData?.subscriptionType || "standard"}
        </b>
      </p>

      {/* IMAGE PROFIL */}
      <div style={{ marginTop: 30 }}>
        <h3>Photo Profil</h3>
        {salonData?.profileImage && (
          <img
            src={salonData.profileImage}
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files &&
            handleSingleUpload(e.target.files[0], "profileImage")
          }
        />
      </div>

      {/* IMAGE COUVERTURE */}
      <div style={{ marginTop: 30 }}>
        <h3>Bannière</h3>
        {salonData?.bannerImage && (
          <img
            src={salonData.bannerImage}
            style={{ width: "100%", maxWidth: 400, borderRadius: 12 }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files &&
            handleSingleUpload(e.target.files[0], "bannerImage")
          }
        />
      </div>

      {/* GALERIE */}
      <div style={{ marginTop: 30 }}>
        <h3>Galerie</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {salonData?.gallery?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10 }}
            />
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleGalleryUpload(e.target.files[0])
          }
        />
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 40,
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid #d4af37",
          background: "transparent",
          color: "#d4af37",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Se déconnecter
      </button>

      {uploading && <p>Upload en cours...</p>}
    </div>
  );
};

export default Dashboard;