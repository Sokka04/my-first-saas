import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageHeader } from "@/components/marketing-page-header";
import { SubpageLayout } from "@/components/subpage-layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "FAQ Skoolis : hors-ligne, sécurité, paiements, installation, support, sauvegardes, parents, migration.",
};

export default function FaqPage() {
  return (
    <SubpageLayout maxWidth="wide" withHomeGradient>
      <MarketingPageHeader
        title="Questions fréquentes"
        description="Structuré par catégories pour le SEO — ancres stables pour partager des liens directs."
      />

      <section className="mt-14 space-y-12" aria-label="FAQ par catégorie">
        <div id="hors-ligne" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">Hors-ligne</h2>
          <div className="mt-4 space-y-4">
            <Card className="shadow-none">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-foreground font-semibold">
                  Puis-je travailler sans internet toute la journée ?
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Oui : le poste desktop conserve les opérations ; la synchronisation
                  se fait lorsque le réseau revient.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-foreground font-semibold">
                  Que se passe-t-il si la sync échoue ?
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Les données locales restent ; le système doit retenter et
                  journaliser l’erreur côté serveur pour diagnostic.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="securite" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">Sécurité</h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-foreground font-semibold">
                Comment sont protégées les données ?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                HTTPS, contrôle d’accès par rôle et par école, audit des actions
                sensibles. Voir aussi la page{" "}
                <Link
                  href="/produit"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Produit
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        <div id="paiement" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">Paiements</h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-foreground font-semibold">
                Mobile Money, virement, carte
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Modes de paiement et échelonnement : définissez votre politique
                commerciale et documentez-la ici.
              </p>
            </CardContent>
          </Card>
        </div>

        <div id="installation" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">Installation</h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-foreground font-semibold">
                Combien de temps pour déployer ?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Dépend des imports et du nombre de postes : prévoir une phase de
                migration et une validation utilisateurs.
              </p>
            </CardContent>
          </Card>
        </div>

        <div id="support" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">Support</h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-foreground font-semibold">
                Comment vous joindre ?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                <Link
                  href="/contact"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Page contact
                </Link>{" "}
                : WhatsApp, email, horaires.
              </p>
            </CardContent>
          </Card>
        </div>

        <div id="sauvegardes" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">Sauvegardes</h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-foreground font-semibold">
                À quelle fréquence ?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Serveur : sauvegardes planifiées ; stratégie de restauration
                documentée.
              </p>
            </CardContent>
          </Card>
        </div>

        <div id="parents" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">Parents</h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-foreground font-semibold">
                Que voient les parents ?
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Ce que vous autorisez : notes, absences, paiements — selon rôle
                et politique de l’établissement.
              </p>
            </CardContent>
          </Card>
        </div>

        <div id="migration" className="scroll-mt-28">
          <h2 className="text-foreground text-xl font-semibold">
            Migration données
          </h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-foreground font-semibold">
                On a déjà des fichiers Excel…
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Import itératif : mapping colonnes, contrôle qualité, reprise
                d’historique partielle ou complète.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </SubpageLayout>
  );
}
