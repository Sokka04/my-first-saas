import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Pricing Skoolis : offres pensées pour les écoles africaines, avec accompagnement, migration et support.",
};

const tiers = [
  {
    id: "starter",
    name: "Starter",
    audience: "Petites structures",
    price: "A partir de 60 000 FCFA / an",
    features: [
      "Dossier élèves et classes",
      "Saisie notes et bulletins",
      "Support standard",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    audience: "Écoles en acceleration",
    price: "A partir de 90 000 FCFA / an",
    highlight: true,
    features: [
      "Tout Starter",
      "Portail parents",
      "Synchronisation cloud",
      "Automatisations essentielles",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    audience: "Reseaux et multi-campus",
    price: "A partir de 150 000 FCFA / an",
    features: [
      "Tout Growth",
      "Gestion multi-établissements",
      "Accompagnement personnalise",
      "Priorite support",
    ],
  },
];

export default function PricingPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Tarifs"
        description="Des offres lisibles, structurees pour accompagner la modernisation de votre école sans complexite inutile."
      />

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={cn(
              "flex h-full flex-col shadow-none",
              tier.highlight && "border-primary ring-primary/15 ring-2"
            )}
          >
            <CardHeader className="pt-7">
              <p className="text-muted-foreground text-sm">{tier.audience}</p>
              <h2 className="text-foreground mt-1 text-2xl font-semibold">{tier.name}</h2>
              <p className="text-foreground mt-4 text-base font-medium">{tier.price}</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                  <span className="text-sm leading-relaxed">{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pb-7">
              <Link
                href="/contact?objet=demande-demo#form"
                className={cn(
                  buttonVariants({
                    variant: tier.highlight ? "default" : "outline",
                    size: "lg",
                  }),
                  "min-h-12 w-full justify-center text-base font-semibold"
                )}
              >
                Demander une demo
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>

      <div className="mt-10">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Les tarifs exacts dependent du volume élèves, des modules retenus et du niveau
          d&apos;accompagnement. Nous construisons une proposition claire apres qualification.
        </p>
      </div>
    </SubpageLayout>
  );
}
