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
