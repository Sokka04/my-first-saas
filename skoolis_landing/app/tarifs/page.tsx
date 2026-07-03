import type { Metadata } from "next";
import Link from "next/link";
import { Check, Computer, Database, Headset } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Tarifs Skoolis : Basique, Plus, Pro — installation, support, migration, Mobile Money.",
};

const tiers = [
  {
    id: "plan-basique",
    name: "Basique",
    blurb: "Petites écoles",
    price: "60 000",
    features: ["Desktop (offline)", "Élèves, notes, bulletins", "Support email"],
    highlight: false,
  },
  {
    id: "plan-plus",
    name: "Plus",
    blurb: "École en ligne + desktop",
    price: "90 000",
    badge: "Populaire",
    features: [
      "Tout Basique",
      "Cloud + sync",
      "Site web école",
      "Portail parents",
    ],
    highlight: true,
  },
  {
    id: "plan-pro",
    name: "Pro",
    blurb: "Réseaux & grands établissements",
    price: "150 000",
    features: ["Tout Plus", "Multi-campus / multi-écoles", "API & intégrations"],
    highlight: false,
  },
];

export default function TarifsPage() {
  return (
    <SubpageLayout maxWidth="wide">
      <MarketingPageHeader
        title="Tarifs"
        description="Plans clairs, options d’installation, support et migration — les montants affichés sur l’accueil restent indicatifs tant que la facturation n’est pas connectée."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            id={tier.id}
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
              <h2 className="text-foreground text-xl font-semibold">{tier.name}</h2>
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
            <CardFooter className="pb-8">
              <Link
                href={siteConfig.links.trial}
                className={cn(
                  buttonVariants({
                    variant: tier.highlight ? "default" : "outline",
                    size: "lg",
                    className: "min-h-12 w-full justify-center text-base font-semibold",
                  })
                )}
              >
                Essai gratuit
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <section className="mt-16" id="comparaison">
        <h2 className="text-foreground text-2xl font-semibold">
          Comparaison (vue détaillée)
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          À compléter : tableau ou lien vers PDF. Indiquez ce qui est cloud-only,
          desktop-only, et ce qui nécessite le pack Pro.
        </p>
      </section>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card className="shadow-none">
          <CardContent className="flex gap-4 pt-8 pb-8">
            <Computer className="text-primary size-8 shrink-0" aria-hidden />
            <div>
              <h3 className="text-foreground font-semibold">Installation locale</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Postes Windows/macOS, stratégie de déploiement, mises à jour — à
                cadrer avec votre terrain.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex gap-4 pt-8 pb-8">
            <Headset className="text-primary size-8 shrink-0" aria-hidden />
            <div>
              <h3 className="text-foreground font-semibold">Support</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Canaux, SLA, horaires — voir aussi{" "}
                <Link
                  href={siteConfig.links.contact}
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Contact
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="flex gap-4 pt-8 pb-8">
            <Database className="text-primary size-8 shrink-0" aria-hidden />
            <div>
              <h3 className="text-foreground font-semibold">Migration données</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Import Excel, reprise partielle, validation — traité comme un
                mini-projet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section
        className="border-primary/30 bg-primary/5 mt-16 rounded-2xl border-2 p-8 text-center"
        id="devis-groupe"
      >
        <h2 className="text-foreground text-xl font-semibold">
          Demander un devis groupe scolaire
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Réseaux, fédérations, plusieurs sites : tarification sur mesure.
        </p>
        <Link
          href={`${siteConfig.links.contact}?objet=devis-groupe`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-6 inline-flex min-h-12 px-8 text-base font-semibold"
          )}
        >
          Contacter le commercial
        </Link>
      </section>

      <section className="mt-16" id="faq-paiement">
        <h2 className="text-foreground text-xl font-semibold">FAQ paiement</h2>
        <div className="border-border bg-card mt-4 rounded-2xl border p-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Mobile Money (MTN, Moov, Orange), virement, carte. Échelonnement
            possible. Détail :{" "}
            <Link
              href="/faq#paiement"
              className="text-primary font-semibold underline-offset-4 hover:underline"
            >
              FAQ / Paiements
            </Link>
            .
          </p>
        </div>
      </section>
    </SubpageLayout>
  );
}
