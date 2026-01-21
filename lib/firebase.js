import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

 const firebaseConfig = {
    apiKey: "AIzaSyC8_VXaG-DCFOZGlcuy6G9umCOlWDRV-Dk",
    authDomain: "menu-7a907.firebaseapp.com",
    projectId: "menu-7a907",
    storageBucket: "menu-7a907.firebasestorage.app",
    messagingSenderId: "1022340440060",
    appId: "1:1022340440060:web:a4391382a52b97d7831c79",
    measurementId: "G-G7EL3C6KHZ"
  }

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);