import { onAuthStateChanged, type User } from "firebase/auth";
import { collectionGroup, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { login, readFile } from "./lib";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [response, _setResponse] = useState<string[]>([]);
  const [memberships, setMemberships] = useState<{ userId: string }[]>();

  function addToLog(text: string) {
    _setResponse((prev) => [
      `[${new Date().toLocaleTimeString()}] ${text}`,
      ...prev,
    ]);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      addToLog(user?.email ? `Logged in as ${user.email}` : "Not logged in");
    });
    getDocs(collectionGroup(db, "members")).then((snapshot) => {
      const memberships = snapshot.docs.map((doc) => ({
        path: doc.ref.path,
        userId: doc.id,
        ...doc.data(),
      }));
      setMemberships(memberships);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-4 space-y-8">
      <div>
        {user ? <p>Signed in as {user.email}</p> : <p>Not signed in</p>}
      </div>
      {/* <div>
        <button onClick={register} className="bg-red-200 px-2 py-1">
          Register users
        </button>
      </div> */}
      <div className="flex gap-4">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => login(level)}
            className="bg-teal-200 px-2 py-1"
          >
            Login as level {level}
          </button>
        ))}
      </div>
      <div>
        <p className="font-medium">Memberships:</p>
        <pre className="text-sm overflow-x-auto">
          {JSON.stringify(
            memberships?.filter((m) => m.userId === user?.uid),
            null,
            2
          )}
        </pre>
      </div>
      {/* <div>
        <button onClick={uploadFile} className="bg-red-200 px-2 py-1">
          Upload File
        </button>
      </div> */}
      <div>
        <button
          onClick={() => readFile().then((res) => addToLog(res))}
          className="bg-purple-200 px-2 py-1"
        >
          Read File from Storage
        </button>
      </div>
      <div>
        <p className="font-medium">Logs:</p>
        <ul className="[&>li:nth-child(odd)]:bg-gray-200">
          {response.map((res, i) => (
            <li
              key={i}
              className={`py-2 ${
                res.includes("FirebaseError")
                  ? "text-red-600"
                  : res.includes("File read: ")
                  ? "text-green-600"
                  : ""
              }`}
            >
              {res}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
