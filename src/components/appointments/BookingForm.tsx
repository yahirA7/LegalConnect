"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAppointment } from "@/lib/firestore";
import type { AvailabilitySlot } from "@/lib/types";

interface BookingFormProps {
  lawyerId: string;
  availability: AvailabilitySlot[];
  onSuccess: () => void;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function BookingForm({
  lawyerId,
  availability,
  onSuccess,
}: BookingFormProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const selectedDay = date ? new Date(date).getDay() : null;
  const availableSlots = selectedDay != null
    ? availability.filter((s) => s.dayOfWeek === selectedDay)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setError("Selecciona fecha y hora");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createAppointment(lawyerId, date, time, notes || undefined);
      setDate("");
      setTime("");
      setNotes("");
      setError(null);
      setSuccess(true);
      setTimeout(() => onSuccess(), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al reservar");
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = availableSlots.flatMap((slot) => {
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    const options: string[] = [];
    for (let m = startMins; m < endMins; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      options.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    }
    return options;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Fecha</Label>
        <Input
          id="date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
        />
      </div>
      {date && (
        <div className="space-y-2">
          <Label htmlFor="time">Hora</Label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Selecciona una hora</option>
            {availableSlots.length === 0 ? (
              <option value="" disabled>
                Sin disponibilidad este día
              </option>
            ) : (
              timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))
            )}
          </select>
          {selectedDay != null && (
            <p className="text-xs text-muted-foreground">
              Horarios de {DAY_NAMES[selectedDay]}
            </p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Motivo de la consulta..."
          spellCheck={false}
          lang="es"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Toast
        message="Cita reservada correctamente"
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={2000}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Reservando..." : "Reservar cita"}
      </Button>
    </form>
  );
}
