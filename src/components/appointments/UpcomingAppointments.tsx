"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUpcomingAppointments } from "@/lib/firestore";

interface UpcomingAppointmentsProps {
  uid: string;
  asClient: boolean;
}

export function UpcomingAppointments({ uid, asClient }: UpcomingAppointmentsProps) {
  const [appointments, setAppointments] = useState<
    { id: string; date: string; time: string; otherName: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingAppointments(uid, asClient).then(setAppointments).finally(() => setLoading(false));
  }, [uid, asClient]);

  if (loading) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  if (appointments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No tienes citas próximas.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((apt) => (
        <div
          key={apt.id}
          className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-card"
        >
          <div className="min-w-0">
            <p className="font-medium truncate">{apt.otherName}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3 shrink-0" />
              {new Date(apt.date).toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}{" "}
              <Clock className="h-3 w-3 shrink-0 ml-1" />
              {apt.time}
            </p>
          </div>
          <Link href={asClient ? "/cliente/citas" : "/abogado/citas"}>
            <Button variant="outline" size="sm">
              Ver
            </Button>
          </Link>
        </div>
      ))}
      <Link href={asClient ? "/cliente/citas" : "/abogado/citas"}>
        <Button variant="ghost" size="sm" className="w-full">
          Ver todas las citas
        </Button>
      </Link>
    </div>
  );
}
