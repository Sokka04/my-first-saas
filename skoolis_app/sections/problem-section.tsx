import { EyeOff, MessageCircleWarning, WalletCards } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";

const problems = [
  {
    title: "Peu de visibilité",
    description:
      "Les alertes arrivent tard : caisse, absences non justifiées, erreurs de saisie.",
    icon: EyeOff,
  },
  {
    title: "Traçabilité faible",
    description:
      "Sans historique fiable, les écarts financiers sont difficiles à expliquer.",
    icon: WalletCards,
  },
  {
    title: "Parents mal informés",
    description:
      "WhatsApp et papier dispersent l’information — la confiance s’érode.",
    icon: MessageCircleWarning,
  },
];

export function ProblemSection() {
  return (
    <SectionShell id="probleme">
      <SectionHeading
        eyebrow="Le problème"
        title="Gérer une école, ce n’est pas gérer le chaos."
        description="Chaque jour, les mêmes questions reviennent : paiements à jour ? Notes saisies ? Parents informés ? Trop souvent, les réponses sont éparpillées entre cahiers, Excel et messages perdus."
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.05}>
            <Card className="border-border h-full shadow-none">
              <CardContent className="flex flex-col gap-3 pt-5 pb-5">
                <span className="bg-primary text-primary-foreground inline-flex size-10 items-center justify-center rounded-xl">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-foreground text-base font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
