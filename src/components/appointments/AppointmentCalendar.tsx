"use client";

import { useMemo, useState } from "react";
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  status: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  names: Record<string, string>;
  asClient: boolean;
  updatingId: string | null;
  onStatusChange: (aptId: string, status: "confirmada" | "cancelada" | "completada") => void;
}

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function mondayIndex(day: number) {
  return (day + 6) % 7;
}

export function AppointmentCalendar({
  appointments,
  names,
  asClient,
  updatingId,
  onStatusChange,
}: AppointmentCalendarProps) {
  const todayISO = toISODate(new Date());

  const initialMonth = useMemo(() => {
    const upcoming = [...appointments]
      .filter((a) => a.status !== "cancelada")
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      })
      .find((a) => a.date >= todayISO);

    const base = upcoming ? new Date(`${upcoming.date}T00:00:00`) : new Date();
    return startOfMonth(base);
  }, [appointments, todayISO]);

  const [month, setMonth] = useState<Date>(initialMonth);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);

  const monthLabel = useMemo(() => {
    return month.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  }, [month]);

  const { days, leadingEmpty } = useMemo(() => {
    const first = startOfMonth(month);
    const leading = mondayIndex(first.getDay());
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return { days: daysInMonth, leadingEmpty: leading };
  }, [month]);

  const aptsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const a of appointments) {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [appointments]);

  const selectedApts = useMemo(() => {
    return aptsByDate[selectedDate] ?? [];
  }, [aptsByDate, selectedDate]);

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-medium capitalize truncate">{monthLabel}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMonth((m) => addMonths(m, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMonth((m) => addMonths(m, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const now = new Date();
              setMonth(startOfMonth(now));
              setSelectedDate(toISODate(now));
            }}
          >
            Hoy
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="grid grid-cols-7 bg-muted/40">
          {weekDays.map((d) => (
            <div key={d} className="px-2 py-2 text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: leadingEmpty }).map((_, idx) => (
            <div key={`e-${idx}`} className="min-h-[92px] border-t border-r last:border-r-0" />
          ))}
          {Array.from({ length: days }).map((_, idx) => {
            const day = idx + 1;
            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const iso = toISODate(date);
            const hasApts = (aptsByDate[iso]?.length ?? 0) > 0;
            const isSelected = selectedDate === iso;
            const isToday = iso === todayISO;
            return (
              <button
                type="button"
                key={iso}
                className={cn(
                  "min-h-[92px] p-2 text-left border-t border-r last:border-r-0 hover:bg-muted/30 transition-colors",
                  isSelected && "bg-muted/40",
                  isToday && "ring-1 ring-inset ring-primary/40"
                )}
                onClick={() => setSelectedDate(iso)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("text-sm", isToday && "font-semibold")}>{day}</span>
                  {hasApts ? (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {aptsByDate[iso]!.length}
                    </span>
                  ) : null}
                </div>
                {hasApts ? (
                  <div className="mt-2 space-y-1">
                    {aptsByDate[iso]!.slice(0, 2).map((a) => {
                      const otherName = asClient
                        ? names[a.lawyerId] ?? "Abogado"
                        : names[a.clientId] ?? "Cliente";
                      return (
                        <div
                          key={a.id}
                          className={cn(
                            "text-[11px] truncate",
                            a.status === "cancelada" && "text-muted-foreground line-through"
                          )}
                        >
                          {a.time} {otherName}
                        </div>
                      );
                    })}
                    {aptsByDate[iso]!.length > 2 ? (
                      <div className="text-[11px] text-muted-foreground">+{aptsByDate[iso]!.length - 2} más</div>
                    ) : null}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium">
            {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <span className="text-sm text-muted-foreground">
            {selectedApts.length} cita{selectedApts.length === 1 ? "" : "s"}
          </span>
        </div>

        {selectedApts.length === 0 ? (
          <p className="text-muted-foreground">No tienes citas este día.</p>
        ) : (
          <div className="space-y-3">
            {selectedApts.map((apt) => {
              const otherName = asClient
                ? names[apt.lawyerId] ?? "Abogado"
                : names[apt.clientId] ?? "Cliente";

              return (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {otherName}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {apt.time}
                      </p>
                      {apt.notes ? (
                        <p className="text-sm text-muted-foreground mt-1">{apt.notes}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium px-2 py-1 rounded",
                        apt.status === "confirmada" && "bg-green-100 text-green-800",
                        apt.status === "pendiente" && "bg-amber-100 text-amber-800",
                        apt.status === "completada" && "bg-muted text-muted-foreground",
                        apt.status === "cancelada" && "bg-red-100 text-red-800"
                      )}
                    >
                      {STATUS_LABELS[apt.status] ?? apt.status}
                    </span>

                    {apt.status === "pendiente" || apt.status === "confirmada" ? (
                      <div className="flex flex-wrap gap-2">
                        {!asClient && apt.status === "pendiente" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => onStatusChange(apt.id, "confirmada")}
                              disabled={updatingId === apt.id}
                            >
                              <Check className="h-3 w-3" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => onStatusChange(apt.id, "cancelada")}
                              disabled={updatingId === apt.id}
                            >
                              <X className="h-3 w-3" />
                              Cancelar
                            </Button>
                          </>
                        ) : null}

                        {!asClient && apt.status === "confirmada" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onStatusChange(apt.id, "completada")}
                            disabled={updatingId === apt.id}
                          >
                            <Check className="h-3 w-3" />
                            Marcar completada
                          </Button>
                        ) : null}

                        {asClient && (apt.status === "pendiente" || apt.status === "confirmada") ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => onStatusChange(apt.id, "cancelada")}
                            disabled={updatingId === apt.id}
                          >
                            <X className="h-3 w-3" />
                            Cancelar cita
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
