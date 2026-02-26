import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "./firebase";

function requireDb() {
  if (!db) throw new Error("Firebase no configurado. Añade las credenciales en .env.local");
}
import { sanitizeText } from "./sanitize";
import type {
  LawyerProfile,
  Appointment,
  Specialty,
} from "./types";
import { SPECIALTIES } from "./types";

const USERS = "users";
const APPOINTMENTS = "appointments";
const BOOKED_SLOTS = "booked_slots";
const REVIEWS = "reviews";

export async function updateLawyerProfile(
  uid: string,
  data: Partial<Omit<LawyerProfile, "uid" | "email" | "role" | "createdAt">>
) {
  requireDb();
  const ref = doc(db!, USERS, uid);
  const sanitized = { ...data };
  if (typeof sanitized.bio === "string") sanitized.bio = sanitizeText(sanitized.bio, 2000);
  await updateDoc(ref, {
    ...sanitized,
    updatedAt: new Date().toISOString(),
  });
}

export async function getLawyerProfile(uid: string): Promise<LawyerProfile | null> {
  if (!db) return null;
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data()?.role !== "abogado") return null;
  return { uid: snap.id, ...snap.data() } as LawyerProfile;
}

export async function searchLawyers(filters: {
  specialty?: Specialty;
  minRating?: number;
  searchTerm?: string;
}) {
  if (!db) return [];
  const constraints: Parameters<typeof query>[2][] = [
    where("role", "==", "abogado"),
    limit(100),
  ];
  if (filters.specialty) {
    constraints.push(where("specialty", "==", filters.specialty));
  }
  const q = query(collection(db, USERS), ...constraints);

  const snapshot = await getDocs(q);
  let lawyers = snapshot.docs
    .map((d) => ({ uid: d.id, ...d.data() } as DocumentData))
    .filter((l) => l.specialty || l.specialties?.length);

  if (filters.specialty) {
    lawyers = lawyers.filter(
      (l) =>
        l.specialty === filters.specialty ||
        l.specialties?.includes(filters.specialty)
    );
  }

  if (filters.minRating != null && filters.minRating > 0) {
    lawyers = lawyers.filter((l) => (l.rating ?? 0) >= filters.minRating!);
  }

  if (filters.searchTerm?.trim()) {
    const term = filters.searchTerm.toLowerCase();
    lawyers = lawyers.filter(
      (l) =>
        l.displayName?.toLowerCase().includes(term) ||
        l.specialty?.toLowerCase().includes(term) ||
        l.bio?.toLowerCase().includes(term) ||
        l.location?.toLowerCase().includes(term)
    );
  }

  lawyers.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return lawyers;
}

/** Comprueba si un horario está ocupado usando booked_slots (sin exponer datos de otras citas). */
export async function isSlotOccupied(
  lawyerId: string,
  date: string,
  time: string
): Promise<boolean> {
  if (!db) return false;
  const slotId = `${lawyerId}_${date}_${time}`;
  const slotRef = doc(db, BOOKED_SLOTS, slotId);
  const snap = await getDoc(slotRef);
  return snap.exists();
}

export async function createAppointment(
  lawyerId: string,
  date: string,
  time: string,
  notes?: string
) {
  requireDb();
  if (!auth?.currentUser) throw new Error("Debes iniciar sesión para reservar");
  const clientId = auth.currentUser.uid;
  const slotId = `${lawyerId}_${date}_${time}`;
  const slotRef = doc(db!, BOOKED_SLOTS, slotId);
  const aptRef = doc(collection(db!, APPOINTMENTS));
  const now = new Date().toISOString();
  const aptData = {
    clientId,
    lawyerId,
    status: "pendiente",
    date,
    time,
    notes: notes ? sanitizeText(notes, 500) : null,
    createdAt: now,
    updatedAt: now,
  };
  await runTransaction(db!, async (tx) => {
    const slotSnap = await tx.get(slotRef);
    if (slotSnap.exists()) {
      throw new Error("Este horario ya no está disponible. Elige otra fecha u hora.");
    }
    tx.set(slotRef, { lawyerId, date, time, createdAt: now });
    tx.set(aptRef, aptData);
  });
  return aptRef.id;
}

