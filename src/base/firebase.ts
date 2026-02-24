// src/firebase/firebase.ts
/*import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- ajout Firestore

const firebaseConfig = {
  apiKey: "AIzaSyD7UEYXvMj1whtdzEtDCyCbDJNW2KXWa6Q",
  authDomain: "yorobox-2325.firebaseapp.com",
  projectId: "yorobox-2325",
  storageBucket: "yorobox-2325.appspot.com", // attention à .app au lieu de .firebasestorage.app
  messagingSenderId: "499605564726",
  appId: "1:499605564726:web:13ca13e6c5381d78379797",
  measurementId: "G-S0RHQ19524"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore et l’exporter pour ton projet
export const db = getFirestore(app);^

/*  BOUTON  */
