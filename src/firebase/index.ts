// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Using the VITE_ prefix for environment variables
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
};

// Access the OpenAI API key from environment variables
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Example function using OpenAI API key (simplified)
const useOpenAiApiKey = () => {
  console.log('OpenAI API Key:', openaiApiKey);
};

useOpenAiApiKey();

export { useOpenAiApiKey };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
