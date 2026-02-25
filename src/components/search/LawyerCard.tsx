"use client";

import Link from "next/link";
import { MapPin, Star, DollarSign } from "lucide-react";
import { formatPricePerHour } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LawyerCardProps {
  uid: string;
  displayName: string;
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
  specialty,
  location,
  pricePerHour,
  rating,
  reviewCount,
  bio,
}: LawyerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg">{displayName}</h3>
            {specialty && (
              <p className="text-sm text-primary font-medium mt-0.5 capitalize">
                {specialty}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              {rating != null && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {rating.toFixed(1)}
                  {reviewCount != null && reviewCount > 0 && (
                    <span>({reviewCount})</span>
                  )}
                </span>
              )}
              {pricePerHour != null && pricePerHour > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {formatPricePerHour(pricePerHour)}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              )}
            </div>
            {bio && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {bio}
              </p>
            )}
          </div>
          <Link href={`/abogados/${uid}`}>
            <Button variant="outline" size="sm">
              Ver perfil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
