"use client";

import { useEffect } from "react";
import { SubpageLayout } from "@/components/subpage-layout";
import { Loader2 } from "lucide-react";

export default function SubscriptionLicencesPage() {
  useEffect(() => {
    // Redirection automatique vers la Landing (portail d'achat)
    const timeout = setTimeout(() => {
      window.location.href = "http://localhost:3000/portal/subscription";
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Votre licence a expiré ou est manquante</h1>
        <p className="text-muted-foreground">
          Vous allez être redirigé vers votre espace personnel pour la renouveler...
        </p>
      </div>
    </SubpageLayout>
  );
}
