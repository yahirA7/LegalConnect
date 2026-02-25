"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MapPin, DollarSign, Star, ArrowLeft } from "lucide-react";
import { formatPricePerHour } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLawyerProfile, getReviewsByLawyer, getUserReviewForLawyer } from "@/lib/firestore";
import { StarRating } from "@/components/reviews/StarRating";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { BookingForm } from "@/components/appointments/BookingForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { MainNav } from "@/components/nav/MainNav";

export default function LawyerPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, profile } = useAuth();
  const [lawyer, setLawyer] = useState<Awaited<ReturnType<typeof getLawyerProfile>>>(null);
  const [reviews, setReviews] = useState<{ id: string; authorName: string; rating: number; comment: string; createdAt: string }[]>([]);
  const [existingReview, setExistingReview] = useState<{ id: string; rating: number; comment: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshReviews = () => {
    if (!id) return;
    getReviewsByLawyer(id).then((r) =>
      setReviews(r as { id: string; authorName: string; rating: number; comment: string; createdAt: string }[])
    );
  };

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getLawyerProfile(id),
      getReviewsByLawyer(id),
      user ? getUserReviewForLawyer(id, user.uid) : Promise.resolve(null),
    ]).then(([lawyerData, reviewsData, myReview]) => {
      setLawyer(lawyerData);
      setReviews(reviewsData as { id: string; authorName: string; rating: number; comment: string; createdAt: string }[]);
      setExistingReview(myReview);
      setLoading(false);
    });
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Abogado no encontrado</p>
        <Link href="/buscar">
          <Button>Volver a buscar</Button>
        </Link>
      </div>
    );
  }

  const isClient = profile?.role === "cliente";
  const canReview = isClient && user && !existingReview;
  const displayRating = reviews.length > 0
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : lawyer.rating;

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/buscar" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver a buscar
          </Link>
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold">{lawyer.displayName}</h1>
            <p className="text-primary font-medium capitalize mt-1">{lawyer.specialty}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              {(displayRating != null && displayRating > 0) && (
                <span className="flex items-center gap-1">
                  <StarRating rating={displayRating} />
                  {displayRating.toFixed(1)}
                  {reviews.length > 0 && (
                    <span>({reviews.length} reseñas)</span>
                  )}
                </span>
              )}
              {lawyer.pricePerHour != null && lawyer.pricePerHour > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {formatPricePerHour(lawyer.pricePerHour)}
                </span>
              )}
              {lawyer.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {lawyer.location}
                  {lawyer.city && `, ${lawyer.city}`}
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {lawyer.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle>Biografía</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{lawyer.bio}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Reseñas</CardTitle>
                  <CardDescription>
                    Opiniones de otros clientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {canReview && (
                    <div className="pb-6 border-b">
                      <h4 className="font-medium mb-4">Deja tu reseña</h4>
                      <ReviewForm
                        lawyerId={id}
                        authorId={user!.uid}
                        authorName={profile!.displayName}
                        onSuccess={refreshReviews}
                      />
                    </div>
                  )}
                  <ReviewList reviews={reviews} />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Reservar cita</CardTitle>
                  <CardDescription>
                    Elige fecha y hora disponible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isClient && user ? (
                    lawyer.availability && lawyer.availability.length > 0 ? (
                      <BookingForm
                        lawyerId={id}
                        availability={lawyer.availability}
                        onSuccess={() => router.push("/cliente/citas")}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Este abogado no ha configurado su disponibilidad.
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                      Inicia sesión como cliente para reservar una cita.
                    </p>
                  )}
                  {!user && (
                    <Link href="/login">
                      <Button>Iniciar sesión</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
