# Configurar Firebase para LegalConnect

## Paso 1: Crear proyecto en Firebase

1. Abre [Firebase Console](https://console.firebase.google.com)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **Crear un proyecto** (o selecciona uno existente)
4. Nombre del proyecto: `legalconnect` (o el que prefieras)
5. Desactiva Google Analytics si no lo necesitas
6. Haz clic en **Crear proyecto**

## Paso 2: Registrar la app web

1. En el panel del proyecto, haz clic en el icono **</>** (Web)
2. Nombre de la app: `LegalConnect`
3. No marques Firebase Hosting por ahora
4. Haz clic en **Registrar app**
5. Copia el objeto `firebaseConfig` que aparece

## Paso 3: Rellenar .env.local

Abre el archivo `.env.local` en la raíz del proyecto y pega cada valor:

| Variable en .env.local | Dónde encontrarla en firebaseConfig |
|-----------------------|-------------------------------------|
| NEXT_PUBLIC_FIREBASE_API_KEY | `apiKey` |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | `authDomain` |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | `projectId` |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | `storageBucket` |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | `messagingSenderId` |
| NEXT_PUBLIC_FIREBASE_APP_ID | `appId` |

Ejemplo del objeto que verás:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "legalconnect-xxx.firebaseapp.com",
  projectId: "legalconnect-xxx",
  storageBucket: "legalconnect-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Paso 4: Activar Authentication

1. En el menú lateral: **Compilación** > **Authentication**
2. Haz clic en **Comenzar**
3. En **Proveedores de acceso**, haz clic en **Correo electrónico/contraseña**
4. Activa **Correo electrónico/contraseña**
5. Guarda

## Paso 5: Crear Firestore

1. En el menú lateral: **Compilación** > **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Elige **Modo de prueba** (para desarrollo) o **Modo de producción**
4. Selecciona la ubicación más cercana
5. Haz clic en **Habilitar**

## Paso 6: Desplegar reglas de seguridad

En la terminal, desde la carpeta del proyecto:

```bash
firebase login
firebase init firestore
# Selecciona tu proyecto y usa firestore.rules existente
firebase deploy --only firestore:rules
```

## Paso 7: Reiniciar el servidor

```bash
npm run dev
```

El aviso amarillo debería desaparecer y podrás registrarte e iniciar sesión.
