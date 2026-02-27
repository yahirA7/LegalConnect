import Link from "next/link";
import { Search, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/nav/MainNav";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-transparent to-transparent" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="container relative mx-auto px-4 py-28 md:py-40 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto text-foreground leading-[1.1]">
              Conecta con abogados de confianza
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Busca por especialidad, compara perfiles y reserva tu cita de forma sencilla.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buscar">
                <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                  <Search className="h-5 w-5" strokeWidth={1.5} />
                  Buscar abogados
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[200px]">
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-36 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-16 text-foreground">
              Cómo funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
              <div className="group text-center p-8 md:p-10 rounded-2xl bg-card/80 border border-border/50 shadow-card hover:shadow-card-hover hover:border-border/70 transition-all duration-350">
                <div className="inline-flex p-5 rounded-2xl bg-primary/8 mb-6 group-hover:bg-primary/12 transition-colors duration-300">
                  <Search className="h-9 w-9 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">Busca y filtra</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Encuentra abogados por especialidad, ubicación y valoración.
                </p>
              </div>
              <div className="group text-center p-8 md:p-10 rounded-2xl bg-card/80 border border-border/50 shadow-card hover:shadow-card-hover hover:border-border/70 transition-all duration-350">
                <div className="inline-flex p-5 rounded-2xl bg-primary/8 mb-6 group-hover:bg-primary/12 transition-colors duration-300">
                  <Shield className="h-9 w-9 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">Revisa perfiles</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Lee biografías, especialidades y reseñas de otros clientes.
                </p>
              </div>
              <div className="group text-center p-8 md:p-10 rounded-2xl bg-card/80 border border-border/50 shadow-card hover:shadow-card-hover hover:border-border/70 transition-all duration-350">
                <div className="inline-flex p-5 rounded-2xl bg-primary/8 mb-6 group-hover:bg-primary/12 transition-colors duration-300">
                  <Calendar className="h-9 w-9 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">Reserva tu cita</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Elige horario disponible y confirma tu consulta al instante.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          LegalConnect — Plataforma de conexión con profesionales del derecho
        </div>
      </footer>
    </div>
  );
}
