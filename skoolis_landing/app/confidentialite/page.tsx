import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <SubpageLayout>
      <MarketingPageHeader
        title="Politique de confidentialité"
        description="Document placeholder : finalités, base légale, durées de conservation, sous-traitants, droits des personnes, contact DPO / référent."
      />
    </SubpageLayout>
  );
}
