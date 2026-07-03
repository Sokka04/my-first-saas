import type { Metadata } from "next";

import { SkolisLegacyPage } from "./skolis-legacy-page";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AppSkoolisPage() {
  return <SkolisLegacyPage />;
}
