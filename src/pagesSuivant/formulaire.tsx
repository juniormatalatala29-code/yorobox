import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // styles Flatpickr
import "../styles/ReservationForm.css";

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
      const serviceID = "serviceforme";
      const templateID = "template_lzq8cxr";
      const publicKey = "1bPAlD1HQQKCWO5uP";

      await emailjs.send(serviceID, templateID, { ...formData }, publicKey);

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
      console.error("Erreur :", error);
      alert("❌ Une erreur est survenue, réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-root">
      <h1 className="reservation-title">Réservez votre coiffure</h1>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <input
          type="text"
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
          ].map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="address-group">
          <input
            type="text"
            name="quartier"
            placeholder="Quartier"
            value={formData.quartier}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="avenue"
            placeholder="Avenue"
            value={formData.avenue}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="reference"
            placeholder="Référence (optionnel)"
            value={formData.reference}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Votre email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="whatsapp"
          placeholder="Numéro WhatsApp"
          value={formData.whatsapp}
          onChange={handleChange}
          pattern="\d{9,10}"
          required
        />
        <input
          type="number"
          name="nbPersonnes"
          placeholder="Nombre de personnes"
          value={formData.nbPersonnes}
          onChange={handleChange}
          min={1}
          required
        />

        {/* Flatpickr pour la Date */}
        <Flatpickr
          value={formData.date}
          options={{ dateFormat: "Y-m-d" }}
          onChange={(selectedDates) =>
            setFormData({ ...formData, date: selectedDates[0]?.toISOString().split("T")[0] || "" })
          }
          className="flatpickr-input"
          placeholder="Choisir la date"
        />

        {/* Flatpickr pour l’Heure */}
        <Flatpickr
          value={formData.heure}
          options={{
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
          }}
          onChange={(selectedDates) =>
            setFormData({ ...formData, heure: selectedDates[0]?.toTimeString().slice(0, 5) || "" })
          }
          className="flatpickr-input"
          placeholder="Choisir l’heure"
        />

        <button type="submit" className="reservation-button" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
