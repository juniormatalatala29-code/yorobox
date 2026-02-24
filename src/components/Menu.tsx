import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Menu.css";

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    <>
      {open && <div className="menu-overlay" onClick={toggle} />}

      <button className="hamburger" onClick={toggle}>
        &#9776;
      </button>

      <aside className={`side-menu ${open ? "open" : ""}`}>
        <button className="close" onClick={toggle}>
          &times;
        </button>

        <nav className="menu-links">
          <Link to="/" onClick={toggle}>Accueil</Link>
          <Link to="/salons" onClick={toggle}>Salons</Link>
          <Link to="/tarifs" onClick={toggle}>Nos Modèles</Link>
          <Link to="/nouscontacter" onClick={toggle}>Nous Contacter</Link>
          <Link to="/contact" onClick={toggle}>A propos de nous</Link>

          {/* 🔐 Nouveau bouton */}
          <Link to="/login" onClick={toggle}>Se connecter</Link>
        </nav>
      </aside>
    </>
  );
};

export default Menu;