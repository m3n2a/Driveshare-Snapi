import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDifecpzna9rAedEIlw0ImAYo53-cLIWl0",
  authDomain: "snapi-3c80d.firebaseapp.com",
  databaseURL: "https://snapi-3c80d-default-rtdb.firebaseio.com",
  projectId: "snapi-3c80d",
  storageBucket: "snapi-3c80d.firebasestorage.app",
  messagingSenderId: "951911365298",
  appId: "1:951911365298:web:7ca07d02244dec928b27ab",
  measurementId: "G-0GS3L5LK90"

};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
