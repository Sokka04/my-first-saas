import Link from "next/link";

import { SkoolisLogo } from "@/components/skoolis-logo";
import { siteConfig } from "@/lib/site";
import { Separator } from "@/components/ui/separator";

const legal = [
  { label: "Mentions légales", href: siteConfig.links.mentionsLegales },
  { label: "Confidentialité", href: siteConfig.links.confidentialite },
  { label: "Conditions", href: siteConfig.links.conditions },
];

export function Footer() {
  return (
    <footer className="border-border bg-muted/50 border-t">
      <div className="mx-auto max-w-6xl px-safe py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <p className="text-foreground">
              <span className="sr-only">Skoolis</span>
              <span aria-hidden className="inline-flex">
                <SkoolisLogo showSrOnlyLabel={false} size="lg" />
              </span>
            </p>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Plateforme scolaire moderne pour les écoles africaines : gestion,
              communication parents, suivi pédagogique et pilotage de direction dans
              une interface premium.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-12 lg:gap-x-16">
            <div className="min-w-0">
              <p className="text-foreground text-sm font-medium">Produit</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href={siteConfig.links.features}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href={siteConfig.links.pricing}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href={siteConfig.links.about}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div className="min-w-0">
              <p className="text-foreground text-sm font-medium">Ressources</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href={siteConfig.links.faqFull}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    FAQ complète
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${siteConfig.links.contact}?objet=demande-demo#form`}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    Demander une demo
                  </Link>
                </li>
                <li>
                  <Link
                    href={siteConfig.links.demo}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    Demonstration produit
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <p className="text-foreground text-sm font-medium">Légal</p>
              <ul className="mt-4 space-y-3 text-sm">
                {legal.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={siteConfig.links.legal}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-10 items-center rounded-md py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    Centre legal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © {new Date().getFullYear()} Skoolis. Tous droits réservés.
          </p>
          <p className="text-muted-foreground text-xs leading-snug sm:text-right sm:text-sm">
            Skoolis Connect — communication école‑parents incluse selon offre.
          </p>
        </div>
      </div>
    </footer>
  );
}
