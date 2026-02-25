"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Check, X } from "lucide-react";
import { getAppointmentsByUser, getDisplayNames, updateAppointmentStatus } from "@/lib/firestore";
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

interface AppointmentListProps {
  uid: string;
  asClient: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};

function fetchData(uid: string, asClient: boolean) {
  return getAppointmentsByUser(uid, asClient).then(async (data) => {
    const apts = data as Appointment[];
    const ids = apts.map((a) => (asClient ? a.lawyerId : a.clientId));
    const nameMap = await getDisplayNames(ids);
    return { apts, nameMap };
  });
}

export function AppointmentList({ uid, asClient }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const refresh = () => {
    fetchData(uid, asClient).then(({ apts, nameMap }) => {
      setAppointments(apts);
      setNames(nameMap);
    });
  };

  useEffect(() => {
    fetchData(uid, asClient).then(({ apts, nameMap }) => {
      setAppointments(apts);
      setNames(nameMap);
      setLoading(false);
    });
  }, [uid, asClient]);

  const handleStatusChange = async (
    aptId: string,
    status: "confirmada" | "cancelada" | "completada"
  ) => {
    setUpdatingId(aptId);
    try {
      await updateAppointmentStatus(aptId, status);
      refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Cargando citas...</p>;
  }

  if (appointments.length === 0) {
    return (
      <p className="text-muted-foreground">
        No tienes citas {asClient ? "reservadas" : "programadas"}.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((apt) => {
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
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {otherName}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  {new Date(apt.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  a las {apt.time}
                </p>
                {apt.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{apt.notes}</p>
                )}
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
              {(apt.status === "pendiente" || apt.status === "confirmada") ? (
                <div className="flex flex-wrap gap-2">
                  {!asClient && apt.status === "pendiente" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleStatusChange(apt.id, "confirmada")}
                        disabled={updatingId === apt.id}
                      >
                        <Check className="h-3 w-3" />
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleStatusChange(apt.id, "cancelada")}
                        disabled={updatingId === apt.id}
                      >
                        <X className="h-3 w-3" />
                        Cancelar
                      </Button>
                    </>
                  )}
                  {!asClient && apt.status === "confirmada" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(apt.id, "completada")}
                      disabled={updatingId === apt.id}
                    >
                      <Check className="h-3 w-3" />
                      Marcar completada
                    </Button>
                  )}
                  {asClient && (apt.status === "pendiente" || apt.status === "confirmada") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleStatusChange(apt.id, "cancelada")}
                      disabled={updatingId === apt.id}
                    >
                      <X className="h-3 w-3" />
                      Cancelar cita
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
