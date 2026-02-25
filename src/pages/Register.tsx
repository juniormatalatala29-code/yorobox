import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [salonName, setSalonName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    console.log("▶️ Register start");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      console.log("✅ Auth created:", uid);

      await setDoc(doc(db, "salons", uid), {
        uid,
        salonName,
        email,
        bio: "Salon de coiffure & beauté.",
        subscriptionType: "standard",
        subscriptionEndDate: null,
        status: "active", // IMPORTANT pour que Salons.tsx l'affiche
        createdAt: serverTimestamp(),
      });

      console.log("✅ Firestore salon doc created");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Register error:", err);
      alert(err?.message || "Erreur d'inscription");
      // (option) si Auth a créé l'user mais Firestore a échoué, tu pourras corriger ensuite
    } finally {
      setLoading(false);
      console.log("⏹️ Register end");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">Créez votre salon en quelques secondes</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="text"
            placeholder="Nom du salon"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;