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
    nbPersonnes: "",
    date: "",
    heure: "",
  });

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await emailjs.send(
      "serviceforme",
      "template_lzq8cxr",
      formData,
      "1bPAlD1HQQKCWO5uP"
    );

    navigate("/finmessage", { state: formData });
  };

  return (
    <div className="reservation-page">
      <div className="reservation-root">
        <h1 className="reservation-title">Réservez votre coiffure</h1>

        <form className="reservation-form" onSubmit={handleSubmit}>
          <input name="nomComplet" placeholder="Nom complet" onChange={handleChange} required />

          <select name="commune" onChange={handleChange} required>
            <option value="">Choisir la commune</option>
            {["Gombe","Limete","Masina","Ndjili","Lemba","Ngaliema"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="address-group">
            <input name="quartier" placeholder="Quartier" onChange={handleChange} required />
            <input name="avenue" placeholder="Avenue" onChange={handleChange} required />
            <input name="reference" placeholder="Référence (optionnel)" onChange={handleChange} />
          </div>

          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input name="whatsapp" placeholder="WhatsApp" onChange={handleChange} required />
          <p><span class="t1">Nombre de personnes</span><span>la date de reservation</span></p>
          {/* GROUPE PREMIUM */}
          <div className="triple-group">
            <input
              type="number"
              name="nbPersonnes"
              placeholder="Nombre de personnes"
              min={1}
              onChange={handleChange}
              required
            />
            <Flatpickr
              className="flat-input"
              placeholder="Date"
              options={{ dateFormat: "Y-m-d" }}
              onChange={([d]) =>
                setFormData({ ...formData, date: d.toLocaleDateString("fr-CA") })
              }
            />
            <Flatpickr
              className="flat-input"
              placeholder="Heure"
              options={{ enableTime: true, noCalendar: true, time_24hr: true }}
              onChange={([t]) =>
                setFormData({
                  ...formData,
                  heure: t.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                })
              }
            />
          </div>

          <button className="reservation-button">Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
