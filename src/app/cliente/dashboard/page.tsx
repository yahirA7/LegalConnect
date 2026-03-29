"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { MainNav } from "@/components/nav/MainNav";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { getTopRatedLawyers } from "@/lib/firestore";

export default function ClienteDashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [featured, setFeatured] = useState<
    { uid: string; displayName?: string; photoURL?: string | null; rating?: number; reviewCount?: number }[]
  >([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && profile?.role !== "cliente") {
      router.push("/abogado/dashboard");
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    getTopRatedLawyers(4)
      .then((rows) => setFeatured(rows as any))
      .finally(() => setFeaturedLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="relative flex-1">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-muted/20" />
          <div className="absolute inset-0 opacity-[0.06]">
            <svg
              aria-hidden="true"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="lc-justice-pattern" width="240" height="240" patternUnits="userSpaceOnUse">
                  <g fill="none" stroke="rgba(2, 6, 23, 0.9)" strokeWidth="1">
                    <path d="M120 38v92" />
                    <path d="M70 66h100" />
                    <path d="M70 66l-34 54" />
                    <path d="M170 66l34 54" />
                    <path d="M26 128c20 18 54 18 74 0" />
                    <path d="M140 128c20 18 54 18 74 0" />
                    <path d="M106 38c10-10 18-14 28-14s18 4 28 14" />
                    <path d="M18 196c52-30 152-30 204 0" strokeDasharray="4 6" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lc-justice-pattern)" />
            </svg>
          </div>
        </div>

        <div className="container relative mx-auto px-4 py-12">
          <div className="max-w-6xl">
            <h1 className="font-display text-2xl md:text-3xl font-semibold mb-2">
              Hola, {profile?.displayName ?? "Cliente"}
            </h1>
            <p className="text-muted-foreground mb-8">
              Busca abogados por especialidad y reserva tu cita.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="p-6 md:p-8">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    Próximas citas
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 md:px-8 md:pb-8">
                  {user && <UpcomingAppointments uid={user.uid} asClient />}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-6 md:p-8">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    Acciones rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 md:px-8 md:pb-8">
                  <div className="grid gap-3">
                    <Link href="/buscar">
                      <Button
                        size="lg"
                        className="w-full justify-start rounded-2xl h-14 px-6"
                      >
                        <Search className="h-5 w-5" strokeWidth={1.5} />
                        Buscar abogados
                      </Button>
                    </Link>
                    <Link href="/cliente/citas">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full justify-start rounded-2xl h-14 px-6 border-primary/30 text-primary hover:text-primary"
                      >
                        Ver todas las citas
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl md:text-2xl font-semibold">
                  Abogados destacados
                </h2>
                <Link href="/buscar" className="text-sm text-primary hover:underline">
                  Ver más
                </Link>
              </div>

              {featuredLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="h-14 rounded-xl bg-muted/40" />
                        <div className="mt-4 h-10 rounded-xl bg-muted/30" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : featured.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-sm text-muted-foreground">
                    Aún no hay abogados con calificación para mostrar.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featured.map((l) => (
                    <Link key={l.uid} href={`/abogados/${l.uid}`} className="block">
                      <Card className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <ProfileAvatar
                              src={l.photoURL}
                              alt={l.displayName ?? "Abogado"}
                              size="md"
                            />
                            <div className="min-w-0">
                              <p className="font-medium truncate">{l.displayName ?? "Abogado"}</p>
                              <div className="mt-1 flex items-center gap-1.5 text-sm">
                                <Star className="h-4 w-4 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" strokeWidth={1.5} />
                                <span className="text-muted-foreground">
                                  {(l.rating ?? 0).toFixed(1)}
                                  {l.reviewCount != null && l.reviewCount > 0 ? ` (${l.reviewCount})` : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 h-10 rounded-xl bg-muted/20 border border-border/60" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
