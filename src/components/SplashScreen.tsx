import React from "react";
import "../styles/splash.css";

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      <div className="splash-overlay" />

      <div className="splash-content">
        <div className="splash-badge">YAKA</div>

        <h1 className="splash-title">YAKA</h1>

        <p className="splash-subtitle">
          Beauté • Salons • Événementiel
        </p>

        <div className="splash-line" />
      </div>
    </div>
  );
};

export default SplashScreen;




