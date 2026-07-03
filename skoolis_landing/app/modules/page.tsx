import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  FileText,
  Globe,
  GraduationCap,
  Network,
  PieChart,
  Scale,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

import { siteConfig } from "@/lib/site";
import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Catalogue des modules Skoolis : élèves, notes, bulletins, paiements, parents, emplois du temps, multi-écoles.",
};

const modules = [
  { title: "Élèves", desc: "Dossier, inscriptions, suivi longitudinal.", icon: GraduationCap },
  { title: "Notes", desc: "Saisie, barèmes, calculs, contrôle des bulletins.", icon: BarChart3 },
  { title: "Bulletins", desc: "Génération PDF, historique par année scolaire.", icon: FileText },
  { title: "Paiements", desc: "Scolarité, reçus, rapprochement, Mobile Money.", icon: Wallet },
  { title: "Comptabilité", desc: "Traçabilité, exports, vision caisse / direction.", icon: PieChart },
  { title: "Présences", desc: "Absences, retards, notifications parents.", icon: UserCheck },
  { title: "Discipline", desc: "Incidents, suites, historique par élève.", icon: Scale },
  { title: "Parents", desc: "Portail : notes, messages, paiements.", icon: Users },
  { title: "Emplois du temps", desc: "Planning, salles, modifications notifiées.", icon: CalendarDays },
  { title: "Rapports", desc: "Direction : pilotage, exports, tableaux de bord.", icon: PieChart },
  { title: "Site web école", desc: "Vitrine, actualités, inscription en ligne.", icon: Globe },
  { title: "Multi-écoles", desc: "Réseaux : agrégation, rôles, gouvernance des accès.", icon: Network },
];

export default function ModulesPage() {
  return (
    <SubpageLayout maxWidth="wide">
      <MarketingPageHeader
        title="Modules"
        description="Chaque module = un bénéfice mesurable, une capture produit, et un flux simple (à illustrer dans la démo)."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <div
            key={m.title}
            className="border-border bg-card flex gap-4 rounded-2xl border p-5 shadow-none"
          >
            <span className="bg-primary text-primary-foreground inline-flex size-10 shrink-0 items-center justify-center rounded-lg">
              <m.icon className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-foreground font-semibold">{m.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href={siteConfig.links.demo}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-12 px-8 text-base font-semibold"
          )}
        >
          Voir la démo
        </Link>
      </div>
    </SubpageLayout>
  );
}
