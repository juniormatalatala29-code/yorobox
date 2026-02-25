// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_80d-sav0XevQfA-H-eXubqLUxZEHWJI",
  authDomain: "yaka-mobile.firebaseapp.com",
  projectId: "yaka-mobile",
  storageBucket: "yaka-mobile.firebasestorage.app",
  messagingSenderId: "570123276349",
  appId: "1:570123276349:web:1719caac1a728e88c71a54"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };   // <-- correct