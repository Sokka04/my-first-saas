import type { Metadata } from "next";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { ContactForm } from "./contact-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Skoolis : WhatsApp, email, téléphone, formulaire — support humain.",
};

type PageProps = {
  searchParams: Promise<{ objet?: string }>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const { objet } = await searchParams;
  const defaultMessage =
    objet === "devis-groupe"
      ? "Bonjour, je souhaite un devis pour un groupe scolaire : "
      : "";

  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Contact"
        description="Support humain — pas de chatbot générique."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card className="shadow-none">
          <CardContent className="pt-8 pb-8">
            <MessageCircle className="text-primary mb-3 size-8" aria-hidden />
            <h2 className="text-foreground font-semibold">WhatsApp</h2>
            <a
              href="https://wa.me/22870693550"
              className="text-primary mt-2 inline-block font-medium underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              +228 70 69 35 50
            </a>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="pt-8 pb-8">
            <Mail className="text-primary mb-3 size-8" aria-hidden />
            <h2 className="text-foreground font-semibold">Email</h2>
            <a
              href="mailto:Saramba.yoh4nn@outlook.com"
              className="text-primary mt-2 inline-block break-all font-medium underline-offset-4 hover:underline"
            >
              Saramba.yoh4nn@outlook.com
            </a>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="pt-8 pb-8">
            <Phone className="text-primary mb-3 size-8" aria-hidden />
            <h2 className="text-foreground font-semibold">Téléphone</h2>
            <a
              href="tel:+22879946521"
              className="text-primary mt-2 inline-block font-medium underline-offset-4 hover:underline"
            >
              +228 79 94 65 21
            </a>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12">
        <h2 className="text-foreground text-xl font-semibold">Horaires support</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Lun–Ven 8h–18h (GMT+1) — ajustez selon votre opération réelle.
        </p>
      </section>

      <section className="mt-12" id="form">
        <h2 className="text-foreground text-xl font-semibold">Formulaire</h2>
        <div className="mt-6 max-w-xl">
          <ContactForm defaultMessage={defaultMessage} />
        </div>
      </section>

      <p className="text-muted-foreground mt-10 flex items-start gap-2 text-sm">
        <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
        Localisation : à préciser (si siège / bureau).
      </p>
    </SubpageLayout>
  );
}
