"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { MainNav } from "@/components/nav/MainNav";

export default function AbogadoCitasPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (!loading && profile?.role !== "abogado") router.push("/cliente/dashboard");
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Link href="/abogado/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          Volver al dashboard
        </Link>
        <h1 className="font-display text-2xl font-semibold mb-6">Mis citas</h1>
        {user && <AppointmentList uid={user.uid} asClient={false} />}
      </main>
    </div>
  );
}
