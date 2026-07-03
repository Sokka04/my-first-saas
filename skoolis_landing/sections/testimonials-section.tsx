import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { Card, CardContent } from "@/components/ui/card";

const quotes = [
  {
    quote:
      "« Nous voulons voir la caisse en un coup d’œil et retrouver l’historique sans fouiller dans des cahiers. »",
    role: "Secrétariat",
  },
  {
    quote:
      "« Le hors‑ligne nous sauve : on enregistre, puis tout remonte quand le réseau revient. »",
    role: "Comptabilité",
  },
  {
    quote:
      "« Les parents veulent une info fiable — notes, absences, paiements — pas des messages perdus. »",
    role: "Parent",
  },
];

export function TestimonialsSection() {
  return (
    <SectionShell id="temoignages" muted>
      <SectionHeading
        eyebrow="Témoignages"
        title="Voix du terrain — à compléter avec vos histoires."
        description="Emplacements pour retours authentiques (même courts). Les prénoms peuvent rester anonymes."
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((t, i) => (
          <FadeIn key={t.role} delay={i * 0.05}>
            <Card className="border-border flex h-full flex-col shadow-none">
              <CardContent className="flex h-full flex-col gap-4 pt-5 pb-5">
                <p className="text-foreground flex-1 text-sm leading-relaxed italic">
                  {t.quote}
                </p>
                <div className="border-border mt-auto border-t pt-3">
                  <p className="text-foreground text-sm font-semibold">{t.role}</p>
                  <p className="text-muted-foreground text-xs">Profil anonymisé</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
