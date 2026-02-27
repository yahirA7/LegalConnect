import Link from "next/link";
import { Scale, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2.5 font-display font-semibold text-lg text-foreground hover:opacity-90 transition-opacity z-10"
      >
        <Scale className="h-6 w-6 text-primary" strokeWidth={1.5} />
        LegalConnect
      </Link>
      <div className="relative z-10 text-center">
        <h1 className="font-display text-7xl md:text-8xl font-bold text-muted-foreground/60">404</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Página no encontrada
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <Home className="h-4 w-4" strokeWidth={1.5} />
              Inicio
            </Button>
          </Link>
          <Link href="/buscar">
            <Button size="lg" className="gap-2">
              <Search className="h-4 w-4" strokeWidth={1.5} />
              Buscar abogados
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
