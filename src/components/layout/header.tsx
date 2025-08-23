import AuthButton from "@/components/auth/auth-button";
import { Rocket } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Rocket className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">1BRC Speedster</h1>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}
