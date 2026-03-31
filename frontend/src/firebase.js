// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA2QD-5yI_rQpy3p5qh9GPt-1Mi-_1A90",
  authDomain: "karmy-pet-shop.firebaseapp.com",
  projectId: "karmy-pet-shop",
  storageBucket: "karmy-pet-shop.firebasestorage.app",
  messagingSenderId: "737686418741",
  appId: "1:737686418741:web:78621c3c5049751a24487c",
  measurementId: "G-LSFP88CQ1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
export default app;

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();