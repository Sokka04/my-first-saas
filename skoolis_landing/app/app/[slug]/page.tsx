import type { Metadata } from "next";

import { SkolisLegacyPage } from "../skolis-legacy-page";

type AppLegacySlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AppLegacySlugPage({
  params,
}: AppLegacySlugPageProps) {
  const { slug } = await params;
  return <SkolisLegacyPage slug={slug} />;
}
