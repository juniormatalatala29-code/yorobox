import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Multimedia.css";

const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
];

export default function Multimedia() {
  return (
    <section className="multimedia-section">
      <div className="glass-card">
        <h2 className="title">Nos Modèles Signature</h2>
        <p className="subtitle">
          Découvrez l’élégance, le style et la perfection de nos coiffures
        </p>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="swiper-container"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="image-wrapper">
                <img src={img} alt={`Modèle ${index}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      <header className="accueil-header">
      </header>

      <div className="bottom-section">
        {/* Le bouton mène vers la route /suivanttarifs */}
        <Link to="/formulaire">
          <button className="cta-button">Suivant</button>
        </Link>
        <footer className="accueil-footer">
          Une Application Web développée par YoroBox
        </footer>
      </div>
      </div>
    </section>
  );
}