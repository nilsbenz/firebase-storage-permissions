import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAwF_nz7WjpicKUVxIs8VnKfdl2tU3Ccrs",
  authDomain: "fb-storage-permissions.firebaseapp.com",
  projectId: "fb-storage-permissions",
  storageBucket: "fb-storage-permissions.firebasestorage.app",
  messagingSenderId: "252927868076",
  appId: "1:252927868076:web:67b3431319ee1726063309",
};

const app = initializeApp(firebaseConfig);

export { app };
