import { useNavigate } from "react-router-dom";

export default function SalonCard({ salon }) {
  const navigate = useNavigate();

  return (
    <div
      className="salon-card"
      onClick={() => navigate(`/salon/${salon.id}`)}
    >
      <img
        src={salon.profileImage}
        alt={salon.name}
        className="salon-avatar"
      />

      <div className="salon-info">
        <div className="salon-header">
          <h3>{salon.name}</h3>
          {salon.isPremium && <span className="badge">PREMIUM</span>}
        </div>

        <p className="city">{salon.city}</p>
        <p className="desc">{salon.description}</p>
      </div>
    </div>
  );
}