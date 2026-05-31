"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Search, Calendar, User, LogOut, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useUnreadChats } from "@/hooks/useUnreadChats";

interface MainNavProps {
  showSearch?: boolean;
}

export function MainNav({ showSearch = true }: MainNavProps) {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadChats = useUnreadChats(user?.uid, profile?.role);

  const handleSignOut = async () => {
    setMobileOpen(false);
    await signOut();
    window.location.href = "/";
  };

  const navLinks = user && profile
    ? profile.role === "abogado"
      ? [
          { href: "/buscar", label: "Buscar", icon: Search },
          { href: "/abogado/dashboard", label: "Inicio", icon: User },
          { href: "/abogado/citas", label: "Citas", icon: Calendar },
          { href: "/chat", label: "Mensajes", icon: MessageSquare },
        ]
      : [
          { href: "/buscar", label: "Buscar", icon: Search },
          { href: "/cliente/dashboard", label: "Inicio", icon: User },
          { href: "/cliente/citas", label: "Mis citas", icon: Calendar },
          { href: "/chat", label: "Mensajes", icon: MessageSquare },
        ]
    : showSearch
      ? [{ href: "/buscar", label: "Buscar", icon: Search }]
      : [];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-md">
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
              <div className="hidden lg:flex items-center gap-3 px-2">
                <ProfileAvatar
                  src={profile.photoURL}
                  alt={profile.displayName ?? "Usuario"}
                  size="sm"
                />
                <span className="text-sm text-foreground/90 max-w-[160px] truncate">
                  {profile.displayName ?? "Usuario"}
                </span>
              </div>
              {navLinks.slice(1).map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="gap-2 relative">
                    <link.icon className="h-4 w-4" strokeWidth={1.5} />
                    {link.label}
                    {link.href === "/chat" && unreadChats > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadChats > 9 ? "9+" : unreadChats}
                      </span>
                    )}
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
                <Button size="sm" className="shadow-soft hover:shadow-elevated">Registrarse</Button>
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
                    Inicio
                  </Link>
                  <Link
                    href="/abogado/citas"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <Calendar className="h-4 w-4" strokeWidth={1.5} />
                    Citas
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <span className="relative">
                      <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                      {unreadChats > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {unreadChats > 9 ? "9+" : unreadChats}
                        </span>
                      )}
                    </span>
                    Mensajes
                    {unreadChats > 0 && (
                      <span className="ml-auto text-xs font-bold text-red-500">{unreadChats}</span>
                    )}
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
                    Inicio
                  </Link>
                  <Link
                    href="/cliente/citas"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <Calendar className="h-4 w-4" strokeWidth={1.5} />
                    Mis citas
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl hover:bg-secondary/60 transition-all duration-250"
                  >
                    <span className="relative">
                      <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                      {unreadChats > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {unreadChats > 9 ? "9+" : unreadChats}
                        </span>
                      )}
                    </span>
                    Mensajes
                    {unreadChats > 0 && (
                      <span className="ml-auto text-xs font-bold text-red-500">{unreadChats}</span>
                    )}
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
