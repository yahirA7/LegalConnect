# Esquemas de datos Firestore - LegalConnect

## Colección: `users`

Documento por usuario autenticado. El `documentId` coincide con `auth.uid`.

```typescript
{
  uid: string;
  email: string;
  displayName: string;
  role: "abogado" | "cliente";
  photoURL: string | null;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601

  // Solo si role === "abogado"
  specialty?: string;
  specialties?: string[];
  bio?: string;
  pricePerHour?: number;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  availability?: Array<{
    dayOfWeek: number;  // 0-6 (domingo-sábado)
    startTime: string;  // "09:00"
    endTime: string;   // "18:00"
  }>;
  rating?: number;
  reviewCount?: number;

  // Solo si role === "cliente"
  phone?: string;
}
```

**Reglas de seguridad:**
- Lectura: propietario (`auth.uid == userId`) O perfil público (role === "abogado")
- Escritura: solo propietario

---

## Colección: `appointments`

Citas entre clientes y abogados.

```typescript
{
  id: string;
  clientId: string;   // uid del cliente
  lawyerId: string;   // uid del abogado
  status: "pendiente" | "confirmada" | "completada" | "cancelada";
  date: string;       // "2025-02-24"
  time: string;       // "10:00"
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Reglas de seguridad:**
- Lectura: solo `clientId` o `lawyerId` de la cita
- Creación: solo cliente autenticado, y `clientId` debe ser `auth.uid`
- Actualización/eliminación: solo `clientId` o `lawyerId`

---

## Colección: `booked_slots`

Controla la disponibilidad de horarios sin exponer datos de otras citas. Usada para que los clientes puedan comprobar disponibilidad al reservar.

```typescript
// Document ID: {lawyerId}_{date}_{time}
{
  lawyerId: string;
  date: string;   // "2025-02-24"
  time: string;  // "10:00"
  createdAt: string;
}
```

**Reglas de seguridad:**
- Lectura/creación/eliminación: cualquier usuario autenticado

---

## Colección: `reviews`

Reseñas de clientes sobre abogados.

```typescript
{
  id: string;
  lawyerId: string;
  authorId: string;   // uid del autor (cliente)
  authorName: string;
  rating: number;     // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}
```

**Reglas de seguridad:**
- Lectura: pública
- Creación: autenticado y `authorId == auth.uid`
- Actualización/eliminación: solo `authorId == auth.uid`
