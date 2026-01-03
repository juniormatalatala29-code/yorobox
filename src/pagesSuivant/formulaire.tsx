import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "../styles/ReservationForm.css";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const ReservationForm: React.FC = () => {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        "serviceforme",
        "template_lzq8cxr",
        { ...formData },
        "1bPAlD1HQQKCWO5uP"
      );

      alert("✅ Votre réservation a été envoyée !");
      navigate("/finmessage", { state: { ...formData } });

      setFormData({
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
    } catch (error) {
      alert("❌ Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-root">
      <h1 className="reservation-title">Réservez votre coiffure</h1>

      <form className="reservation-form" onSubmit={handleSubmit}>
        <input
          name="nomComplet"
          placeholder="Nom complet"
          value={formData.nomComplet}
          onChange={handleChange}
          required
        />

        <select name="commune" value={formData.commune} onChange={handleChange} required>
          <option value="">Choisir la commune</option>
          {[
            "Limete","Masina","Ndjili","Lemba","Kisenso","Kimbanseke",
            "Kasa-Vubu","Kalamu","Lingwala","Kintambo","Kinshasa (centre-ville)",
            "Gombe","Bandalungwa","Barumbu","Bumbu","Nsele","Mont Ngafula",
            "Ngaliema","Selembao","Ngiri-Ngiri","Makala"
          ].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="address-group">
          <input name="quartier" placeholder="Quartier" value={formData.quartier} onChange={handleChange} required />
          <input name="avenue" placeholder="Avenue" value={formData.avenue} onChange={handleChange} required />
          <input name="reference" placeholder="Référence (optionnel)" value={formData.reference} onChange={handleChange} />
        </div>

        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="whatsapp" placeholder="Numéro WhatsApp" value={formData.whatsapp} onChange={handleChange} required />

        <input
          type="number"
          name="nbPersonnes"
          min={1}
          placeholder="Nombre de personnes"
          value={formData.nbPersonnes}
          onChange={handleChange}
          required
        />

        {/* DATE – CORRIGÉ */}
        <Flatpickr
          value={formData.date}
          onChange={([date]) =>
            setFormData({ ...formData, date: date.toLocaleDateString("fr-CA") })
          }
          options={{ dateFormat: "Y-m-d", locale: "fr" }}
          placeholder="Date de réservation"
          className="reservation-input"
        />

        {/* HEURE */}
        <Flatpickr
          value={formData.heure}
          onChange={([time]) =>
            setFormData({
              ...formData,
              heure: time.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })
          }
          options={{ enableTime: true, noCalendar: true, time_24hr: true }}
          placeholder="Heure de réservation"
          className="reservation-input"
        />

        <button className="reservation-button" type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
