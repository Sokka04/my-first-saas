import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { SubscriptionAccountForm } from "./subscription-account-form";

export const metadata: Metadata = {
  title: "Mon compte mySkoolis",
  description:
    "Création de ton compte mySkoolis avec informations de base et protections de sécurité.",
};

export default function SubscriptionPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Mon compte mySkoolis"
        description="Crée ton compte mySkoolis avec vérification sécurisée."
      />

      <div className="mt-10">
        <SubscriptionAccountForm />
      </div>
    </SubpageLayout>
  );
}
