// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP6uTx6kQ_VkwENFRYvxj_-lR24ZTn8N4",
  authDomain: "lock-in-e0d2a.firebaseapp.com",
  projectId: "lock-in-e0d2a",
  storageBucket: "lock-in-e0d2a.firebasestorage.app",
  messagingSenderId: "99789007148",
  appId: "1:99789007148:web:b2e35bf80adb14198b2489",
  measurementId: "G-FCDMWHL28R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;