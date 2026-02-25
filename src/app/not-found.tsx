import Link from "next/link";
import { Scale, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 font-display font-semibold">
        <Scale className="h-5 w-5" />
        LegalConnect
      </Link>
      <h1 className="font-display text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground text-center">
        Página no encontrada
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4" />
            Inicio
          </Button>
        </Link>
        <Link href="/buscar">
          <Button>
            <Search className="h-4 w-4" />
            Buscar abogados
          </Button>
        </Link>
      </div>
    </div>
  );
}
