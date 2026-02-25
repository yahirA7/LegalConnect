/**
 * Sanitiza texto de usuario para prevenir XSS.
 * Elimina etiquetas HTML y limita longitud.
 */
export function sanitizeText(input: string | null | undefined, maxLength = 2000): string {
  if (input == null || typeof input !== "string") return "";
  const s = input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
  return s.slice(0, maxLength);
}
