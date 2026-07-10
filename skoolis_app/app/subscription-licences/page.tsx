import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { SubscriptionLicencesForm } from "./subscription-licences-form";

export const metadata: Metadata = {
  title: "Subscription licences",
  description:
    "Souscription licences en 4 etapes validees apres creation du compte mySkoolis.",
};

export default function SubscriptionLicencesPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Subscription licences"
        description="Formulaire abonnement/licence en 4 etapes avec validation a chaque etape."
      />

      <div className="mt-10">
        <SubscriptionLicencesForm />
      </div>
    </SubpageLayout>
  );
}
