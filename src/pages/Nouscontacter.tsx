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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceID = "serviceforme";       // la partie id Service ID EmailJS
      const templateID = "template_lzq8cxr"; // la partie Template ID EmailJS
      const publicKey = "1bPAlD1HQQKCWO5uP"; // ma clé publique

      const result = await emailjs.send(serviceID, templateID, formData, publicKey);

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
    <div className="contact-root">
      <h1 className="contact-title">Nous Contacter</h1>
      <p className="contact-subtitle">Envoyez-nous un message !</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Votre nom"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
          name="nember"
          placeholder="Votre numéro WhatsApp"
          value={formData.nember}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Votre message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
        />
        <button type="submit" className="contact-button" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
