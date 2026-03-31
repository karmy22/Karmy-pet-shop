import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAA2QD-5yI_rQpy3p5qh9GPt-1Mi-_1A90',
  authDomain: 'karmy-pet-shop.firebaseapp.com',
  projectId: 'karmy-pet-shop',
  storageBucket: 'karmy-pet-shop.firebasestorage.app',
  messagingSenderId: '737686418741',
  appId: '1:737686418741:web:78621c3c5049751a24487c',
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();