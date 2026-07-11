import Link from "next/link";
import {
  CalendarDays,
  Globe,
  GraduationCap,
  LayoutGrid,
  MessagesSquare,
  Shield,
  Users,
} from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Finances & scolarité",
    description:
      "Encaissements traçables, reçus clairs, vision consolidée pour la direction.",
    icon: LayoutGrid,
  },
  {
    title: "Notes, bulletins & rapports",
    description:
      "Saisie simple, calculs cohérents, bulletins PDF prêts à partager.",
    icon: GraduationCap,
  },
  {
    title: "Dossiers & présences",
    description:
      "Parcours élève centralisé : absences, suivis et décisions documentés.",
    icon: Users,
  },
  {
    title: "Skoolis Connect",
    description:
      "Parents informés sur notes, absences et paiements — sans solliciter la permanence.",
    icon: MessagesSquare,
  },
  {
    title: "Emplois du temps",
    description:
      "Planning lisible pour les équipes, évolutions visibles pour tout le monde.",
    icon: CalendarDays,
  },
  {
    title: "Vitrine école",
    description:
      "Présentation sobre de votre établissement et des informations utiles aux familles.",
    icon: Globe,
  },
];

export function FeaturesSection() {
  return (
    <SectionShell id="fonctionnalités" muted>
      <SectionHeading
        eyebrow="Solution"
        title="Une plateforme unique, calme et durable."
        description="Skoolis replace papier, Excel et groupes WhatsApp par un référentiel unique — avec permissions, audit et données conservées sur le long terme."
      />
      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-sm">
        Détail des briques :{" "}
        <Link
          href="/modules"
          className="text-primary font-semibold underline-offset-4 hover:underline"
        >
          catalogue des modules
        </Link>
        .
      </p>
      <div className="mt-6 flex justify-center">
        <FadeIn>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Shield className="text-primary size-4" aria-hidden />
            Architecture claire, accès multi‑utilisateurs et onboarding rapide.
          </p>
        </FadeIn>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 0.04}>
            <Card className="border-border h-full shadow-none transition-shadow hover:shadow-sm">
              <CardContent className="flex flex-col gap-4 pt-8 pb-8">
                <span className="bg-primary text-primary-foreground inline-flex size-11 items-center justify-center rounded-xl">
                  <f.icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-foreground text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
