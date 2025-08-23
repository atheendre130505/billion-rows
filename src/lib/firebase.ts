// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  projectId: "brc-speedster",
  appId: "1:710657708781:web:c849b2834e4ac2bf29f2e4",
  storageBucket: "brc-speedster.appspot.com",
  apiKey: "AIzaSyACchi_gEquPV_WwyYUGQnCZUpbbsHRm4U",
  authDomain: "brc-speedster.firebaseapp.com",
  messagingSenderId: "710657708781",
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions };
