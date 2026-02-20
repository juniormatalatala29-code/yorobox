import bellaProfile from "../assets/salons/bella-profile.jpg";
import bellaBanner from "../assets/salons/bella-banner.jpg";
import bella1 from "../assets/salons/bella-1.jpg";
import bella2 from "../assets/salons/bella-2.jpg";

export const salons = [
  {
    id: "bella-normal",
    name: "Bella Beauty",
    city: "Kinshasa",
    plan: "normal" | "vip" | "premium"
    profileImage: bellaProfile,
    bannerImage: bellaBanner,
    description: "Spécialiste locks & tresses",
    bio: "Salon convivial avec service professionnel.",
    horaires: "Lundi - Samedi : 8h - 18h",
    tarifs: [
      { service: "Tresses simples", price: "20$" }
    ],
    gallery: [bella1]
  },
  {
    id: "bella-premium",
    name: "Bella Beauty Premium",
    city: "Kinshasa",
    plan: "premium",
    profileImage: bellaProfile,
    bannerImage: bellaBanner,
    description: "Salon premium spécialisé coiffure moderne",
    bio: "Créé en 2016, expertise & qualité haut de gamme.",
    horaires: "Lundi - Samedi : 8h - 19h",
    tarifs: [
      { service: "Tresses", price: "30$" },
      { service: "Locks", price: "45$" }
    ],
    catalogue: [
      { produit: "Perruque", price: "120$" }
    ],
    gallery: [bella1, bella2]
  },
  {
    id: "bella-vip",
    name: "Bella Beauty VIP",
    city: "Kinshasa",
    plan: "vip",
    profileImage: bellaProfile,
    bannerImage: bellaBanner,
    description: "Salon VIP haute couture",
    bio: "Service exclusif, équipe dédiée, prestations événements.",
    horaires: "7j/7 : 8h - 21h",
    tarifs: [
      { service: "Mariage", price: "250$" },
      { service: "Coiffure VIP", price: "80$" }
    ],
    catalogue: [
      { produit: "Perruque luxe", price: "300$" }
    ],
    gallery: [bella1, bella2]
  }
];