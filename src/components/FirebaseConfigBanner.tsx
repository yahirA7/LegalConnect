"use client";

import { auth } from "@/lib/firebase";

export function FirebaseConfigBanner() {
  if (auth) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm text-amber-800">
      Firebase no configurado. Copia <code className="bg-amber-100 px-1 rounded">.env.local.example</code> a{" "}
      <code className="bg-amber-100 px-1 rounded">.env.local</code> y añade tus credenciales desde la{" "}
      <a
        href="https://console.firebase.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium"
      >
        consola de Firebase
      </a>
      .
    </div>
  );
}
