"use client";

import Link from "next/link";
import { useState } from "react";

import { siteConfig } from "@/lib/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectNativeClassName } from "@/components/select-native";

export function TrialForm() {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    /* Branchement futur : POST vers skoolis_api (Sanctum + rôles par école). */
    setDone(true);
  }

  if (done) {
    return (
      <div className="border-border bg-card rounded-2xl border p-8 text-center">
        <p className="text-foreground text-lg font-medium">
          Merci — la création de compte sera connectée à l’API prochainement.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          En attendant, vous pouvez nous écrire pour finaliser votre dossier.
        </p>
        <Link
          href={siteConfig.links.contact}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 inline-flex min-h-12 px-8 text-base font-semibold"
          )}
        >
          Contacter l’équipe
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="school">Nom de l’établissement</Label>
        <Input
          id="school"
          name="school"
          required
          placeholder="Ex. Complexe Scolaire Horizon"
          className="min-h-11 md:text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Pays</Label>
        <select
          id="country"
          name="country"
          required
          className={selectNativeClassName}
          defaultValue=""
        >
          <option value="" disabled>
            Sélectionner
          </option>
          <option value="tg">Togo</option>
          <option value="bj">Bénin</option>
          <option value="ci">Côte d’Ivoire</option>
          <option value="other">Autre</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone (WhatsApp recommandé)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+228 70 69 35 50"
          className="min-h-11 md:text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email professionnel</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="contact@école.tg"
          className="min-h-11 md:text-base"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="students">Nombre d’élèves (ordre de grandeur)</Label>
        <select
          id="students"
          name="students"
          required
          className={selectNativeClassName}
          defaultValue=""
        >
          <option value="" disabled>
            Sélectionner
          </option>
          <option value="0-100">0 – 100</option>
          <option value="100-300">100 – 300</option>
          <option value="300-800">300 – 800</option>
          <option value="800+">800+</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type d’établissement</Label>
        <select
          id="type"
          name="type"
          required
          className={selectNativeClassName}
          defaultValue=""
        >
          <option value="" disabled>
            Sélectionner
          </option>
          <option value="maternelle">Maternelle</option>
          <option value="primaire">Primaire</option>
          <option value="college">Collège</option>
          <option value="lycee">Lycée</option>
          <option value="mixte">Mixte (plusieurs cycles)</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="plan">Offre souhaitée</Label>
        <select
          id="plan"
          name="plan"
          className={selectNativeClassName}
          defaultValue="plus"
        >
          <option value="basic">Basique</option>
          <option value="plus">Plus</option>
          <option value="pro">Pro</option>
        </select>
      </div>
      <Button
        type="submit"
        size="lg"
        className="min-h-12 w-full justify-center text-base font-semibold"
      >
        Continuer
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        Déjà un compte ?{" "}
        <Link
          href={siteConfig.links.connexion}
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Connexion
        </Link>
      </p>
      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        En continuant, vous acceptez nos{" "}
        <Link
          href={siteConfig.links.conditions}
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          conditions d’utilisation
        </Link>
        .
      </p>
    </form>
  );
}
