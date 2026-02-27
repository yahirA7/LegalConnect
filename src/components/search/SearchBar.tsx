"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SPECIALTIES } from "@/lib/types";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  specialty: string;
  onSpecialtyChange: (v: string) => void;
  minRating: number;
  onMinRatingChange: (v: number) => void;
  onSearch: () => void;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  specialty,
  onSpecialtyChange,
  minRating,
  onMinRatingChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-card/80 border border-border/50 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            placeholder="Nombre, especialidad, ubicación..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="pl-11 h-12"
          />
        </div>
        <Button onClick={onSearch} size="lg" className="min-w-[140px]">
          <Search className="h-4 w-4" strokeWidth={1.5} />
          Buscar
        </Button>
      </div>
      <div className="flex flex-wrap gap-6 items-center pt-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground/90">Especialidad</label>
          <select
            value={specialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="h-10 rounded-xl border border-border/80 bg-background/80 px-4 text-sm transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 hover:border-border"
          >
            <option value="">Todas</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground/90">Rating mínimo</label>
          <select
            value={minRating}
            onChange={(e) => onMinRatingChange(Number(e.target.value))}
            className="h-10 rounded-xl border border-border/80 bg-background/80 px-4 text-sm transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2 hover:border-border"
          >
            <option value={0}>Cualquiera</option>
            <option value={4}>4+ estrellas</option>
            <option value={3}>3+ estrellas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
