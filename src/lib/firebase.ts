import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0qzTbdm9pknpmuo11XU55mOW0g5Fhzs0",
    authDomain: "navyug-data.firebaseapp.com",
    projectId: "navyug-data",
    storageBucket: "navyug-data.firebasestorage.app",
    messagingSenderId: "1008495265302",
    appId: "1:1008495265302:web:8e341d72dd991de311d737",
    measurementId: "G-RM8PV2TT31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
