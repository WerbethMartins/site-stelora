// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABL4ogpLLNqCFwtA73W-vCUtnh-6ipCBw",
  authDomain: "stelora-shop.firebaseapp.com",
  projectId: "stelora-shop",
  storageBucket: "stelora-shop.firebasestorage.app",
  messagingSenderId: "119000959574",
  appId: "1:119000959574:web:1dd2623aa83f825d0e09f7",
  measurementId: "G-6K45PYLF4D"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);