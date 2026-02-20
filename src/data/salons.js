import bellaProfile from "../assets/salons/bella-profile.jpg";
import bellaBanner from "../assets/salons/bella-banner.jpg";
import bella1 from "../assets/salons/bella-1.jpg";
import bella2 from "../assets/salons/bella-2.jpg";

export const salons = [
  {
    id: "bella-beauty",
    name: "Bella Beauty",
    city: "Kinshasa",
    isPremium: true,
    profileImage: bellaProfile,
    bannerImage: bellaBanner,
    description: "Spécialiste locks & tresses haut de gamme",
    bio: "Créé en 2016 par passion pour la coiffure africaine moderne.",
    horaires: "Lundi - Samedi : 8h - 19h",
    tarifs: [
      { service: "Tresses simples", price: "25$" },
      { service: "Locks", price: "40$" }
    ],
    catalogue: [
      { produit: "Perruque brésilienne", price: "120$" },
      { produit: "Mèches premium", price: "30$" }
    ],
    gallery: [bella1, bella2]
  }
];