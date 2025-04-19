// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzxhMVAnneafetFqSBDb0the3nas783qQ",
  authDomain: "mock-ai-interview-b6eb3.firebaseapp.com",
  projectId: "mock-ai-interview-b6eb3",
  storageBucket: "mock-ai-interview-b6eb3.firebasestorage.app",
  messagingSenderId: "885601975194",
  appId: "1:885601975194:web:5eb5d7ed487543ec9f9823",
  measurementId: "G-WY2YYFGMBE",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
