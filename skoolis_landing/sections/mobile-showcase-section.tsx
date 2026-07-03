import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

export function MobileShowcaseSection() {
  return (
    <SectionShell id="mobile" muted>
      <SectionHeading
        eyebrow="Mobile d’abord"
        title="Lisible en salle des profs. Utilisable sur le terrain."
        description="Moins de colonnes, des actions évidentes, des textes grands : Skoolis est conçu pour un usage réel sur smartphone, sans surcharge visuelle."
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {[
          {
            title: "Navigation courte",
            body: "Quelques sections clés — assez pour agir, pas assez pour se perdre.",
          },
          {
            title: "Tâches courantes en premier",
            body: "Présences, encaissement, saisie de notes : le quotidien avant le reste.",
          },
          {
            title: "Lecture confortable",
            body: "Hiérarchie typographique forte, contrastes stables, boutons faciles à toucher.",
          },
        ].map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.05}>
            <div className="border-border bg-background h-full rounded-2xl border p-6">
              <h3 className="text-foreground text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
