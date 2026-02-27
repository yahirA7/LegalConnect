"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, DollarSign, User } from "lucide-react";
import { formatPricePerHour } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LawyerCardProps {
  uid: string;
  displayName: string;
  photoURL?: string;
  specialty?: string;
  location?: string;
  pricePerHour?: number;
  rating?: number;
  reviewCount?: number;
  bio?: string;
}

export function LawyerCard({
  uid,
  displayName,
  photoURL,
  specialty,
  location,
  pricePerHour,
  rating,
  reviewCount,
  bio,
}: LawyerCardProps) {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
              {photoURL ? (
                <Image
                  src={photoURL}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <User className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-xl text-foreground group-hover:text-primary transition-colors duration-250">
              {displayName}
            </h3>
            {specialty && (
              <p className="text-sm text-primary font-medium mt-1 capitalize">
                {specialty}
              </p>
            )}
            <div className="flex flex-wrap gap-5 mt-3 text-sm text-muted-foreground">
              {rating != null && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-accent/80 text-accent/80" strokeWidth={1.5} />
                  <span className="font-medium text-foreground/80">{rating.toFixed(1)}</span>
                  {reviewCount != null && reviewCount > 0 && (
                    <span className="text-muted-foreground">({reviewCount})</span>
                  )}
                </span>
              )}
              {pricePerHour != null && pricePerHour > 0 && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                  {formatPricePerHour(pricePerHour)}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  {location}
                </span>
              )}
            </div>
            {bio && (
              <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {bio}
              </p>
            )}
            </div>
          </div>
          <Link href={`/abogados/${uid}`} className="shrink-0">
            <Button variant="accent" size="sm" className="min-w-[120px]">
              Ver perfil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
