import Link from "next/link";
import { ArrowRight, Bell, Smartphone } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { FadeIn } from "@/components/fade-in";
import { SectionShell } from "@/components/section-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConnectSection() {
  return (
    <SectionShell id="connect">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <FadeIn>
          <p className="text-primary text-[0.7rem] font-semibold uppercase tracking-[0.12em] sm:text-xs">
            Skoolis Connect
          </p>
          <h2 className="text-foreground mt-3 text-[1.6rem] font-semibold leading-snug tracking-tight sm:text-4xl sm:leading-tight">
            Communication école‑parents, sans bruit.
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
            Les familles consultent notes, absences et paiements depuis le mobile —
            avec des notifications sobres et des informations cohérentes avec votre
            administration.
          </p>
          <ul className="mt-8 space-y-4 text-sm leading-relaxed">
            <li className="flex gap-3">
              <Smartphone className="text-primary mt-0.5 size-5 shrink-0" />
              <span>
                Expérience priorisée sur{" "}
                <strong className="text-foreground font-medium">Android</strong>{" "}
                — grands cibles tactiles, texte lisible.
              </span>
            </li>
            <li className="flex gap-3">
              <Bell className="text-primary mt-0.5 size-5 shrink-0" />
              <span>
                Moins d’appels à la secrétaire : l’essentiel est visible, à jour.
              </span>
            </li>
          </ul>
          <div className="mt-10">
            <Link
              href={siteConfig.links.trial}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "flex min-h-[3rem] w-full items-center justify-center gap-2 px-6 text-base font-semibold sm:inline-flex sm:min-h-12 sm:w-auto sm:px-8"
              )}
            >
              Inclure Connect à l’essai
              <ArrowRight className="size-5 shrink-0" />
            </Link>
          </div>
        </FadeIn>
        <FadeIn delay={0.06}>
          <div className="border-border from-muted/50 to-background relative overflow-hidden rounded-2xl border bg-gradient-to-b p-6 sm:p-8">
            <p className="text-muted-foreground text-center text-xs font-medium">
              Aperçu parent (mockup)
            </p>
            <div className="border-border bg-background mx-auto mt-6 w-full max-w-sm overflow-hidden rounded-2xl border shadow-sm">
              <div className="border-border flex min-h-[3rem] items-center justify-between gap-2 border-b px-4 py-3">
                <span className="text-sm font-semibold leading-tight">
                  Skoolis Connect
                </span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  Élève · 3e
                </span>
              </div>
              <div className="space-y-4 p-4 sm:p-5">
                <div className="border-border rounded-xl border p-4">
                  <p className="text-muted-foreground text-xs">Dernières notes</p>
                  <p className="text-foreground mt-2 text-2xl font-semibold">
                    14,5 / 20
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Français · Trimestre en cours
                  </p>
                </div>
                <div className="flex gap-3 rounded-xl bg-muted/60 px-4 py-3 text-sm">
                  <span className="size-2 shrink-0 rounded-full bg-amber-400" />
                  Message école : réunion parents jeudi 17h.
                </div>
                <div className="border-border flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
                  <span>Échéance scolarité</span>
                  <span className="text-accent-foreground font-medium">À jour</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
