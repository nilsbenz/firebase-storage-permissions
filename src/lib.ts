import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getBlob, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./firebase";

export async function register() {
  await Promise.all([
    createUserWithEmailAndPassword(auth, "level1@test.com", "password").then(
      (credential) => {
        setDoc(doc(db, "members", credential.user.uid), { type: "level1" });
      }
    ),
    createUserWithEmailAndPassword(auth, "level2@test.com", "password").then(
      (credential) => {
        setDoc(doc(db, "companies", "c1", "members", credential.user.uid), {
          type: "level2",
        });
      }
    ),
    createUserWithEmailAndPassword(auth, "level3@test.com", "password").then(
      (credential) => {
        setDoc(
          doc(
            db,
            "companies",
            "c1",
            "departments",
            "d1",
            "members",
            credential.user.uid
          ),
          {
            type: "level3",
          }
        );
      }
    ),
  ]);
}

export async function login(level: number) {
  const email = `level${level}@test.com`;
  const password = "password";
  await signInWithEmailAndPassword(auth, email, password);
  return "Signed in as " + email;
}

export async function uploadFile() {
  const content = "Hello world";
  const blob = new Blob([content], { type: "text/plain" });

  const fileRef = ref(
    storage,
    `companies/c1/departments/d1/files/file-${Date.now()}.txt`
  );

  try {
    const snapshot = await uploadBytes(fileRef, blob);
    console.log("Created the file", snapshot);

    const downloadURL = await getDownloadURL(snapshot.ref);
    await setDoc(doc(db, "files/file"), { url: downloadURL });
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
}

export async function readFile() {
  try {
    const snapshot = await getDoc(doc(db, "files/file"));
    if (!snapshot.exists()) {
      throw new Error("File document does not exist");
    }
    const data = snapshot.data();
    if (!data.url) {
      throw new Error("File URL is missing");
    }
    const response = await getBlob(ref(storage, data.url));
    const content = await response.text();
    return "File read: " + content;
  } catch (error) {
    return String(error);
  }
}
