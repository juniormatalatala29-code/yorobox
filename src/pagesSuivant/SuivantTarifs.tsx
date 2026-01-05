import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "../pages/Multimedia.css";

import "swiper/css/bundle";

const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",
  "/images/image7.jpg",
  "/images/image8.jpg",
  "/images/image9.jpg",
  "/images/image10.jpg",
  "/images/image11.jpg",
  "/images/image12.jpg",
  "/images/image13.jpg",
];

export default function Multimedia() {
  return (
    <section className="multimedia-section">

      <div className="content-wrapper">
        {/* CARD */}
        <div className="glass-card">
          <h2 className="title">Nos Modèles Signature</h2>
          <p className="subtitle">
            Découvrez l’élégance, le style et la perfection de nos coiffures
          </p>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
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
        </div>

        {/* BOUTON SOUS LA CARD */}
        <div className="bottom-section">
          <Link to="/formulaire">
            <button className="cta-button">Commencer ma réservation</button>
          </Link>
          <footer className="Tarifs-footer">
            Une Application Web développée par YoroBox
          </footer>
        </div>
      </div>
    </section>
  );
}
