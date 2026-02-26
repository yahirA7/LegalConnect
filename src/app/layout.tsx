import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { FirebaseConfigBanner } from "@/components/FirebaseConfigBanner";
import { DevBanner } from "@/components/DevBanner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <FirebaseConfigBanner />
          <DevBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
