import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHOB-9W66W21z8ocmBaVR9_21D2s4zh20",
  authDomain: "blackbook-platform.firebaseapp.com",
  projectId: "blackbook-platform",
  storageBucket: "blackbook-platform.firebasestorage.app",
  messagingSenderId: "149569906698",
  appId: "1:149569906698:web:a003dddc13edc8498097f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
