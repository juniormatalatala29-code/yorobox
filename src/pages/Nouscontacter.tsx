import React, { useState } from "react";
import "../styles/Nouscontacter.css";
import emailjs from "@emailjs/browser";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nember: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

      const payload = {
        salonName: "Demande de contact YAKA",
        salonCity: "",
        nomComplet: formData.name,
        commune: "",
        quartier: "",
        avenue: "",
        reference: formData.message,
        email: formData.email,
        whatsapp: formData.nember,
        nbPersonnes: "",
        date: "",
        heure: "",
        photoModeleNom: "",
        photoModeleUrl: "",
      };

      const result = await emailjs.send(
        serviceID,
        templateID,
        payload,
        publicKey
      );

      console.log("✅ Email envoyé :", result.text);
      alert("Merci ! Votre message a été envoyé.");

      setFormData({ name: "", email: "", nember: "", message: "" });
    } catch (error: any) {
      console.error("❌ Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue, réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yakaContact-root">
      <div className="yakaContact-shell">
        <div className="yakaContact-glow" />
        <div className="yakaContact-reflection" />

        <div className="yakaContact-head">
          <div className="yakaContact-badge">YAKA</div>
          <h1 className="yakaContact-title">Nous contacter</h1>
          <p className="yakaContact-subtitle">
            Envoyez-nous un message et nous vous répondrons dès que possible.
          </p>
        </div>

        <form className="yakaContact-form" onSubmit={handleSubmit}>
          <input
            className="yakaContact-input"
            type="text"
            name="name"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="yakaContact-input"
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="yakaContact-input"
            type="text"
            name="nember"
            placeholder="Votre numéro WhatsApp"
            value={formData.nember}
            onChange={handleChange}
            required
          />

          <textarea
            className="yakaContact-input yakaContact-textarea"
            name="message"
            placeholder="Votre message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
          />

          <button
            type="submit"
            className="yakaContact-button"
            disabled={loading}
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
