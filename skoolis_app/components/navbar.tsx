"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, UserRound } from "lucide-react";

import { SkoolisLogo } from "@/components/skoolis-logo";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-border/80 bg-background/90 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-3 px-safe sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Skoolis — Accueil"
          className="ring-ring flex h-full shrink-0 items-center rounded-lg px-2 outline-none focus-visible:ring-[3px]"
        >
          <span aria-hidden className="inline-flex">
            <SkoolisLogo showSrOnlyLabel={false} size="nav" />
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 md:flex lg:gap-1"
          aria-label="Navigation principale"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:px-3.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={`${siteConfig.links.contact}?objet=demande-demo#form`}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "min-h-11 px-5 text-sm shadow-sm"
            )}
          >
            Demander une demo
          </Link>
          <Link
            href={siteConfig.links.app}
            aria-label="Profile"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-lg" }),
              "min-h-11 min-w-11"
            )}
          >
            <UserRound className="size-5" />
          </Link>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-lg" }),
              "min-h-11 min-w-11 shrink-0 md:hidden"
            )}
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(100vw-1.25rem,22rem)] gap-0 border-l p-0 sm:max-w-sm"
          >
            <SheetHeader className="border-border border-b px-5 py-4 text-left">
              <SheetTitle className="font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <nav
              className="flex flex-col gap-1 px-4 py-4 pb-8"
              aria-label="Navigation mobile"
            >
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "h-12 min-h-12 w-full justify-start px-4 text-base"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`${siteConfig.links.contact}?objet=demande-demo#form`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "mt-2 h-12 min-h-12 w-full justify-center text-base font-semibold"
                )}
              >
                Demander une demo
              </Link>
              <Link
                href={siteConfig.links.connexion}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-2 h-12 min-h-12 w-full justify-center gap-2 text-base font-semibold"
                )}
              >
                <UserRound className="size-5" aria-hidden />
                Connexion
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
