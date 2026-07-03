import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { FadeIn } from "@/components/fade-in";
import { SectionShell } from "@/components/section-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <SectionShell id="contact-cta" className="pb-[calc(var(--section-py)+1rem)]">
      <FadeIn>
        <div className="border-border bg-muted/50 relative overflow-hidden rounded-3xl border px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="relative max-w-2xl">
            <h2 className="text-foreground text-[1.6rem] font-semibold leading-snug tracking-tight sm:text-4xl sm:leading-tight">
              Prêt à remplacer le chaos par un système calme ?
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
              Un seul référentiel pour la direction — finances, pédagogie,
              parents et historique. Démarrez l’essai ou échangez avec nous sur
              WhatsApp.
            </p>
            <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:items-stretch">
              <Link
                href={siteConfig.links.trial}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "flex min-h-[3rem] w-full items-center justify-center gap-2 px-6 text-base font-semibold sm:min-h-12 sm:w-auto sm:px-8"
                )}
              >
                Essai gratuit — 30 jours
                <ArrowRight className="size-5 shrink-0" aria-hidden />
              </Link>
              <Link
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-border bg-background flex min-h-[3rem] w-full items-center justify-center px-6 text-base sm:min-h-12 sm:w-auto sm:px-8"
                )}
              >
                Écrire sur WhatsApp
              </Link>
            </div>
            <ul className="text-muted-foreground mt-8 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
              <li>Sans engagement</li>
              <li>Sans carte bancaire</li>
              <li>Accompagnement humain</li>
            </ul>
          </div>
        </div>
      </FadeIn>
    </SectionShell>
  );
}
