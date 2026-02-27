import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { FirebaseConfigBanner } from "@/components/FirebaseConfigBanner";
import { DevBanner } from "@/components/DevBanner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LegalConnect - Conecta con abogados de confianza",
  description: "Plataforma para buscar y reservar citas con abogados especializados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <Script
          id="chunk-load-error-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.__chunkLoadRetries = 0;
              function isChunkError(msg) {
                return msg && (msg.includes('chunk') || msg.includes('ChunkLoadError') || msg.includes('Loading chunk'));
              }
              window.addEventListener('error', function(e) {
                var msg = (e.error && e.error.message) || e.message || '';
                if (isChunkError(msg) && window.__chunkLoadRetries < 2) {
                  window.__chunkLoadRetries++;
                  setTimeout(function() { window.location.reload(); }, 500);
                }
              }, true);
              window.addEventListener('unhandledrejection', function(e) {
                var msg = (e.reason && e.reason.message) || String(e.reason) || '';
                if (isChunkError(msg) && window.__chunkLoadRetries < 2) {
                  e.preventDefault();
                  window.__chunkLoadRetries++;
                  setTimeout(function() { window.location.reload(); }, 500);
                }
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <AuthProvider>
          <FirebaseConfigBanner />
          <DevBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
