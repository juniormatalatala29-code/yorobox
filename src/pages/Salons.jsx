import { salons } from "../data/salons";
import { useNavigate } from "react-router-dom";
import "../styles/salons.css";

export default function Salons() {
  const navigate = useNavigate();

  return (
    <div className="salons-container">
      <h2 className="salons-title">SALONS PREMIUM</h2>

      {salons.map((salon) => (
        <div
          key={salon.id}
          className="salon-card"
          onClick={() => navigate(`/salon/${salon.id}`)}
        >
          <img src={salon.profileImage} className="salon-image" />

          <div className="salon-content">
            <div className="salon-top">
              <h3>{salon.name}</h3>
              {salon.isPremium && (
                <span className="premium-badge">VIP</span>
              )}
            </div>

            <p className="salon-city">{salon.city}</p>
            <p className="salon-desc">{salon.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}