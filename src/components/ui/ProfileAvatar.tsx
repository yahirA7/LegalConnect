"use client";

import { useState, useEffect } from "react";
import { User, Camera } from "lucide-react";
import { getProxiedImageUrl } from "@/lib/storage";

interface ProfileAvatarProps {
  src: string | null | undefined;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  placeholder?: "user" | "camera";
  className?: string;
}

const sizes = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

/**
 * Avatar para URLs externas (Firebase Storage) y blob URLs.
 * Estrategia: 1) URL directa, 2) si falla, proxy, 3) si falla, icono.
 */
export function ProfileAvatar({ src, alt, size = "md", placeholder = "user", className = "" }: ProfileAvatarProps) {
  const [attempt, setAttempt] = useState<"direct" | "proxy">("direct");
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const isFirebaseUrl = src?.startsWith("https://") && src?.includes("firebasestorage.googleapis.com");
  const proxyUrl = isFirebaseUrl ? getProxiedImageUrl(src!) : null;

  const imgSrc =
    !src ? null
    : attempt === "proxy" && proxyUrl ? proxyUrl
    : src;

  useEffect(() => {
    if (src) {
      setAttempt("direct");
      setLoaded(false);
      setFailed(false);
    }
  }, [src]);

  const handleError = () => {
    if (attempt === "direct" && proxyUrl) {
      setAttempt("proxy");
      setLoaded(false);
    } else {
      setFailed(true);
    }
  };

  const showImage = imgSrc && !failed;
  const sizeClass = sizes[size];
  const iconClass = iconSizes[size];

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center ${sizeClass} ${className}`}
    >
      {showImage ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}
          <img
            key={imgSrc}
            src={imgSrc}
            alt={alt}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`object-cover w-full h-full ${!loaded ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
            onLoad={() => setLoaded(true)}
            onError={handleError}
          />
        </>
      ) : (
        placeholder === "camera" ? (
          <Camera className={`${iconClass} text-muted-foreground`} strokeWidth={1.5} />
        ) : (
          <User className={`${iconClass} text-muted-foreground`} strokeWidth={1.5} />
        )
      )}
    </div>
  );
}
