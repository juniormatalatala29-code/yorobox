import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Menu.css";

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  return (
    <>
      {/* Overlay */}
      {open && <div className="menu-overlay" onClick={toggle} />}

      {/* Bouton hamburger */}
      <button className="hamburger" onClick={toggle} aria-label="Ouvrir le menu">
        &#9776;
      </button>

      {/* Menu coulissant */}
      <aside className={`side-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <button className="close" onClick={toggle} aria-label="Fermer le menu">
          &times;
        </button>

        <nav className="menu-links">
          {/* On garde Accueil */}
          <Link to="/" onClick={toggle}>Accueil</Link>

          {/* 🔥 NOUVEAU BOUTON */}
          <Link to="/salons" onClick={toggle}>Salons</Link>

          <Link to="/tarifs" onClick={toggle}>Nos Modèles</Link>
          <Link to="/Nouscontacter" onClick={toggle}>Nous Contacter</Link>
          <Link to="/contact" onClick={toggle}>A propos de nous</Link>
        </nav>
      </aside>
    </>
  );
};

export default Menu;