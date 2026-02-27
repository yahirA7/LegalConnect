# Checklist: ¿Por qué no funciona la app?

Tu configuración (.env.local) está correcta. Revisa estos puntos en orden:

---

## 1. ¿Qué URL usas?

- Si el servidor dice **"using port 3001"** → usa **http://localhost:3001**
- Si dice **"Local: http://localhost:3000"** → usa **http://localhost:3000**
- **No uses** la IP de red (ej: http://192.168.x.x:3000) — las cookies no funcionan bien

---

## 2. Firebase: localhost autorizado

Firebase Auth **bloquea** dominios que no estén en la lista. Si no está localhost, login/registro falla.

**Pasos:**
1. [Firebase Console](https://console.firebase.google.com) → proyecto **legalconnect-4e027**
2. **Authentication** → **Settings** (engranaje) → **Authorized domains**
3. Comprueba que esté **localhost**
4. Si no está → **Add domain** → escribe `localhost` → **Add**

---

## 3. Firestore: reglas desplegadas

Si ves "Missing or insufficient permissions", las reglas no están publicadas.

**Pasos:**
```powershell
firebase login
firebase deploy --only firestore:rules
```

O en Firebase Console → **Firestore** → **Rules** → **Publish**

---

## 3b. Storage: habilitado y reglas desplegadas (fotos de perfil)

Si las fotos de perfil no se muestran o quedan cargando:

1. **Habilita Storage** en Firebase Console → **Storage** → **Get started** (si no lo has hecho)
2. **Despliega las reglas**:

**Pasos:**
```powershell
firebase deploy --only storage
```

O en Firebase Console → **Storage** → **Rules** → **Publish**

**Opcional - CORS** (si las imágenes siguen sin cargar): configura CORS en tu bucket:
```powershell
gsutil cors set storage.cors.json gs://TU-PROYECTO.appspot.com
```
(Reemplaza TU-PROYECTO con el ID de tu proyecto Firebase)

---

## 4. Navegador: caché limpia

Cookies o caché antiguos pueden dar problemas.

**Pasos:**
- **F12** → pestaña **Application** → **Storage** → **Clear site data**
- O prueba en **ventana de incógnito** (Ctrl+Shift+N)

---

## 5. Un solo servidor

Si hay varios `npm run dev` abiertos, pueden chocar.

**Pasos:**
- Cierra todas las terminales con el servidor
- En PowerShell: `Get-Process -Name "node" | Stop-Process -Force`
- Ejecuta solo: `npm run dev`

---

## Resumen rápido

| Problema | Solución |
|----------|----------|
| Pantalla en blanco | Usa la URL que muestra la terminal (3000 o 3001) |
| Login/registro no funciona | Añade `localhost` en Firebase → Authorized domains |
| "Missing permissions" | Despliega reglas: `firebase deploy --only firestore:rules` |
| Fotos de perfil no cargan | Despliega Storage: `firebase deploy --only storage` |
| Comportamiento raro | Limpia caché o usa incógnito |
