"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Label } from "@/components/ui/label";
import { createReview } from "@/lib/firestore";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  lawyerId: string;
  authorId: string;
  authorName: string;
  onSuccess: () => void;
}

export function ReviewForm({
  lawyerId,
  authorId,
  authorName,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Selecciona una valoración de 1 a 5 estrellas");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createReview(lawyerId, authorId, authorName, rating, comment.trim());
      setRating(0);
      setComment("");
      setSuccess(true);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar la reseña");
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Valoración</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  s <= displayRating ? "fill-amber-400 text-amber-400" : "text-muted"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Comentario</Label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Comparte tu experiencia..."
          spellCheck={false}
          lang="es"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Toast
        message="Reseña enviada correctamente"
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={4000}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar reseña"}
      </Button>
    </form>
  );
}
