import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, Rocket, School, ShieldCheck } from "lucide-react";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "A propos",
  description:
    "A propos de Skoolis : notre vision, notre mission et notre engagement pour la modernisation des ecoles africaines.",
};

const values = [
  {
    title: "Contexte africain d'abord",
    description:
      "Nous concevons les parcours selon les realites du terrain : connectivite variable, contraintes administratives et besoins des directions.",
    icon: School,
  },
  {
    title: "Simple et premium",
    description:
      "Une experience claire pour l'administration, les parents et les eleves, sans sacrifier la qualite percue.",
    icon: Landmark,
  },
  {
    title: "Fiable et durable",
    description:
      "Donnees organisees sur le long terme, suivi par annee scolaire et standards de securite pour la confiance.",
    icon: ShieldCheck,
  },
  {
    title: "Ambition long terme",
    description:
      "Skoolis est pense comme une base scalable pour accompagner l'essor des etablissements prives.",
    icon: Rocket,
  },
];

export default function AboutPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="A propos de Skoolis"
        description="Skoolis porte une vision claire : aider les ecoles africaines a passer d'une gestion dispersee a un pilotage moderne, structure et scalable."
      />

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {values.map((value) => (
          <Card key={value.title} className="shadow-none">
            <CardContent className="pt-7 pb-7">
              <value.icon className="text-primary size-7" aria-hidden />
              <h2 className="text-foreground mt-4 text-lg font-semibold">{value.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {value.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border p-6 sm:p-8">
        <h2 className="text-foreground text-xl font-semibold">Notre priorite en V1</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
          Prouver rapidement la valeur pour les directions d&apos;etablissements : moins de
          chaos operationnel, meilleure communication parents-ecole et meilleure capacite
          a suivre les indicateurs cles.
        </p>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/contact?objet=demande-demo#form"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-12 justify-center px-8 text-base font-semibold"
          )}
        >
          Demander une demo
        </Link>
        <Link
          href="/features"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "min-h-12 justify-center px-8 text-base"
          )}
        >
          Voir les fonctionnalites
        </Link>
      </div>
    </SubpageLayout>
  );
}
