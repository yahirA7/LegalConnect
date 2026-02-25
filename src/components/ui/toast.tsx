"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  className?: string;
}

export function Toast({
  message,
  visible,
  onDismiss,
  duration = 3000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground shadow-lg",
        className
      )}
    >
      <Check className="h-4 w-4 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
