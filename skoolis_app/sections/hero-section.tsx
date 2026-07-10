import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Download,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  Wallet,
} from "lucide-react";

import { SkoolisLogo } from "@/components/skoolis-logo";
import { siteConfig } from "@/lib/site";
import { FadeIn } from "@/components/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-safe sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <FadeIn>
          <p className="text-primary mb-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] sm:text-xs">
            <span
              className="bg-primary block size-2 shrink-0 rounded-full opacity-90"
              aria-hidden
            />
            Conçu pour les écoles africaines modernes
          </p>
          <h1 className="text-foreground w-full text-pretty font-semibold tracking-tight text-[clamp(2rem,6.5vw,3.25rem)] leading-[1.13] sm:text-[clamp(2.25rem,5vw,3.25rem)] sm:leading-[1.08]">
            Une école calme,{" "}
            <span className="text-primary">sans cahiers ni chaos.</span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-base leading-relaxed sm:mt-6 sm:text-lg">
            Skoolis centralise finances, notes, bulletins, présences et parents —
            avec contrôle d’accès, historique par année scolaire et mode
            hors‑ligne pour vos équipes.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row sm:flex-wrap sm:items-stretch">
            <Link
              href={siteConfig.links.trial}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-[3rem] w-full gap-2 px-6 text-base font-semibold shadow-sm sm:min-h-12 sm:min-w-0 sm:flex-1 sm:px-8"
              )}
            >
              <span className="flex flex-1 items-center justify-center gap-2">
                Démarrer l’essai gratuit — 30 jours
                <ArrowRight className="size-5 shrink-0" aria-hidden />
              </span>
            </Link>
            <Link
              href={siteConfig.links.demo}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-border bg-background min-h-[3rem] w-full px-6 text-base sm:min-h-12 sm:w-auto sm:min-w-[11rem] sm:justify-center sm:px-8"
              )}
            >
              Voir la démo
            </Link>
            <a
              href="/download/skoolis-setup-x64.exe"
              id="download-windows-btn"
              title="Application desktop · Windows 10 / 11"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "group/download relative min-h-[3rem] w-full gap-2 overflow-hidden px-6 text-base font-semibold sm:min-h-12 sm:basis-full sm:px-8",
                "border-border bg-background/60 text-foreground hover:bg-muted/70 hover:border-primary/40 hover:shadow-md",
                "backdrop-blur-sm"
              )}
            >
              <svg
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="size-5 shrink-0 transition-transform duration-200 group-hover/download:scale-105"
              >
                <rect x="0" y="0" width="10" height="10" rx="1.5" fill="#F25022" />
                <rect x="12" y="0" width="10" height="10" rx="1.5" fill="#7FBA00" />
                <rect x="0" y="12" width="10" height="10" rx="1.5" fill="#00A4EF" />
                <rect x="12" y="12" width="10" height="10" rx="1.5" fill="#FFB900" />
              </svg>
              <span className="tracking-tight">Télécharger pour Windows</span>
              <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[0.65rem] font-medium leading-none">
                <span className="border-border rounded border px-1.5 py-0.5">x64</span>
                <span>|</span>
                <span className="border-border rounded border px-1.5 py-0.5">x86</span>
              </span>
              <Download
                className="text-muted-foreground size-5 shrink-0 transition-transform duration-200 group-hover/download:translate-y-0.5 group-hover/download:text-primary"
                aria-hidden
              />
            </a>
          </div>
          <ul className="text-muted-foreground mt-8 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
            <li className="flex items-center gap-2.5">
              <span className="text-primary bg-accent inline-flex size-[1.375rem] shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold">
                ✓
              </span>
              Sans carte bancaire
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-primary bg-accent inline-flex size-[1.375rem] shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold">
                ✓
              </span>
              Accès complet à la période d’essai
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-primary bg-accent inline-flex size-[1.375rem] shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold">
                ✓
              </span>
              Annulation en un clic
            </li>
          </ul>
          <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
            Déploiements progressifs au Togo et en sous‑région — accompagnement
            humain pour les directions.
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="border-primary/45 bg-card shadow-xs relative min-w-0 rounded-2xl border">
            <div className="border-border flex min-h-[3rem] items-center gap-2 border-b px-3 py-2.5 sm:px-4 sm:py-3">
              <span className="size-2.5 shrink-0 rounded-full bg-red-400/90 sm:size-3" aria-hidden />
              <span className="size-2.5 shrink-0 rounded-full bg-amber-400/90 sm:size-3" aria-hidden />
              <span className="size-2.5 shrink-0 rounded-full bg-emerald-400/90 sm:size-3" aria-hidden />
              <span className="text-muted-foreground ml-1 min-w-0 truncate text-[0.65rem] sm:ml-2 sm:text-xs">
                app.skoolis · Tableau de bord
              </span>
            </div>

            {/* Navigation compacte mobile : défilement horizontal */}
            <div className="border-border bg-muted/50 overflow-x-auto border-b lg:hidden">
              <div className="flex min-w-max gap-2 px-3 py-2.5">
                <span className="bg-background border-primary/25 text-primary inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium">
                  <LayoutDashboard className="size-3.5" />
                  Dashboard
                </span>
                <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs">
                  <Wallet className="size-3.5" />
                  Paiements
                </span>
                <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs">
                  <BarChart3 className="size-3.5" />
                  Notes
                </span>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
              <aside className="border-border bg-muted/40 hidden border-r p-4 lg:block">
                <SkoolisLogo showSrOnlyLabel={false} size="sm" />
                <nav className="mt-6 space-y-1 text-sm" aria-hidden>
                  <div className="bg-background border-primary/25 flex items-center gap-2 rounded-lg border px-3 py-2 font-medium">
                    <LayoutDashboard className="text-primary size-4 shrink-0" />
                    Dashboard
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2">
                    <Wallet className="size-4 shrink-0" />
                    Paiements
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2">
                    <BarChart3 className="size-4 shrink-0" />
                    Notes
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2">
                    <FileText className="size-4 shrink-0" />
                    Bulletins
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2">
                    <UserCheck className="size-4 shrink-0" />
                    Présences
                  </div>
                </nav>
              </aside>
              <div className="min-w-0 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-foreground text-base font-semibold sm:text-lg">
                      Tableau de bord
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                      Résumé du jour · synchronisation prête
                    </p>
                  </div>
                  <span className="border-border text-muted-foreground inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.65rem] font-medium sm:text-xs">
                    <ShieldCheck className="text-primary size-3.5 shrink-0" />
                    Audit activé
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3">
                  {[
                    { label: "Encaissements", value: "1 240 000", unit: "FCFA" },
                    { label: "Scolarité réglée", value: "72", unit: "%" },
                    { label: "Notes saisies", value: "186", unit: " " },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="border-border bg-background rounded-xl border p-3.5 sm:p-4"
                    >
                      <p className="text-muted-foreground text-[0.65rem] font-medium sm:text-xs">
                        {kpi.label}
                      </p>
                      <p className="text-foreground mt-1.5 text-xl font-semibold tracking-tight sm:mt-2 sm:text-2xl">
                        {kpi.value}
                        {kpi.unit.trim() ? (
                          <span className="text-muted-foreground ml-1 text-xs font-normal sm:text-sm">
                            {kpi.unit}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-border mt-5 overflow-x-auto rounded-xl border sm:mt-6">
                  <div className="min-w-[300px]">
                    <div className="text-muted-foreground grid grid-cols-4 gap-2 border-b bg-muted/30 px-3 py-2 text-[0.65rem] font-medium sm:px-4 sm:text-xs">
                      <span>Type</span>
                      <span>Élève</span>
                      <span>Montant</span>
                      <span>Statut</span>
                    </div>
                    <div className="divide-border divide-y text-xs sm:text-sm">
                      <div className="grid grid-cols-4 gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="truncate">Paiement</span>
                        <span className="text-muted-foreground truncate">
                          Élève A.
                        </span>
                        <span>25 000</span>
                        <span className="text-primary font-medium">Validé</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="truncate">Bulletin</span>
                        <span className="text-muted-foreground truncate">
                          Classe 3e
                        </span>
                        <span>PDF</span>
                        <span className="text-muted-foreground">Généré</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 text-center text-[0.65rem] leading-relaxed sm:mt-4 sm:text-xs">
                  Aperçu stylisé — remplacez par vos captures lorsqu’elles sont
                  prêtes.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
