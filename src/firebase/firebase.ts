// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAarV0xmTGKlOPSJY2FN7Whm2wpdoJ2iCI",
  authDomain: "salon-yaka.firebaseapp.com",
  projectId: "salon-yaka",
  storageBucket: "salon-yaka.firebasestorage.app",
  messagingSenderId: "383669346121",
  appId: "1:383669346121:web:cf1115536c5822279bc498",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };   // <-- correct