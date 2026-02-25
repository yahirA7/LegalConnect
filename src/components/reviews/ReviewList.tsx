"use client";

import { StarRating } from "./StarRating";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">Aún no hay reseñas.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="border-b pb-4 last:border-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{r.authorName}</span>
            <StarRating rating={r.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              {new Date(r.createdAt).toLocaleDateString("es-ES")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
