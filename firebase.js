// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjyd38vsU5iFSN8lQ8uykpWYjvGaAAqt8",
  authDomain: "jedscuisine.firebaseapp.com",
  projectId: "jedscuisine",
  storageBucket: "jedscuisine.appspot.com",
  messagingSenderId: "97711882382",
  appId: "1:97711882382:web:1251da25716c73db3f09df",
  measurementId: "G-KW8PM9N0KH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, storage };
