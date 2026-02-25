import Link from "next/link";
import { Search, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/nav/MainNav";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Conecta con abogados de confianza
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Busca por especialidad, compara perfiles y reserva tu cita de forma sencilla.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/buscar">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="h-4 w-4" />
                Buscar abogados
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Crear cuenta
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-semibold text-center mb-12">
              Cómo funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Busca y filtra</h3>
                <p className="text-sm text-muted-foreground">
                  Encuentra abogados por especialidad, ubicación y valoración.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Revisa perfiles</h3>
                <p className="text-sm text-muted-foreground">
                  Lee biografías, especialidades y reseñas de otros clientes.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Reserva tu cita</h3>
                <p className="text-sm text-muted-foreground">
                  Elige horario disponible y confirma tu consulta al instante.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          LegalConnect - Plataforma de conexión con profesionales del derecho
        </div>
      </footer>
    </div>
  );
}
