import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Basique",
    blurb: "Petites structures",
    price: "80 000",
    features: [
      "Logiciel local (poste desktop)",
      "Élèves & notes",
      "Bulletins automatiques",
      "Support par e‑mail",
    ],
    cta: "outline" as const,
    highlight: false,
  },
  {
    name: "Plus",
    blurb: "Standard recommandé",
    price: "100 000",
    badge: "Populaire",
    features: [
      "Tout le pack Basique",
      "Cloud + bureau",
      "Site vitrine école",
      "Skoolis Connect parents",
      "Sauvegarde cloud quotidienne",
      "Support prioritaire",
    ],
    cta: "default" as const,
    highlight: true,
  },
  {
    name: "Pro",
    blurb: "Réseaux & grands établissements",
    price: "180 000",
    features: [
      "Tout le pack Plus",
      "Multi‑établissements",
      "Rapports avancés",
      "Accompagnement renforcé",
      "Imports & montée en charge",
    ],
    cta: "outline" as const,
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <SectionShell id="tarifs" muted>
      <SectionHeading
        eyebrow="Tarifs"
        title="Des offres lisibles, sans surprise."
        description="Trois niveaux pour démarrer simplement. Essai gratuit 30 jours — sans carte bancaire. Comparaison détaillée sur la page tarifs."
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <FadeIn key={tier.name} delay={i * 0.06}>
            <Card
              className={cn(
                "relative flex h-full flex-col border shadow-none",
                tier.highlight && "border-primary ring-primary/15 ring-2"
              )}
            >
              {tier.badge ? (
                <span className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold">
                  {tier.badge}
                </span>
              ) : null}
              <CardHeader className="pb-2 pt-8">
                <p className="text-muted-foreground text-sm">{tier.blurb}</p>
                <h3 className="text-foreground text-xl font-semibold">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-foreground text-4xl font-semibold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground text-sm">FCFA / an</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 pt-2">
                {tier.features.map((f) => (
                  <div key={f} className="flex gap-2 text-sm">
                    <Check
                      className="text-accent-foreground mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pb-8">
                <Link
                  href={siteConfig.links.trial}
                  className={cn(
                    buttonVariants({
                      variant: tier.cta,
                      size: "lg",
                      className:
                        "min-h-[3rem] h-auto w-full justify-center py-3 text-base font-semibold sm:min-h-12",
                    })
                  )}
                >
                  Commencer l’essai
                </Link>
                <p className="text-muted-foreground text-center text-xs">
                  30 jours gratuits inclus
                </p>
              </CardFooter>
            </Card>
          </FadeIn>
        ))}
      </div>
      <FadeIn>
        <p className="text-muted-foreground mt-12 text-center text-sm leading-relaxed">
          Paiement : Mobile Money (MTN, Moov, Orange), virement ou carte. Échelonnement
          possible.{" "}
          <Link
            href="/faq#paiement"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            En savoir plus
          </Link>
          {" · "}
          <Link
            href="/tarifs"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Tableau comparatif
          </Link>
        </p>
      </FadeIn>
    </SectionShell>
  );
}
