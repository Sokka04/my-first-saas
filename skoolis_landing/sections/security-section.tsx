import { Cloud, Database, Lock, Server } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

const points = [
  {
    title: "Sauvegardes cloud",
    description:
      "Copies planifiées pour limiter la perte de données — stratégie de restauration claire.",
    icon: Cloud,
  },
  {
    title: "Stockage académique long terme",
    description:
      "Historique par année scolaire : retrouver bulletins et dossiers même après des années.",
    icon: Database,
  },
  {
    title: "Contrôle d’accès",
    description:
      "Rôles par établissement : chaque utilisateur voit ce qu’il doit voir — pas plus.",
    icon: Lock,
  },
  {
    title: "Centralisation maîtrisée",
    description:
      "Une source unique pour la direction : moins de copies Excel et de versions contradictoires.",
    icon: Server,
  },
];

export function SecuritySection() {
  return (
    <SectionShell id="securite">
      <SectionHeading
        eyebrow="Sécurité & données"
        title="Des données d’école traitées comme elles le méritent."
        description="La confiance se construit avec la transparence : sauvegardes, périmètres d’accès et conservation responsable de l’historique académique."
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {points.map((p, i) => (
          <FadeIn key={p.title} delay={i * 0.05}>
            <div className="border-border flex gap-4 rounded-2xl border p-6">
              <span className="bg-muted text-primary inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                <p.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-foreground font-semibold">{p.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
