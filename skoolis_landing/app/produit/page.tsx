import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Produit",
  description:
    "Vue d’ensemble Skoolis : architecture API, desktop, cloud, parents, multi-campus, permissions, sauvegardes.",
};

export default function ProduitPage() {
  return (
    <SubpageLayout>
      <MarketingPageHeader
        title="Le produit, de bout en bout"
        description="Une API Laravel au centre, des clients (web, desktop, mobile futur) qui consomment les mêmes endpoints versionnés."
      />

      <article className="text-muted-foreground mt-12 space-y-10 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Vue architecture</h2>
          <p>
            Clients → HTTPS API → domaines métier (ERP) → MariaDB + fichiers sur
            disque. Redis pour cache/queues en production.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Desktop app</h2>
          <p>
            Poste de travail : saisie intensive, impression, usage offline.
            Aucune règle métier « cachée » dans le desktop : le cerveau reste
            l’API.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Cloud sync</h2>
          <p>
            La synchronisation réconcilie le local et le serveur, avec des
            identifiants stables et une stratégie de conflits explicite.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Application parents
          </h2>
          <p>
            Lecture et actions autorisées : notes, absences, paiements — avec
            permissions fines.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Multi-campus</h2>
          <p>
            Hiérarchie réseau / établissements : rôles par{" "}
            <strong className="text-foreground font-medium">école</strong>{" "}
            (team), lisibilité consolidée pour la direction groupe.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Permissions utilisateurs
          </h2>
          <p>
            Rôles + policies : directeur, comptable, enseignant, parent —
            scoping systématique sur{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              school_id
            </code>
            .
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Sauvegardes</h2>
          <p>
            Sauvegardes DB + rétention ; restauration testée ; fichiers hors base
            (PDF, photos) sur stockage structuré.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">
            Historique long terme
          </h2>
          <p>
            Années scolaires, soft delete, audit : conserver 20 ans sans mélanger
            les contextes.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-foreground text-xl font-semibold">Sécurité</h2>
          <p>
            Sanctum, moindre privilège, journalisation : indispensable pour la
            confiance des familles et des financeurs.
          </p>
        </section>
      </article>

      <div className="mt-14 flex flex-col gap-3 sm:flex-row">
        <Link
          href={siteConfig.links.horsLigne}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-12 justify-center px-8 text-base font-semibold"
          )}
        >
          Comprendre l’offline
        </Link>
        <Link
          href={siteConfig.links.demo}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "min-h-12 justify-center px-8 text-base"
          )}
        >
          Voir la démo
        </Link>
      </div>
    </SubpageLayout>
  );
}
