import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Solo se permiten imágenes JPG, PNG o WebP.";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `La imagen no puede superar ${MAX_SIZE_MB} MB.`;
  }
  return null;
}

/**
 * Sube una foto de perfil a Firebase Storage y devuelve la URL pública.
 * La imagen se guarda en users/{uid}/avatar.{ext}
 */
export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  if (!storage) throw new Error("Firebase Storage no configurado. Revisa .env.local");

  const err = validateImageFile(file);
  if (err) throw new Error(err);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const path = `users/${uid}/avatar.${safeExt}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: { uploadedBy: uid },
  });

  return getDownloadURL(storageRef);
}

/**
 * Convierte una URL de Firebase Storage a la ruta del proxy de imágenes.
 * Incluye URLs de producción y emulador.
 */
export function getProxiedImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const isFirebase = url.includes("firebasestorage.googleapis.com") || url.includes("127.0.0.1:9199");
  if (!isFirebase) return null;
  return `/api/image?url=${encodeURIComponent(url)}`;
}
