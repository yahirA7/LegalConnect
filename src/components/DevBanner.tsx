"use client";

import { useEffect, useState } from "react";

export function DevBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isLocalhost = host === "localhost" || host === "127.0.0.1";
    const isNetworkIP = /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(host);
    if (isNetworkIP && !isLocalhost) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-center text-sm text-blue-800">
      <strong>Desarrollo:</strong> Si tienes problemas de sesión, usa{" "}
      <a href="http://localhost:3000" className="underline font-medium">
        http://localhost:3000
      </a>{" "}
      desde este ordenador.
    </div>
  );
}
