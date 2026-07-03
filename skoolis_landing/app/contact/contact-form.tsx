"use client";

import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  defaultMessage?: string;
};

export function ContactForm({ defaultMessage = "" }: ContactFormProps) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    /* Branchement futur : endpoint API ou service mail. */
  }

  return (
    <form onSubmit={onSubmit} className="border-border bg-card space-y-6 rounded-2xl border p-6 sm:p-8">
      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input id="nom" name="nom" required className="min-h-11 md:text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="em">Email</Label>
        <Input
          id="em"
          name="email"
          type="email"
          required
          className="min-h-11 md:text-base"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="msg">Message</Label>
        <Textarea
          id="msg"
          name="message"
          rows={5}
          required
          defaultValue={defaultMessage}
          className="min-h-[140px] md:text-base"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="min-h-12 w-full justify-center text-base font-semibold"
      >
        Envoyer
      </Button>
      <p className="text-muted-foreground text-center text-xs">
        Réponse plus rapide sur{" "}
        <a
          href={siteConfig.links.whatsapp}
          className="text-primary font-medium underline-offset-4 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        .
      </p>
    </form>
  );
}
