"use client";

import React from "react";
import { Clock } from "lucide-react";
import type { AvailabilitySlot } from "@/lib/types";

interface AvailabilityDisplayProps {
  availability: AvailabilitySlot[];
}

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export function AvailabilityDisplay({ availability }: AvailabilityDisplayProps) {
  if (!availability || availability.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay horarios configurados
      </p>
    );
  }

  const groupedByDay = availability.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<number, AvailabilitySlot[]>);

  const sortedDays = Object.keys(groupedByDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-3">
      {sortedDays.map((dayOfWeek) => (
        <div key={dayOfWeek} className="flex items-start gap-3">
          <div className="min-w-[100px] font-medium text-sm">
            {DAY_NAMES[dayOfWeek]}
          </div>
          <div className="flex-1 space-y-1">
            {groupedByDay[dayOfWeek].map((slot, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
