# Por qué falla en localhost

## Diferencias entre localhost y Vercel (producción)

| Aspecto | Vercel | Localhost |
|---------|--------|-----------|
| URL | `https://tu-app.vercel.app` | `http://localhost:3000` |
| Protocolo | HTTPS | HTTP |
| Dominio | Dominio real | localhost / 127.0.0.1 |
| Variables de entorno | Dashboard de Vercel | `.env.local` |

---

## Causas habituales de fallos en localhost

### 1. Firebase: localhost no está autorizado
Firebase Auth solo permite dominios que estés en la lista de autorizados.

**Solución:**
1. Ve a [Firebase Console](https://console.firebase.google.com) → tu proyecto
2. **Authentication** → **Settings** → **Authorized domains**
3. Comprueba que esté **localhost**
4. Si no está, haz clic en **Add domain** y añade `localhost`

---

### 2. Variables de entorno no cargadas
En desarrollo, Next.js lee `.env.local`. Si cambias el archivo, a veces hace falta reiniciar.

**Solución:**
- Detén el servidor (Ctrl+C)
- Vuelve a ejecutar: `npm run dev`

---

### 3. Acceso por IP en lugar de localhost
Si entras por `http://192.168.1.96:3000` (IP de tu red), es un origen distinto a `localhost`. Las cookies no se comparten entre ambos.

**Solución:**
- Usa siempre `http://localhost:3000` para desarrollo local

---

### 4. Reglas de Firestore
Si ves "Missing or insufficient permissions", las reglas de Firestore están bloqueando la operación.

**Solución:**
- Despliega las reglas actualizadas: `npm run firebase:deploy-rules`
- O en Firebase Console → Firestore → Rules → **Publish**

---

### 5. Caché del navegador
Cookies o caché antiguos pueden provocar comportamientos raros.

**Solución:**
- Abre DevTools (F12) → Application → Storage → **Clear site data**
- O prueba en una ventana de incógnito

---

## Checklist rápido

- [ ] `localhost` en Firebase → Authorized domains
- [ ] `.env.local` con todas las variables
- [ ] Servidor reiniciado tras cambiar `.env.local`
- [ ] Acceso por `http://localhost:3000` (no por IP)
- [ ] Reglas de Firestore desplegadas
- [ ] Caché del navegador limpia
