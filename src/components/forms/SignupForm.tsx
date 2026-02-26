"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Briefcase } from "lucide-react";
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
import { signUp } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

function getSignupErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("auth/unauthorized-domain") || msg.includes("unauthorized domain")) {
    return "Dominio no autorizado. Añade localhost en Firebase Console → Authentication → Authorized domains.";
  }
  if (msg.includes("auth/email-already-in-use")) return "Este correo ya está registrado.";
  if (msg.includes("auth/weak-password")) return "La contraseña es demasiado débil.";
  if (msg.includes("auth/invalid-email")) return "Correo electrónico no válido.";
  if (msg.includes("Firebase") || msg.includes("permission")) {
    return "Error de Firebase. Comprueba que localhost esté en Authorized domains.";
  }
  return msg || "Error al crear la cuenta.";
}

export function SignupForm() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError("Selecciona un tipo de cuenta");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setError("La contraseña debe incluir mayúsculas, minúsculas y números");
      return;
    }

    setLoading(true);

    try {
      const { user } = await signUp(
        formData.email,
        formData.password,
        formData.displayName,
        role
      );
      const redirectUrl = role === "abogado" ? "/abogado/perfil" : "/cliente/dashboard";
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/session";
      [
        ["uid", user.uid],
        ["role", role],
        ["redirect", redirectUrl],
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
      setError(getSignupErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-display text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Regístrate como abogado o cliente para comenzar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de cuenta</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("abogado")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  role === "abogado"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <Briefcase className="h-5 w-5" />
                <span className="font-medium">Abogado</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("cliente")}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  role === "cliente"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Cliente</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre completo</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Juan Pérez"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, displayName: e.target.value }))
              }
              required
            />
          </div>

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
              placeholder="Mín. 8 caracteres, mayúsculas, minúsculas y números"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
