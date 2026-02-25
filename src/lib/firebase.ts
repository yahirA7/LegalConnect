import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigValid =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 10 &&
  firebaseConfig.projectId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isConfigValid) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
      connectStorageEmulator(storage, "127.0.0.1", 9199);
    }
  } else {
    app = getApps()[0] as FirebaseApp;
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
}

export { app, auth, db, storage };
export type { User };
