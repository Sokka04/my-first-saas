import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  FileText,
  MessageSquare,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fonctionnalites",
  description:
    "Fonctionnalites Skoolis pour les etablissements africains : gestion scolaire, communication parents, suivi pedagogique et pilotage de direction.",
};

const pillars = [
  {
    title: "Pilotage direction",
    description:
      "Vision claire des paiements, absences, performances et operations en un seul tableau de bord.",
    icon: BarChart3,
  },
  {
    title: "Gestion pedagogique",
    description:
      "Saisie des notes, generation des bulletins, suivi des classes et historique annuel durable.",
    icon: FileText,
  },
  {
    title: "Communication parents",
    description:
      "Messages ecole-parents, notifications utiles et meilleure transparence sur la vie scolaire.",
    icon: MessageSquare,
  },
  {
    title: "Finances et recouvrement",
    description:
      "Suivi des frais de scolarite, traces de paiements et rapprochements exploitables par l'administration.",
    icon: Wallet,
  },
  {
    title: "Presence et discipline",
    description:
      "Absences, retards et incidents structures pour agir vite et reduire les zones de flou.",
    icon: CalendarDays,
  },
  {
    title: "Roles et securite",
    description:
      "Acces par profil (direction, administration, enseignant, parent) avec controle et audit des actions.",
    icon: ShieldCheck,
  },
];

export default function FeaturesPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Fonctionnalites"
        description="Skoolis remplace les outils disperses par une plateforme unique, moderne et adaptee aux ecoles africaines."
      />

      <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pillars.map((item) => (
          <Card key={item.title} className="shadow-none">
            <CardContent className="pt-7 pb-7">
              <item.icon className="text-primary size-7" aria-hidden />
              <h2 className="text-foreground mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-none lg:col-span-2">
          <CardContent className="pt-7 pb-7">
            <h3 className="text-foreground text-lg font-semibold">Avant / Apres Skoolis</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Avant : cahiers multiples, WhatsApp disperse, notes difficilement exploitables.
              Apres : operations centralisees, communication tracee, indicateurs clairs pour la
              direction et meilleure experience parent-eleve.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="pt-7 pb-7">
            <Users className="text-primary size-7" aria-hidden />
            <h3 className="text-foreground mt-4 text-lg font-semibold">Adoption equipe</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Interface simple, parcours clair et accompagnement progressif pour chaque profil.
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
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
          href="/pricing"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "min-h-12 justify-center px-8 text-base"
          )}
        >
          Voir les tarifs
        </Link>
      </div>
    </SubpageLayout>
  );
}
