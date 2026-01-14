import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwF_nz7WjpicKUVxIs8VnKfdl2tU3Ccrs",
  authDomain: "fb-storage-permissions.firebaseapp.com",
  projectId: "fb-storage-permissions",
  storageBucket: "fb-storage-permissions.firebasestorage.app",
  messagingSenderId: "252927868076",
  appId: "1:252927868076:web:67b3431319ee1726063309",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
