"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Calendar, FileText, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { MainNav } from "@/components/nav/MainNav";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { Input } from "@/components/ui/input";

export default function ClienteDashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && profile?.role !== "cliente") {
      router.push("/abogado/dashboard");
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="max-w-6xl">
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-1">
              Hola, {profile?.displayName ?? "Cliente"}
            </h1>
            <p className="text-slate-600 mb-8">
              Gestiona tus citas y accede rápido a lo importante.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <section className="md:col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-slate-700" strokeWidth={1.5} />
                    <h2 className="font-semibold text-slate-900">Citas</h2>
                  </div>
                  {user ? (
                    <UpcomingAppointments uid={user.uid} asClient />
                  ) : null}
                </div>
              </section>

              <section className="md:col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-4 w-4 text-slate-700" strokeWidth={1.5} />
                    <h2 className="font-semibold text-slate-900">Búsqueda</h2>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      router.push(`/buscar?q=${encodeURIComponent(searchValue.trim())}`);
                    }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={1.5} />
                      <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Buscar por especialidad (ej. Familiar, Civil)..."
                        className="pl-10 bg-white border-slate-200"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full justify-center bg-[#0f172a] text-white hover:bg-[#0b1220]"
                    >
                      Buscar
                    </Button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link href="/cliente/citas" className="text-sm text-slate-600 hover:text-slate-900">
                      Ver todas las citas
                    </Link>
                  </div>
                </div>
              </section>

              <section className="md:col-span-1 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-semibold text-slate-900">Panel de control</h2>
                  </div>

                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-200 bg-white hover:bg-slate-50"
                    >
                      <FileText className="h-4 w-4 text-slate-700" strokeWidth={1.5} />
                      Mis Documentos
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-200 bg-white hover:bg-slate-50"
                    >
                      <LifeBuoy className="h-4 w-4 text-slate-700" strokeWidth={1.5} />
                      Soporte Técnico
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
