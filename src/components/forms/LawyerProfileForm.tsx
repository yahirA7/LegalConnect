"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateLawyerProfile, getLawyerProfile } from "@/lib/firestore";
import { uploadProfilePhoto } from "@/lib/storage";
import { SPECIALTIES, type AvailabilitySlot } from "@/lib/types";

const DAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

export function LawyerProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    photoURL: "" as string,
    specialty: "",
    bio: "",
    pricePerHour: "",
    location: "",
    city: "",
    country: "",
    availability: [] as AvailabilitySlot[],
  });

  useEffect(() => {
    if (!user) return;
    getLawyerProfile(user.uid).then((profile) => {
      if (profile) {
        setFormData((prev) => ({
          ...prev,
          photoURL: profile.photoURL ?? "",
          specialty: profile.specialty ?? "",
          bio: profile.bio ?? "",
          pricePerHour: String(profile.pricePerHour ?? ""),
          location: profile.location ?? "",
          city: profile.city ?? "",
          country: profile.country ?? "",
          availability: profile.availability ?? [],
        }));
      }
      setLoading(false);
    });
  }, [user]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    e.target.value = "";
    setPhotoError(null);
    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhoto(user.uid, file);
      await updateLawyerProfile(user.uid, { photoURL: url });
      setFormData((p) => ({ ...p, photoURL: url }));
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Error al subir la foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addSlot = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
      ],
    }));
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: string | number) => {
    setFormData((prev) => {
      const next = [...prev.availability];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, availability: next };
    });
  };

  const removeSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSaving(true);

    try {
      await updateLawyerProfile(user.uid, {
        specialty: formData.specialty,
        bio: formData.bio,
        pricePerHour: formData.pricePerHour ? Number(formData.pricePerHour) : 0,
        location: formData.location,
        city: formData.city || undefined,
        country: formData.country || undefined,
        availability: formData.availability,
      });
      router.push("/abogado/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
          <CardDescription>
            Imagen visible en tu perfil público (JPG, PNG o WebP, máx. 2 MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center shrink-0">
              {formData.photoURL ? (
                <Image
                  src={formData.photoURL}
                  alt="Foto de perfil"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <Camera className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>
            {uploadingPhoto && (
              <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" strokeWidth={2} />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
            >
              {formData.photoURL ? "Cambiar foto" : "Subir foto"}
            </Button>
            {photoError && <p className="text-sm text-destructive">{photoError}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información profesional</CardTitle>
          <CardDescription>
            Datos visibles en tu perfil público
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidad principal</Label>
            <select
              id="specialty"
              value={formData.specialty}
              onChange={(e) => setFormData((p) => ({ ...p, specialty: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecciona una especialidad</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              placeholder="Describe tu experiencia y enfoque profesional..."
              spellCheck={false}
              lang="es"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerHour">Precio por hora (MXN)</Label>
              <Input
                id="pricePerHour"
                type="number"
                min={0}
                step={5}
                placeholder="500"
                value={formData.pricePerHour}
                onChange={(e) => setFormData((p) => ({ ...p, pricePerHour: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación / Dirección</Label>
              <Input
                id="location"
                type="text"
                placeholder="Calle Principal 123"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                type="text"
                placeholder="Madrid"
                value={formData.city}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                type="text"
                placeholder="España"
                value={formData.country}
                onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disponibilidad horaria</CardTitle>
          <CardDescription>
            Días y franjas en las que aceptas citas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.availability.map((slot, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 p-3 rounded-lg border">
              <select
                value={slot.dayOfWeek}
                onChange={(e) => updateSlot(i, "dayOfWeek", Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm w-32"
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateSlot(i, "startTime", e.target.value)}
                className="w-28"
              />
              <span className="text-muted-foreground">a</span>
              <Input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateSlot(i, "endTime", e.target.value)}
                className="w-28"
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeSlot(i)}>
                Eliminar
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addSlot}>
            Añadir horario
          </Button>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar perfil"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
