"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className={cn("flex gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-muted"
          )}
        />
      ))}
    </div>
  );
}
