"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { MainNav } from "@/components/nav/MainNav";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";

export default function AbogadoDashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && profile?.role !== "abogado") {
      router.push("/cliente/dashboard");
    }
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
        <h1 className="font-display text-2xl font-semibold mb-2">
          Hola, {profile?.displayName ?? "Abogado"}
        </h1>
        <p className="text-muted-foreground mb-8">
          Panel de control para abogados. Gestiona tu perfil y citas.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          <div>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próximas citas
            </h2>
            {user && <UpcomingAppointments uid={user.uid} asClient={false} />}
          </div>
          <div>
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Acciones rápidas
            </h2>
            <div className="space-y-2">
              <Link href="/abogado/perfil">
                <Button variant="outline" className="w-full justify-start">
                  Editar perfil
                </Button>
              </Link>
              <Link href="/abogado/citas">
                <Button variant="outline" className="w-full justify-start">
                  Ver todas las citas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
