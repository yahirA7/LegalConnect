"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Search, Calendar, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface MainNavProps {
  showSearch?: boolean;
}

export function MainNav({ showSearch = true }: MainNavProps) {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    setMobileOpen(false);
    await signOut();
    window.location.href = "/";
  };

  const navLinks = user && profile
    ? profile.role === "abogado"
      ? [
          { href: "/buscar", label: "Buscar", icon: Search },
          { href: "/abogado/dashboard", label: "Dashboard", icon: User },
          { href: "/abogado/citas", label: "Citas", icon: Calendar },
        ]
      : [
          { href: "/buscar", label: "Buscar", icon: Search },
          { href: "/cliente/dashboard", label: "Dashboard", icon: User },
          { href: "/cliente/citas", label: "Mis citas", icon: Calendar },
        ]
    : showSearch
      ? [{ href: "/buscar", label: "Buscar", icon: Search }]
      : [];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40 shadow-soft">
      <div className="container mx-auto px-4 h-16 md:h-[4.5rem] flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-semibold text-xl text-foreground shrink-0 transition-opacity hover:opacity-90"
        >
          <Scale className="h-6 w-6 text-primary" strokeWidth={1.5} />
          LegalConnect
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {showSearch && (
            <Link
              href="/buscar"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-250"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
              Buscar
            </Link>
          )}
          {user && profile ? (
            <>
              {navLinks.slice(1).map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <link.icon className="h-4 w-4" strokeWidth={1.5} />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="ml-2 gap-2"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Iniciar sesión</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Registrarse</Button>
              </Link>
            </>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-border/40 bg-card/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ease-out",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
          {showSearch && (
            <Link
              href="/buscar"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
              Buscar abogados
            </Link>
          )}
          {user && profile ? (
            <>
              {profile.role === "abogado" ? (
                <>
                  <Link
                    href="/abogado/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                    Dashboard
                  </Link>
                  <Link
                    href="/abogado/citas"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <Calendar className="h-4 w-4" strokeWidth={1.5} />
                    Citas
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/cliente/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                    Dashboard
                  </Link>
                  <Link
                    href="/cliente/citas"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <Calendar className="h-4 w-4" strokeWidth={1.5} />
                    Mis citas
                  </Link>
                </>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250 text-left w-full"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250 font-medium"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
