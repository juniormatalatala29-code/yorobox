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
 
    const cleanSalonName = salonName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
 
    if (!cleanSalonName) {
      alert("Veuillez entrer le nom de votre salon.");
      return;
    }
 
    if (!cleanEmail) {
      alert("Veuillez entrer votre adresse e-mail.");
      return;
    }
 
    if (!cleanPassword) {
      alert("Veuillez entrer un mot de passe.");
      return;
    }
 
    if (cleanPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
 
    setLoading(true);
    console.log("▶️ Register start");
 
    try {
      // 1) Création du compte Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );
 
      const uid = cred.user.uid;
      const authEmail = cred.user.email || cleanEmail;
 
      console.log("✅ Auth created:", uid);
 
      // 2) Création du document salon lié au compte
      await setDoc(doc(db, "salons", uid), {
        uid,
        email: authEmail,
        salonName: cleanSalonName,
 
        subscriptionType: "standard",
        subscriptionEndDate: null,
        status: "active",
 
        bio: "Salon de coiffure & beauté.",
        city: "Kinshasa",
        horaires: "",
        whatsapp: "",
 
        profileImage: "",
        bannerImage: "",
        gallery: [],
        tarifs: [],
        catalogue: [],
 
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
 
      console.log("✅ Firestore salon doc created");
 
      alert("Compte créé avec succès. Bienvenue sur Yaka.");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Register error:", err);
 
      if (err?.code === "auth/email-already-in-use") {
        alert(
          "Cette adresse e-mail est déjà utilisée. Connectez-vous avec ce compte ou utilisez une autre adresse."
        );
      } else if (err?.code === "auth/invalid-email") {
        alert("L’adresse e-mail entrée n’est pas valide.");
      } else if (err?.code === "auth/weak-password") {
        alert("Le mot de passe est trop faible. Choisissez-en un plus sécurisé.");
      } else if (err?.code === "permission-denied") {
        alert(
          "Le compte a peut-être été créé, mais la création du salon a été refusée. Veuillez réessayer ou contacter l’administrateur."
        );
      } else {
        alert(
          "Une erreur est survenue pendant la création du compte. Veuillez réessayer."
        );
      }
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