# Configurar CORS en Firebase Storage

Si ves errores de CORS al subir o cargar fotos de perfil (especialmente en Vercel), debes configurar CORS en tu bucket de Storage.

## Opción 1: Con gsutil (recomendado)

### 1. Instalar Google Cloud SDK

- Descarga: https://cloud.google.com/sdk/docs/install
- O con Chocolatey: `choco install gcloudsdk`

### 2. Autenticarte

```powershell
gcloud auth login
```

### 3. Aplicar la configuración CORS

```powershell
gsutil cors set storage.cors.json gs://legalconnect-4e027.firebasestorage.app
```

Si tu bucket usa el formato antiguo, prueba:

```powershell
gsutil cors set storage.cors.json gs://legalconnect-4e027.appspot.com
```

### 4. Verificar

```powershell
gsutil cors get gs://legalconnect-4e027.firebasestorage.app
```

---

## Opción 2: Con Google Cloud Shell (sin instalar nada)

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona el proyecto **legalconnect-4e027**
3. Haz clic en el icono **>_** (Cloud Shell) arriba a la derecha
4. Crea el archivo:

```bash
cat > cors.json << 'EOF'
[{"origin":["*"],"method":["GET","HEAD","PUT","POST","OPTIONS"],"responseHeader":["Content-Type","Content-Length","x-goog-resumable","x-goog-meta-*"],"maxAgeSeconds":3600}]
EOF
```

5. Aplica CORS:

```bash
gsutil cors set cors.json gs://legalconnect-4e027.firebasestorage.app
```

6. Si falla, prueba con el bucket alternativo:

```bash
gsutil cors set cors.json gs://legalconnect-4e027.appspot.com
```

---

## Nota

El bucket correcto aparece en la URL del error. Si ves `legalconnect-4e027.firebasestorage.app`, usa ese. Si ves `legalconnect-4e027.appspot.com`, usa ese.
