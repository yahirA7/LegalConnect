"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { signIn, setAuthSession, resetPassword } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function LoginForm() {
  const router = useRouter();
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
      if (!db) throw new Error("Firebase no configurado");
      const profileSnap = await getDoc(doc(db, "users", user.uid));
      const role = profileSnap.data()?.role as "abogado" | "cliente" | undefined;

      await setAuthSession(user.uid, role ?? "cliente");

      const destination =
        redirect && redirect !== "/"
          ? redirect
          : role === "abogado"
            ? "/abogado/dashboard"
            : "/cliente/dashboard";

      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-display text-2xl">Recuperar contraseña</CardTitle>
          <CardDescription>
            Introduce tu correo y te enviaremos un enlace para restablecerla
          </CardDescription>
        </CardHeader>
        {forgotSuccess ? (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Revisa tu correo. Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Button variant="outline" className="w-full" onClick={() => { setForgotMode(false); setForgotSuccess(false); }}>
              Volver al inicio de sesión
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <CardContent className="space-y-4">
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
            <CardFooter className="flex flex-col gap-4">
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-display text-2xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Accede a tu cuenta de LegalConnect
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
              className="text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            ¿No tienes cuenta?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
