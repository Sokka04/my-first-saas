import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, FileText, Play, Smartphone } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Démo",
  description:
    "Démo Skoolis : tableaux de bord, bulletins, portail parents, paiements Mobile Money.",
};

export default function DemoPage() {
  return (
    <SubpageLayout maxWidth="wide">
      <MarketingPageHeader
        title="Démo Skoolis"
        description="Le prospect doit voir : remplacez ces blocs par captures réelles et une vidéo hébergée (YouTube / Vimeo)."
      />

      <section className="mt-14">
        <p className="text-primary text-xs font-semibold uppercase tracking-wider">
          Établissement fictif
        </p>
        <h2 className="text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          « Collège Démonstration Skoolis »
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
          Utilisez un jeu de données anonymisé (élèves fictifs) pour montrer
          bulletins, moyennes et paiements sans exposer de vraies écoles.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { title: "Dashboard directeur", icon: BarChart3 },
            { title: "Exemple bulletin (PDF)", icon: FileText },
            { title: "Interface parent", icon: Smartphone },
          ].map((s) => (
            <div
              key={s.title}
              className="border-border bg-muted/50 flex flex-col items-center justify-center gap-3 rounded-2xl border aspect-[4/3]"
            >
              <s.icon className="text-muted-foreground size-10" aria-hidden />
              <span className="text-muted-foreground text-center text-sm font-medium">
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-border bg-muted/40 mt-14 rounded-2xl border p-6 sm:p-8">
        <h3 className="text-foreground flex items-center gap-2 text-lg font-semibold">
          <Play className="text-primary size-5" aria-hidden />
          Vidéo produit
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Intégrez ici une iframe vidéo ou un lien « Regarder la démo ».
        </p>
      </section>

      <section className="mt-14">
        <h3 className="text-foreground text-lg font-semibold">
          Paiement Mobile Money
        </h3>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
          Montrez l’écran d’enregistrement d’un paiement, le reçu généré et la
          traçabilité dans le module comptable.
        </p>
      </section>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href={siteConfig.links.trial}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-12 justify-center px-8 text-base font-semibold"
          )}
        >
          Essai gratuit
        </Link>
        <Link
          href={siteConfig.links.contact}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "min-h-12 justify-center px-8 text-base"
          )}
        >
          Parler à l’équipe
        </Link>
      </div>
    </SubpageLayout>
  );
}
