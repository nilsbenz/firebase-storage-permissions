import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { login, readFile } from "./lib";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [response, setResponse] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return unsubscribe;
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        {user ? <p>Signed in as {user.email}</p> : <p>Not signed in</p>}
      </div>
      {/* <div>
        <button onClick={register} className="bg-gray-200 px-2 py-1">
          Register users
        </button>
      </div> */}
      <div className="flex gap-4">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() =>
              login(level).then((res) => setResponse((prev) => [res, ...prev]))
            }
            className="bg-gray-200 px-2 py-1"
          >
            Login as level {level}
          </button>
        ))}
      </div>
      {/* <div>
        <button onClick={uploadFile} className="bg-gray-200 px-2 py-1">
          Upload File
        </button>
      </div> */}
      <div>
        <button
          onClick={() =>
            readFile().then((res) => setResponse((prev) => [res, ...prev]))
          }
          className="bg-gray-200 px-2 py-1"
        >
          Read File
        </button>
      </div>
      <ul className="divide-y">
        {response.map((res, i) => (
          <li key={i} className="py-2">
            {res}
          </li>
        ))}
      </ul>
    </div>
  );
}
