import { Suspense } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2.5 font-display font-semibold text-lg text-foreground hover:opacity-90 transition-opacity z-10"
      >
        <Scale className="h-6 w-6 text-primary" strokeWidth={1.5} />
        LegalConnect
      </Link>
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
