"use client";

import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";

const faqs = [
  {
    q: "Est-ce que Skoolis fonctionne sans internet ?",
    a: "Oui. Le poste bureau permet de travailler hors ligne ; la synchronisation se fait lorsque la connexion est disponible.",
  },
  {
    q: "Que se passe-t-il en cas de panne d’ordinateur ?",
    a: "Vos données synchronisées sont conservées côté serveur. Vous réinstallez le poste et retrouvez le même référentiel.",
  },
  {
    q: "Faut-il être informaticien ?",
    a: "Non. L’interface est pensée pour les équipes administratives : parcours courts, libellés clairs, accompagnement au démarrage.",
  },
  {
    q: "Comment fonctionne l’essai de 30 jours ?",
    a: "Ouverture de compte en quelques minutes, sans carte bancaire. Vous testez l’offre choisie puis décidez en toute transparence.",
  },
  {
    q: "Comment sont protégées les données ?",
    a: "Hébergement sur infrastructure sécurisée, chiffrement des échanges, contrôles d’accès par rôle et sauvegardes planifiées.",
  },
];

export function FaqSection() {
  return (
    <SectionShell id="faq" muted>
      <SectionHeading
        eyebrow="FAQ"
        title="Les réponses courtes — avant d’aller plus loin."
        description="Pour le détail et le référencement, la FAQ complète reste disponible."
      />
      <FadeIn className="mx-auto mt-12 max-w-3xl">
        <Accordion className="border-border rounded-2xl border bg-card">
          {faqs.map((item, index) => (
            <AccordionItem
              key={item.q}
              value={`item-${index}`}
              className="px-4 last:border-b-0"
            >
              <AccordionTrigger className="text-foreground min-h-[3.25rem] items-start py-4 text-left text-base font-semibold hover:no-underline sm:min-h-0 sm:py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={siteConfig.links.faqFull}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "min-h-12 px-8 text-base",
            })}
          >
            Ouvrir la FAQ complète
          </Link>
          <Link
            href={siteConfig.links.contact}
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
              className: "min-h-12 px-6 text-base",
            })}
          >
            Parler à l’équipe
          </Link>
        </div>
      </FadeIn>
    </SectionShell>
  );
}
