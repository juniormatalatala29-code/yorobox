import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "../styles/YakaReservationForm.css";

type LocationState = {
  salonName?: string;
  salonCity?: string;
};

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ReservationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LocationState | null) || null;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPhotoName, setSelectedPhotoName] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    salonName: locationState?.salonName || "",
    salonCity: locationState?.salonCity || "",
    nomComplet: "",
    commune: "",
    quartier: "",
    avenue: "",
    reference: "",
    email: "",
    whatsapp: "",
    nbPersonnes: 1,
    date: "",
    heure: "",
    photoModeleNom: "",
    photoModeleUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fileName = file ? file.name : "";
    setSelectedPhotoFile(file);
    setSelectedPhotoName(fileName);
    setFormData((prev) => ({
      ...prev,
      photoModeleNom: fileName,
      photoModeleUrl: "",
    }));
  };

  const uploadToCloudinary = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Configuration Cloudinary manquante : ajoute VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans ton fichier .env"
      );
    }

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    body.append("folder", "yaka/reservations-modeles");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body,
      }
    );

    if (!response.ok) {
      throw new Error("Échec de l'upload Cloudinary");
    }

    const data = await response.json();
    return data.secure_url as string;
  };

  const canGoNextStep = () => {
    const { nomComplet, commune, quartier, avenue, email, whatsapp } = formData;
    return (
      nomComplet.trim() !== "" &&
      commune.trim() !== "" &&
      quartier.trim() !== "" &&
      avenue.trim() !== "" &&
      email.trim() !== "" &&
      whatsapp.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoModeleUrl = formData.photoModeleUrl;

      if (selectedPhotoFile) {
        photoModeleUrl = await uploadToCloudinary(selectedPhotoFile);
      }

      const payload = {
        ...formData,
        photoModeleNom: selectedPhotoName || formData.photoModeleNom,
        photoModeleUrl,
      };

      await emailjs.send(
        "serviceforme",
        "template_lzq8cxr",
        payload,
        "1bPAlD1HQQKCWO5uP"
      );

      navigate("/finmessage", { state: payload });
    } catch {
      alert("❌ Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yakaForm-root">
      <div className="yakaForm-shell">
        <div className="yakaForm-glow" />
        <div className="yakaForm-reflection" />

        <h1 className="yakaForm-title">
          {step === 1
            ? "Informations personnelles"
            : "Détails de la réservation"}
        </h1>

        {(formData.salonName || formData.salonCity) && (
          <div className="yakaForm-salonBox">
            {formData.salonName && (
              <div className="yakaForm-salonItem">
                <span className="yakaForm-salonLabel">Salon</span>
                <strong>{formData.salonName}</strong>
              </div>
            )}

            {formData.salonCity && (
              <div className="yakaForm-salonItem">
                <span className="yakaForm-salonLabel">Ville</span>
                <strong>{formData.salonCity}</strong>
              </div>
            )}
          </div>
        )}

        <form className="yakaForm-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <input
                className="yakaForm-input"
                name="nomComplet"
                placeholder="Nom complet *"
                value={formData.nomComplet}
                onChange={handleChange}
                required
              />

              <select
                className="yakaForm-input"
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                required
              >
                <option value="">Choisir la commune *</option>
                {["Limete","Masina","Ndjili","Lemba","Gombe","Ngaliema"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                className="yakaForm-input"
                name="quartier"
                placeholder="Quartier *"
                value={formData.quartier}
                onChange={handleChange}
                required
              />

              <input
                className="yakaForm-input"
                name="avenue"
                placeholder="Avenue *"
                value={formData.avenue}
                onChange={handleChange}
                required
              />

              <input
                className="yakaForm-input"
                name="reference"
                placeholder="Référence (optionnel)"
                value={formData.reference}
                onChange={handleChange}
              />

              <input
                className="yakaForm-input"
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                className="yakaForm-input"
                name="whatsapp"
                placeholder="Numéro WhatsApp *"
                value={formData.whatsapp}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="yakaForm-button"
                onClick={() => {
                  if (!canGoNextStep()) {
                    alert("⚠️ Veuillez remplir tous les champs obligatoires.");
                    return;
                  }
                  setStep(2);
                }}
              >
                Suivant →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="yakaForm-subtitle">Veuillez indiquer le nombre de personnes</p>
              <input
                className="yakaForm-input"
                type="number"
                name="nbPersonnes"
                min={1}
                value={formData.nbPersonnes}
                onChange={handleChange}
                required
              />

              <p className="yakaForm-subtitle">Veuillez indiquer la date</p>
              <Flatpickr
                options={{ dateFormat: "Y-m-d" }}
                placeholder="Date *"
                onChange={(_, dateStr) =>
                  setFormData({ ...formData, date: dateStr })
                }
                className="yakaForm-input"
              />

              <p className="yakaForm-subtitle">Veuillez indiquer l'heure</p>
              <Flatpickr
                options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
                placeholder="Heure *"
                onChange={(_, timeStr) =>
                  setFormData({ ...formData, heure: timeStr })
                }
                className="yakaForm-input"
              />

              <p className="yakaForm-subtitle">Photo du modèle (optionnel)</p>
              <label className="yakaForm-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <span className="yakaForm-uploadTitle">Ajouter une photo</span>
                <span className="yakaForm-uploadText">
                  Le client peut joindre un modèle. L'image sera envoyée vers Cloudinary.
                </span>
                {selectedPhotoName && (
                  <span className="yakaForm-uploadFile">{selectedPhotoName}</span>
                )}
              </label>

              <div className="yakaForm-stepButtons">
                <button
                  type="button"
                  className="yakaForm-secondaryButton"
                  onClick={() => setStep(1)}
                >
                  ← Retour
                </button>

                <button
                  type="submit"
                  className="yakaForm-button"
                  disabled={loading}
                >
                  {loading ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
