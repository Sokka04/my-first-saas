import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { TrialForm } from "./trial-form";

export const metadata: Metadata = {
  title: "Essai gratuit",
  description:
    "Créez votre compte Skoolis — 30 jours d’essai sans carte bancaire. Formulaire à brancher sur skoolis_api.",
};

export default function EssaiGratuitPage() {
  return (
    <SubpageLayout>
      <MarketingPageHeader
        title="Créer votre compte — essai 30 jours"
        description="Sans carte bancaire. Ce formulaire est un placeholder : la validation finale passera par skoolis_api (Sanctum + rôles par école)."
      />
      <div className="border-border bg-card mt-10 rounded-2xl border p-6 sm:p-8">
        <TrialForm />
      </div>
    </SubpageLayout>
  );
}
