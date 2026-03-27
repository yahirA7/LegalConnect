"use client";

import { useState, useEffect } from "react";
import { getAppointmentsByUser, getDisplayNames, updateAppointmentStatus } from "@/lib/firestore";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";

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

function fetchData(uid: string, asClient: boolean) {
  return getAppointmentsByUser(uid, asClient).then(async (data) => {
    const apts = data as unknown as Appointment[];
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
    <AppointmentCalendar
      appointments={appointments}
      names={names}
      asClient={asClient}
      updatingId={updatingId}
      onStatusChange={handleStatusChange}
    />
  );
}
