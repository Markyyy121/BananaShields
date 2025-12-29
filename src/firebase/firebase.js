// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUeGe0xK1nycesGkfweaw5nSkxJ1Ci-oI",
  authDomain: "bananashield-59b37.firebaseapp.com",
  projectId: "bananashield-59b37",
  storageBucket: "bananashield-59b37.firebasestorage.app",
  messagingSenderId: "253454228482",
  appId: "1:253454228482:web:987a7274504f7598751b1b",
};

// ✅ Initialize Firebase FIRST
const app = initializeApp(firebaseConfig);

// ✅ Then initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
