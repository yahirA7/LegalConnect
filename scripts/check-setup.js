#!/usr/bin/env node
/**
 * Verifica que la configuración local esté lista para desarrollo.
 * Ejecutar: node scripts/check-setup.js
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env.local");
const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "SESSION_SECRET",
];

let hasErrors = false;

console.log("\n🔍 Verificando configuración de LegalConnect...\n");

if (!fs.existsSync(envPath)) {
  console.error("❌ No existe .env.local");
  console.log("   Copia .env.local.example a .env.local y añade tus credenciales.\n");
  hasErrors = true;
} else {
  const content = fs.readFileSync(envPath, "utf8");
  const vars = {};
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      vars[key] = value;
    }
  });

  for (const name of requiredVars) {
    const value = vars[name];
    if (!value || value.length < 5) {
      console.error(`❌ ${name} no está configurado o está vacío`);
      hasErrors = true;
    } else {
      console.log(`   ✓ ${name}`);
    }
  }
}

if (!hasErrors) {
  console.log("\n✅ Configuración OK. Para desarrollo local:\n");
  console.log("   1. Usa http://localhost:3000 (no la IP de red)");
  console.log("   2. Firebase Console → Authentication → Authorized domains → añade localhost");
  console.log("   3. Firebase Console → Firestore → Rules → Publish (para desplegar reglas)");
  console.log("   4. npm run dev\n");
} else {
  console.log("\n📋 Pasos para corregir:");
  console.log("   1. Copia .env.local.example a .env.local");
  console.log("   2. Añade las credenciales desde Firebase Console");
  console.log("   3. Genera SESSION_SECRET: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"\n");
  process.exit(1);
}
