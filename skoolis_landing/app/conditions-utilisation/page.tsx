import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";

export const metadata: Metadata = {
  title: "Conditions d’utilisation",
  robots: { index: false, follow: true },
};

export default function ConditionsUtilisationPage() {
  return (
    <SubpageLayout>
      <MarketingPageHeader
        title="Conditions d’utilisation"
        description="Document placeholder : compte, abonnement, disponibilité, responsabilités, limitations, résiliation, loi applicable."
      />
    </SubpageLayout>
  );
}
