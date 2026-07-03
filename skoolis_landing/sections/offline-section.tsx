import Link from "next/link";
import { RefreshCw, WifiOff } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { SectionShell } from "@/components/section-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OfflineSection() {
  return (
    <SectionShell
      id="hors-ligne"
      className="border-border border-y bg-[linear-gradient(180deg,oklch(0.98_0.04_300)_0%,oklch(1_0_0)_100%)]"
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <FadeIn>
          <p className="text-primary text-[0.7rem] font-semibold uppercase tracking-[0.12em] sm:text-xs">
            Réseau instable
          </p>
          <h2 className="text-foreground mt-3 text-[1.6rem] font-semibold leading-snug tracking-tight sm:text-4xl sm:leading-tight">
            Travaillez la journée. Synchronisez quand le réseau revient.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            Skoolis est utilisable hors connexion sur le poste bureau : saisie,
            encaissements et dossiers continuent. À la reconnexion, tout remonte
            proprement vers le cloud — sans double saisie manuelle.
          </p>
          <Link
            href="/hors-ligne"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "mt-8 flex min-h-[3rem] w-full max-w-md items-center justify-center px-6 text-base sm:inline-flex sm:min-h-12 sm:w-auto sm:px-8"
            )}
          >
            Comprendre le mode hors‑ligne
          </Link>
        </FadeIn>
        <FadeIn delay={0.06}>
          <ul className="space-y-4">
            <li className="border-border bg-background flex gap-4 rounded-2xl border p-5">
              <span className="bg-muted text-primary inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                <WifiOff className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-foreground font-semibold">
                  Continuité de service
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Les équipes avancent sans attendre la fibre — idéal pour les
                  journées chargées.
                </p>
              </div>
            </li>
            <li className="border-border bg-background flex gap-4 rounded-2xl border p-5">
              <span className="bg-muted text-primary inline-flex size-11 shrink-0 items-center justify-center rounded-xl">
                <RefreshCw className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-foreground font-semibold">
                  Synchronisation maîtrisée
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Reprise automatique dès que la connexion est disponible — même
                  quelques minutes par jour.
                </p>
              </div>
            </li>
          </ul>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