export async function getAppointmentsByUser(uid: string, asClient: boolean) {
  if (!db) return [];
  const q = query(
    collection(db, APPOINTMENTS),
    where(asClient ? "clientId" : "lawyerId", "==", uid),
    limit(50)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as {
    id: string;
    date: string;
    time: string;
    [key: string]: unknown;
  }[];
  data.sort((a, b) => {
    const dateCompare = (b.date ?? "").localeCompare(a.date ?? "");
    if (dateCompare !== 0) return dateCompare;
    return (b.time ?? "").localeCompare(a.time ?? "");
  });
  return data;
}

export async function getUpcomingAppointments(
  uid: string,
  asClient: boolean,
  limitCount = 5
) {
  const today = new Date().toISOString().slice(0, 10);
  const data = await getAppointmentsByUser(uid, asClient);
  type Apt = { id: string; date: string; time: string; status: string; lawyerId?: string; clientId?: string };
  const upcoming = (data as Apt[])
    .filter(
      (a) =>
        a.status !== "cancelada" &&
        a.status !== "completada" &&
        a.date >= today
    )
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    })
    .slice(0, limitCount);
  const otherIds = upcoming.map((a) => (asClient ? a.lawyerId : a.clientId)).filter(Boolean) as string[];
  const nameMap = otherIds.length > 0 ? await getDisplayNames(otherIds) : {};
  return upcoming.map((a) => ({
    ...a,
    otherName: nameMap[asClient ? a.lawyerId! : a.clientId!] ?? (asClient ? "Abogado" : "Cliente"),
  }));
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment["status"]
) {
  requireDb();
  const ref = doc(db!, APPOINTMENTS, appointmentId);
  const snap = await getDoc(ref);
  if (snap.exists() && status === "cancelada") {
    const d = snap.data();
    const slotId = `${d.lawyerId}_${d.date}_${d.time}`;
    const slotRef = doc(db!, BOOKED_SLOTS, slotId);
    await deleteDoc(slotRef);
  }
  await updateDoc(ref, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

async function updateLawyerRating(lawyerId: string) {
  if (!db) return;
  const reviews = await getReviewsByLawyer(lawyerId);
  const count = reviews.length;
  const avg = count > 0
    ? reviews.reduce((sum, r) => sum + ((r as { rating?: number }).rating ?? 0), 0) / count
    : 0;
  const userRef = doc(db, USERS, lawyerId);
  await updateDoc(userRef, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
    updatedAt: new Date().toISOString(),
  });
}

export async function createReview(
  lawyerId: string,
  authorId: string,
  authorName: string,
  rating: number,
  comment: string
) {
  requireDb();
  const ref = collection(db!, REVIEWS);
  const now = new Date().toISOString();
  await addDoc(ref, {
    lawyerId,
    authorId,
    authorName: sanitizeText(authorName, 100),
    rating,
    comment: sanitizeText(comment, 1000),
    createdAt: now,
    updatedAt: now,
  });
  await updateLawyerRating(lawyerId);
}

export async function getReviewsByLawyer(lawyerId: string) {
  if (!db) return [];
  const q = query(
    collection(db, REVIEWS),
    where("lawyerId", "==", lawyerId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getDisplayNames(uids: string[]): Promise<Record<string, string>> {
  if (!db || uids.length === 0) return {};
  const firestore = db;
  const unique = [...new Set(uids)];
  const results = await Promise.all(
    unique.map(async (uid) => {
      const ref = doc(firestore, USERS, uid);
      const snap = await getDoc(ref);
      return [uid, snap.exists() ? (snap.data().displayName as string) ?? "Usuario" : "Usuario"];
    })
  );
  return Object.fromEntries(results);
}

export async function getUserReviewForLawyer(
  lawyerId: string,
  authorId: string
): Promise<{ id: string; rating: number; comment: string } | null> {
  if (!db) return null;
  const q = query(
    collection(db, REVIEWS),
    where("lawyerId", "==", lawyerId),
    where("authorId", "==", authorId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  const doc = snapshot.docs[0];
  if (!doc) return null;
  const d = doc.data();
  return { id: doc.id, rating: d.rating, comment: d.comment };
}

export { SPECIALTIES };
