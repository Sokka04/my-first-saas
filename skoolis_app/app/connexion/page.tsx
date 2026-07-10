import type { Metadata } from "next";
import Link from "next/link";

import { LoginSwitchForm } from "@/app/connexion/login-switch-form";
import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion mySkoolis avec email et mot de passe.",
};

export default function ConnexionPage() {
  return (
    <SubpageLayout
      maxWidth="wide"
      withHomeGradient
      gradientClassName="inset-0 h-auto min-h-0 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_28%,var(--background))_0%,color-mix(in_oklch,var(--primary)_20%,var(--background))_22%,color-mix(in_oklch,var(--primary)_12%,var(--background))_38%,color-mix(in_oklch,var(--primary)_6%,var(--background))_52%,var(--background)_68%)]"
      className="relative overflow-hidden bg-background [background-image:none] pb-24 sm:pb-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <MarketingPageHeader
          title="Connexion mySkoolis"
          description="Vous n etes pas connecte. Choisissez email ou telephone puis entrez votre mot de passe."
          className="mx-auto max-w-2xl text-center"
        />

        <Card className="bg-card/80 border-primary/20 mx-auto mt-10 w-full max-w-md border shadow-[0_16px_50px_color-mix(in_oklch,var(--primary)_14%,transparent)] backdrop-blur-md">
          <CardContent className="pt-8 pb-8">
            <LoginSwitchForm />

            <div className="mt-6 border-t pt-5 text-center">
              <p className="text-muted-foreground text-sm">
                Pas encore de compte ?
              </p>
              <Link
                href="/subscription"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-3 min-h-12 w-full justify-center text-base"
                )}
              >
                Creer un compte mySkoolis
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SubpageLayout>
  );
}
