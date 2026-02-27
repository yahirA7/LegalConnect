"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, resetPassword } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function getLoginErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("auth/unauthorized-domain") || msg.includes("unauthorized domain")) {
    return "Dominio no autorizado. Añade localhost en Firebase Console → Authentication → Authorized domains.";
  }
  if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
    return "Correo o contraseña incorrectos.";
  }
  if (msg.includes("auth/too-many-requests")) {
    return "Demasiados intentos. Espera unos minutos.";
  }
  if (msg.includes("Firebase") || msg.includes("permission")) {
    return "Error de Firebase. Comprueba que localhost esté en Authorized domains y que las reglas de Firestore estén desplegadas.";
  }
  return msg || "Error al iniciar sesión.";
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user } = await signIn(formData.email, formData.password);
      if (!db) throw new Error("Firebase no configurado. Revisa .env.local");

      let userRole: "abogado" | "cliente" = "cliente";
      try {
        const profileSnap = await getDoc(doc(db, "users", user.uid));
        const role = profileSnap.data()?.role as "abogado" | "cliente" | undefined;
        if (role === "abogado" || role === "cliente") userRole = role;
      } catch {
        // Si Firestore falla (permisos, etc.), continuar con rol cliente
      }

      const destination =
        redirect && redirect !== "/"
          ? redirect
          : userRole === "abogado"
            ? "/abogado/dashboard"
            : "/cliente/dashboard";

      // Form POST + redirect 302: las cookies se establecen en la misma respuesta
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/session";
      [
        ["uid", user.uid],
        ["role", userRole],
        ["redirect", destination],
      ].forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err: unknown) {
      const message = getLoginErrorMessage(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail);
      setForgotSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el correo");
    } finally {
      setForgotLoading(false);
    }
  };

  if (forgotMode) {
    return (
      <Card className="w-full shadow-elevated border-border/60">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="font-display text-2xl">Recuperar contraseña</CardTitle>
          <CardDescription className="text-base">
            Introduce tu correo y te enviaremos un enlace para restablecerla
          </CardDescription>
        </CardHeader>
        {forgotSuccess ? (
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Revisa tu correo. Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Button variant="outline" className="w-full" onClick={() => { setForgotMode(false); setForgotSuccess(false); }}>
              Volver al inicio de sesión
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Correo electrónico</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-8">
              <Button type="submit" className="w-full" disabled={forgotLoading}>
                {forgotLoading ? "Enviando..." : "Enviar enlace"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => { setForgotMode(false); setError(null); }}>
                Volver al inicio de sesión
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-elevated border-border/60">
      <CardHeader className="space-y-2 text-center pb-8">
        <CardTitle className="font-display text-2xl">Iniciar sesión</CardTitle>
        <CardDescription className="text-base">
          Accede a tu cuenta de LegalConnect
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <p className="text-sm">
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="text-primary hover:underline font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-5 pt-8">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            ¿No tienes cuenta?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
