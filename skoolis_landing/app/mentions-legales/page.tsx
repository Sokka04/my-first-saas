import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <SubpageLayout>
      <MarketingPageHeader
        title="Mentions légales"
        description="Document placeholder : renseignez la dénomination sociale, le siège, le représentant légal, l’hébergeur, le numéro d’enregistrement, etc."
      />
    </SubpageLayout>
  );
}
