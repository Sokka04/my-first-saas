import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Centre legal Skoolis : mentions legales, politique de confidentialite et conditions d'utilisation.",
  robots: { index: false, follow: true },
};

const legalLinks = [
  {
    title: "Mentions legales",
    href: "/mentions-legales",
    description:
      "Informations administratives de l'editeur, hebergement, responsabilites et contact legal.",
  },
  {
    title: "Politique de confidentialite",
    href: "/confidentialite",
    description:
      "Traitement des donnees, finalites, conservation, droits des utilisateurs et modalites d'exercice.",
  },
  {
    title: "Conditions d'utilisation",
    href: "/conditions-utilisation",
    description:
      "Regles d'usage de la plateforme, obligations des parties et limitations de responsabilite.",
  },
];

export default function LegalPage() {
  return (
    <SubpageLayout maxWidth="wide">
      <MarketingPageHeader
        title="Legal"
        description="Tous les documents legaux essentiels sont centralises ici pour simplifier la consultation."
      />

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {legalLinks.map((item) => (
          <Card key={item.href} className="shadow-none">
            <CardContent className="pt-7 pb-7">
              <h2 className="text-foreground text-lg font-semibold">{item.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="text-primary mt-4 inline-flex text-sm font-medium underline-offset-4 hover:underline"
              >
                Consulter
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </SubpageLayout>
  );
}
