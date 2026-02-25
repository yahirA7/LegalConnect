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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nombre, especialidad, ubicación..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={onSearch}>Buscar</Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Especialidad</label>
          <select
            value={specialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todas</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Rating mínimo</label>
          <select
            value={minRating}
            onChange={(e) => onMinRatingChange(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
