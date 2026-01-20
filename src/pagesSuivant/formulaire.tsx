import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "../styles/ReservationForm.css";

const ReservationForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        "serviceforme",
        "template_lzq8cxr",
        formData,
        "1bPAlD1HQQKCWO5uP"
      );

      navigate("/finmessage", { state: formData });
    } catch (error) {
      alert("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-root">
      <h1 className="reservation-title">
        {step === 1 ? "Informations personnelles" : "Détails de la réservation"}
      </h1>

      <form className="reservation-form" onSubmit={handleSubmit}>

        {step === 1 && (
          <>
            <input name="nomComplet" placeholder="Nom complet" value={formData.nomComplet} onChange={handleChange} required />

            <select name="commune" value={formData.commune} onChange={handleChange} required>
              <option value="">Choisir la commune</option>
              {["Limete","Masina","Ndjili","Lemba","Gombe","Ngaliema"].map(c =>
                <option key={c} value={c}>{c}</option>
              )}
            </select>

            <input name="quartier" placeholder="Quartier" value={formData.quartier} onChange={handleChange} required />
            <input name="avenue" placeholder="Avenue" value={formData.avenue} onChange={handleChange} required />
            <input name="reference" placeholder="Référence (optionnel)" value={formData.reference} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="whatsapp" placeholder="Numéro WhatsApp" value={formData.whatsapp} onChange={handleChange} required />

            <button type="button" className="reservation-button" onClick={() => setStep(2)}>
              Suivant →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="subtitles">Veuillez indiquer le nombre de personnes</p>
            <input type="number" name="nbPersonnes" min={1} value={formData.nbPersonnes} onChange={handleChange} required />
             <p className="subtitles">Veuillez indiquer la date</p>
            <Flatpickr
              value={formData.date}
              onChange={(_, dateStr) => setFormData({ ...formData, date: dateStr })}
              options={{ dateFormat: "Y-m-d" }}
              placeholder="Date"
              className="reservation-input"
            />
            <p className="subtitles">Veuillez indiquer l'heure</p>
            <Flatpickr
              value={formData.heure}
              onChange={(_, timeStr) => setFormData({ ...formData, heure: timeStr })}
              options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
              placeholder="Heure"
              className="reservation-input"
            />

            <div className="step-buttons">
              <button type="button" className="secondary-button" onClick={() => setStep(1)}>
                ← Retour
              </button>

              <button type="submit" className="reservation-button" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </>
        )}

      </form>
    </div>
  );
};

export default ReservationForm;
