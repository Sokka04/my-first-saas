import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { ProfileContent } from "./profile-content";

export const metadata: Metadata = {
  title: "Profile MySkoolis",
  description: "Espace profile du compte mySkoolis.",
};

export default function ProfileMySkoolisPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Profile MySkoolis"
        description="Ton compte est pret. Complete ton profile et configure ton espace."
      />
      <ProfileContent />
    </SubpageLayout>
  );
}
