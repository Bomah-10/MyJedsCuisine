// firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjyd38vsU5iFSN8lQ8uykpWYjvGaAAqt8",
  authDomain: "jedscuisine.firebaseapp.com",
  projectId: "jedscuisine",
  storageBucket: "jedscuisine.appspot.com",
  messagingSenderId: "97711882382",
  appId: "1:97711882382:web:1251da25716c73db3f09df",
  measurementId: "G-KW8PM9N0KH"
};

// Declare Firebase services
let app, analytics, firestore, auth, storage;

if (!getApps().length) {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firestore
  firestore = getFirestore(app);

  // Initialize Auth with persistence for React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  // Initialize Storage
  storage = getStorage(app);

  // Initialize Analytics if supported (won’t work on React Native but safe for web)
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} else {
  // Firebase app already initialized, just get instances
  app = getApps()[0];
  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Export Firebase services
export { app, firestore, auth, storage, analytics };
