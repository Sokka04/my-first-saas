import Link from "next/link";
import { BarChart3, FileText, Smartphone } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const shots = [
  {
    title: "Direction",
    caption: "Vue synthétique — sans tableau de bord surchargé.",
    icon: BarChart3,
  },
  {
    title: "Bulletins",
    caption: "Exports PDF cohérents avec votre barème.",
    icon: FileText,
  },
  {
    title: "Parents",
    caption: "Lecture simple sur mobile Android & iOS.",
    icon: Smartphone,
  },
];

export function ShowcaseSection() {
  return (
    <SectionShell id="apercus">
      <SectionHeading
        eyebrow="Aperçus"
        title="Voir Skoolis avant d’adopter."
        description="Emplacements pour vos captures réelles — la mise en page reste volontairement sobre."
      />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {shots.map((s, i) => (
          <FadeIn key={s.title} delay={i * 0.05}>
            <div className="border-border bg-muted/40 flex flex-col overflow-hidden rounded-2xl border">
              <div className="text-muted-foreground flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-gradient-to-b from-muted/80 to-muted/30">
                <s.icon className="size-10 opacity-60" aria-hidden />
                <span className="text-xs font-medium">{s.title}</span>
              </div>
              <p className="text-muted-foreground p-4 text-sm leading-relaxed">
                {s.caption}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className="mt-10 flex w-full justify-center px-1 sm:px-0">
        <Link
          href={siteConfig.links.demo}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "flex min-h-[3rem] w-full max-w-md items-center justify-center px-6 text-base font-semibold sm:inline-flex sm:min-h-12 sm:w-auto sm:max-w-none sm:px-8"
          )}
        >
          Voir la démo complète
        </Link>
      </div>
    </SectionShell>
  );
}
