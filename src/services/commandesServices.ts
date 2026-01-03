// src/services/commandeService.ts
import { collection, addDoc } from "firebase/firestore";
import { db } from "../base/firebase"; // chemin vers le service firebase.ts

export async function ajouterCommande(data: {
  nom: string;
  adresse: string;
  telephone: string;
  message?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "commandes"), data);
    console.log("Commande ajoutée avec ID:", docRef.id);
  } catch (e) {
    console.error("Erreur lors de l'ajout :", e);
    throw e; // relance l'erreur pour le formulaire
  }
}
