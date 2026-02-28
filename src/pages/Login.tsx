import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
 
const Login: React.FC = () => {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
 
      const uid = userCredential.user.uid;
 
      // 1) Vérifier si admin
      const adminRef = doc(db, "admins", uid);
      const adminSnap = await getDoc(adminRef);
 
      if (adminSnap.exists()) {
        navigate("/dashboard/admin");
        return;
      }
 
      // 2) Vérifier si salon (docId = uid)
      const salonRef = doc(db, "salons", uid);
      const salonSnap = await getDoc(salonRef);
 
      if (salonSnap.exists()) {
        navigate("/dashboard");
        return;
      }
 
      // 3) Ni admin ni salon -> forcer création salon
      await signOut(auth);
      alert("Ce compte n'est lié à aucun salon. Veuillez créer votre salon.");
      navigate("/register");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        alert("Email ou mot de passe incorrect.");
      } else if (code === "auth/user-not-found") {
        alert("Aucun compte trouvé avec cet email.");
      } else {
        alert(err?.message || "Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Accédez à votre espace salon / admin</p>
 
        <form className="auth-form" onSubmit={handleLogin}>
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
 
        <div className="auth-link">
          Pas de compte ? <Link to="/register">Créer un</Link>
        </div>
      </div>
    </div>
  );
};
 
export default Login;