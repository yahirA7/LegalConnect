# LegalConnect

Plataforma SaaS tipo Doctoralia para conectar clientes con abogados. Desarrollada con Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI y Firebase.

## Estructura del proyecto

```
src/
  app/              # Rutas App Router
    abogado/        # Rutas protegidas para abogados
    cliente/        # Rutas protegidas para clientes
    buscar/         # Búsqueda pública de abogados
    login/
    signup/
  components/       # Componentes modulares
    forms/
    providers/
    ui/
  lib/              # Configuración y utilidades
    firebase.ts     # Firebase Auth, Firestore, Storage
    auth.ts         # Funciones de autenticación
    types.ts        # Tipos TypeScript
  middleware.ts     # Protección de rutas por rol
```

## Configuración

1. Copia `.env.local.example` a `.env.local`
2. En [Firebase Console](https://console.firebase.google.com) crea un proyecto y obtén las credenciales
3. En Configuración del proyecto > Tus apps > Añade una app web y copia los valores a `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Añade `SESSION_SECRET` en `.env.local` (genera uno con `openssl rand -base64 32`)
5. Despliega las reglas de Firestore: `firebase deploy --only firestore:rules`

Sin credenciales válidas, la app cargará pero mostrará un aviso y las funciones de auth no funcionarán.

## Roles

- **Abogado**: Perfil público con especialidad, biografía, precio, ubicación y disponibilidad
- **Cliente**: Busca abogados, deja reseñas y reserva citas

## Desarrollo

```bash
npm install
npm run dev
```

## Seguridad

- Middleware verifica JWT firmado en cookie `session` (no manipulable sin SESSION_SECRET)
- AuthProvider valida estado real con Firebase Auth y Firestore
- Firestore Security Rules restringen acceso por `auth.uid` y rol
