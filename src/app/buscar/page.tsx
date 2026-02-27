"use client";

import { useState, useEffect, useCallback } from "react";
import { MainNav } from "@/components/nav/MainNav";
import { SearchBar } from "@/components/search/SearchBar";
import { LawyerCard } from "@/components/search/LawyerCard";
import { Button } from "@/components/ui/button";
import { searchLawyers } from "@/lib/firestore";
import type { Specialty } from "@/lib/types";

const PAGE_SIZE = 12;

export default function BuscarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [lawyers, setLawyers] = useState<Record<string, unknown>[]>([]);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  const doSearch = useCallback(() => {
    setLoading(true);
    setDisplayCount(PAGE_SIZE);
    searchLawyers({
      searchTerm: searchTerm || undefined,
      specialty: specialty as Specialty | undefined,
      minRating: minRating || undefined,
    })
      .then(setLawyers)
      .finally(() => setLoading(false));
  }, [searchTerm, specialty, minRating]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const displayedLawyers = lawyers.slice(0, displayCount);
  const hasMore = displayCount < lawyers.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Buscar abogados
          </h1>
          <p className="text-muted-foreground">
            Encuentra al profesional ideal para tu caso
          </p>
        </div>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          onSearch={doSearch}
        />

        <div className="mt-12 max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center gap-3 py-12 text-muted-foreground">
              <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <span>Buscando...</span>
            </div>
          ) : lawyers.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">
              No se encontraron abogados con los filtros seleccionados.
            </p>
          ) : (
            <div className="space-y-6">
              {displayedLawyers.map((l) => (
                <div key={l.uid as string} className="animate-fade-in-up">
                  <LawyerCard
                    uid={l.uid as string}
                    displayName={(l.displayName as string) ?? "Sin nombre"}
                    photoURL={l.photoURL as string | undefined}
                    specialty={l.specialty as string | undefined}
                    location={l.location as string | undefined}
                    pricePerHour={l.pricePerHour as number | undefined}
                    rating={l.rating as number | undefined}
                    reviewCount={l.reviewCount as number | undefined}
                    bio={l.bio as string | undefined}
                  />
                </div>
              ))}
              {hasMore && (
                <div className="pt-8 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                  >
                    Cargar más
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
