import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    salonName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "salons", user.uid), {
        uid: user.uid,
        salonName: form.salonName,
        email: form.email,
        subscriptionType: "standard",
        subscriptionEndDate: null,
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un Compte</h2>

        <form onSubmit={handleRegister}>
          <input
            name="salonName"
            placeholder="Nom du salon"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Adresse email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
          />

          <button type="submit">Créer mon compte</button>
        </form>

        <div className="auth-link">
          <p>
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;