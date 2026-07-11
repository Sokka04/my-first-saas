import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hors-ligne & synchronisation",
  description:
    "Skoolis hors-ligne : travail local, synchronisation cloud, identifiants stables, sauvegardes.",
};

export default function HorsLignePage() {
  return (
    <SubpageLayout>
      <MarketingPageHeader
        title="Hors-ligne : votre avantage terrain"
        description="La coupure n’est pas une exception : c’est une contrainte à architecturer. Skoolis sépare travail local et vérité centralisée sur le cloud."
      />

      <article className="text-muted-foreground mt-12 space-y-10 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Pourquoi l’offline compte
          </h2>
          <p>
            Les établissements continuent à fonctionner : caisse, bulletins,
            dossiers élèves. Un SaaS « 100 % online » vous condamne aux files
            d’attente et aux erreurs de ressaisie.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Fonctionnement sans internet
          </h2>
          <p>
            L’application desktop enregistre localement. Les utilisateurs
            travaillent normalement ; la synchronisation se déclenche lorsque le
            réseau est disponible.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">SQLite local</h2>
          <p>
            Base embarquée légère, fiable, adaptée au offline-first. Le détail
            d’implémentation sera porté par le client desktop — le serveur reste
            la référence pour la cohérence multi-postes.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Synchronisation cloud
          </h2>
          <p>
            Les changements remontent vers l’API Laravel. Les identifiants{" "}
            <strong className="text-foreground font-medium">UUID</strong>{" "}
            évitent les collisions naïves et préparent la résolution de conflits.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Gestion des conflits
          </h2>
          <p>
            Stratégie à trancher (dernier gagnant vs règles métier). L’important
            : tout événement sensible est auditable côté serveur.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Sauvegardes</h2>
          <p>
            Cloud : sauvegardes automatiques. Local : stratégie de restore
            documentée — la perte matériel ne doit pas effacer la confiance.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Cas réels africains
          </h2>
          <ul className="text-foreground list-inside list-disc space-y-2">
            <li>Coupures quotidiennes : file d’attente de sync + reprise</li>
            <li>Connexion « par fenêtre » : sync delta même courte</li>
            <li>Postes partagés : permissions strictes + audit</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Sécurité des données
          </h2>
          <p>
            Chiffrement en transit (HTTPS), contrôle d’accès par rôle et par
            école, logs d’audit pour les opérations sensibles — voir aussi{" "}
            <Link
              href="/faq#sécurité"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              FAQ sécurité
            </Link>
            .
          </p>
        </section>
      </article>

      <div className="mt-14 flex flex-col gap-3 sm:flex-row">
        <Link
          href={siteConfig.links.demo}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-12 justify-center px-8 text-base font-semibold"
          )}
        >
          Voir la démo
        </Link>
        <Link
          href={siteConfig.links.trial}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "min-h-12 justify-center px-8 text-base"
          )}
        >
          Essai gratuit
        </Link>
      </div>
    </SubpageLayout>
  );
}
