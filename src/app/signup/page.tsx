import Link from "next/link";
import { Scale } from "lucide-react";
import { SignupForm } from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 font-display font-semibold">
        <Scale className="h-5 w-5" />
        LegalConnect
      </Link>
      <SignupForm />
    </div>
  );
}
