import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyA7gULYFYAZpggECZA6g0dgTYrkhwaPQxQ",
  authDomain: "oval-leaf-d9ffs.firebaseapp.com",
  projectId: "oval-leaf-d9ffs",
  storageBucket: "oval-leaf-d9ffs.firebasestorage.app",
  messagingSenderId: "490771641590",
  appId: "1:490771641590:web:c8cf9b0c31593e001da8d7"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if provided
export const db = getFirestore(app, "ai-studio-englishplacement-4951a063-ae8d-4e3c-aef1-cb9ae9e49298");

export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
