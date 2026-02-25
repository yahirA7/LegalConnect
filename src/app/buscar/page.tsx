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
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-6">Buscar abogados</h1>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          onSearch={doSearch}
        />

        <div className="mt-8">
          {loading ? (
            <p className="text-muted-foreground">Buscando...</p>
          ) : lawyers.length === 0 ? (
            <p className="text-muted-foreground">
              No se encontraron abogados con los filtros seleccionados.
            </p>
          ) : (
            <div className="space-y-4">
              {displayedLawyers.map((l) => (
                <LawyerCard
                  key={l.uid as string}
                  uid={l.uid as string}
                  displayName={(l.displayName as string) ?? "Sin nombre"}
                  specialty={l.specialty as string | undefined}
                  location={l.location as string | undefined}
                  pricePerHour={l.pricePerHour as number | undefined}
                  rating={l.rating as number | undefined}
                  reviewCount={l.reviewCount as number | undefined}
                  bio={l.bio as string | undefined}
                />
              ))}
              {hasMore && (
                <div className="pt-4 flex justify-center">
                  <Button
                    variant="outline"
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
