import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { SubscriptionAccountForm } from "./subscription-account-form";

export const metadata: Metadata = {
  title: "Mon compte mySkoolis",
  description:
    "Creation de ton compte mySkoolis avec informations de base et protections de securite.",
};

export default function SubscriptionPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Mon compte mySkoolis"
        description="Cree ton compte mySkoolis avec verification securisee."
      />

      <div className="mt-10">
        <SubscriptionAccountForm />
      </div>
    </SubpageLayout>
  );
}
