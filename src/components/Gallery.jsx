import { useParams } from "react-router-dom";
import { salons } from "../data/salons";
import "../styles/detail.css";

export default function SalonDetail() {
  const { id } = useParams();
  const salon = salons.find((s) => s.id === id);

  if (!salon) return <div>Salon introuvable</div>;

  return (
    <div className="detail-container">
      <img src={salon.bannerImage} className="banner" />

      <div className="detail-content">
        <h1>{salon.name}</h1>
        <p className="city">{salon.city}</p>

        <section>
          <h3>À propos</h3>
          <p>{salon.bio}</p>
        </section>

        <section>
          <h3>Horaires</h3>
          <p>{salon.horaires}</p>
        </section>

        <section>
          <h3>Tarifs</h3>
          {salon.tarifs.map((t, i) => (
            <div key={i} className="row">
              <span>{t.service}</span>
              <span>{t.price}</span>
            </div>
          ))}
        </section>

        <section>
          <h3>Catalogue</h3>
          {salon.catalogue.map((c, i) => (
            <div key={i} className="row">
              <span>{c.produit}</span>
              <span>{c.price}</span>
            </div>
          ))}
        </section>

        <section>
          <h3>Galerie</h3>
          <div className="gallery">
            {salon.gallery.map((img, i) => (
              <img key={i} src={img} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}