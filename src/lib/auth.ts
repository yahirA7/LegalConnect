import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserRole } from "./types";

const USERS_COLLECTION = "users";

export async function setAuthSession(uid: string, role: UserRole): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, role }),
  });
  if (!res.ok) throw new Error("Error al establecer sesión");
}

export function setAuthCookies(role: UserRole) {
  if (typeof document !== "undefined") {
    document.cookie = `userRole=${role}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function clearAuthCookies() {
  if (typeof document !== "undefined") {
    document.cookie = "userRole=; path=/; max-age=0";
  }
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) {
  if (!auth || !db) throw new Error("Firebase no configurado. Añade las credenciales en .env.local");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  const userDoc = {
    uid: user.uid,
    email: user.email,
    displayName: displayName,
    role,
    photoURL: user.photoURL ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, USERS_COLLECTION, user.uid), userDoc);

  return userCredential;
}

export async function signIn(email: string, password: string) {
  if (!auth) throw new Error("Firebase no configurado. Añade las credenciales en .env.local");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email: string) {
  if (!auth) throw new Error("Firebase no configurado. Añade las credenciales en .env.local");
  return sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignorar si falla (ej. sin conexión)
  }
  clearAuthCookies();
  if (!auth) return;
  return firebaseSignOut(auth);
}

export async function getUserProfile(uid: string) {
  if (!db) return null;
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function getCurrentUserRole(user: User): Promise<UserRole | null> {
  const profile = await getUserProfile(user.uid);
  return profile?.role ?? null;
}
