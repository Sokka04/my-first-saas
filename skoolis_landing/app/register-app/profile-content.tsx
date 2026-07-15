"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Plus, ArrowLeft } from "lucide-react";

type SubscriptionStatus = "active" | "inactive";

type SubscriptionItem = {
  id: string;
  title: string;
  period: string;
  status: SubscriptionStatus;
  activationDate: string;
  licenseKey: string;
};

const subscriptions: SubscriptionItem[] = [
  {
    id: "sub-1",
    title: "Skoolis Pro - Établissement Principal",
    period: "01 Jan 2026 - 31 Dec 2026",
    status: "active",
    activationDate: "oct. 29 2025, 16:20:45 UTC",
    licenseKey: "SKL2026-9A18CD9F-A54E-4322-93F9-BAB6F036411F",
  },
  {
    id: "sub-2",
    title: "Skoolis Starter - Campus Test",
    period: "01 Jan 2025 - 31 Dec 2025",
    status: "inactive",
    activationDate: "jan. 02 2025, 09:10:12 UTC",
    licenseKey: "SKL2025-1B73A4ED-7BA1-4221-8F5C-C58A2BC0EF9D",
  },
];

export function ProfileContent() {
  const [subscriptionFilter, setSubscriptionFilter] = useState<"all" | SubscriptionStatus>("all");
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(subscriptions[0]?.id ?? null);
  const [commentsBySubscription, setCommentsBySubscription] = useState<Record<string, string[]>>({});
  const [draftCommentBySubscription, setDraftCommentBySubscription] = useState<Record<string, string>>({});
  const [copyMessageBySubscription, setCopyMessageBySubscription] = useState<Record<string, string>>({});

  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "B4SY1C",
      name: "Starter",
      price: "15 000",
      currency: "FCFA",
      period: "/ an",
      description: "Idéal pour débuter la gestion de votre école.",
      features: ["Jusqu'à 100 élèves", "Notes basiques", "Support email"],
      popular: false,
    },
    {
      id: "PYL8U5",
      name: "Growth",
      price: "45 000",
      currency: "FCFA",
      period: "/ an",
      description: "Pour les établissements en croissance.",
      features: ["Élèves illimités", "Portail parents", "Support prioritaire"],
      popular: true,
    },
    {
      id: "P4R5YO",
      name: "Scale",
      price: "90 000",
      currency: "FCFA",
      period: "/ an",
      description: "Pour les grands groupes scolaires.",
      features: ["Multi-campus", "API", "Marque blanche"],
      popular: false,
    },
  ];

  const activeCount = useMemo(
    () => subscriptions.filter((subscription) => subscription.status === "active").length,
    []
  );
  const inactiveCount = useMemo(
    () => subscriptions.filter((subscription) => subscription.status === "inactive").length,
    []
  );

  const filteredSubscriptions = useMemo(() => {
    if (subscriptionFilter === "all") return subscriptions;
    return subscriptions.filter((subscription) => subscription.status === subscriptionFilter);
  }, [subscriptionFilter]);

  function handleCopyActivationCode(subscription: SubscriptionItem) {
    navigator.clipboard
      .writeText(subscription.licenseKey)
      .then(() => {
        setCopyMessageBySubscription((prev) => ({
          ...prev,
          [subscription.id]: "Code copie.",
        }));
      })
      .catch(() => {
        setCopyMessageBySubscription((prev) => ({
          ...prev,
          [subscription.id]: "Impossible de copier automatiquement.",
        }));
      });
  }

  function handleAddComment(subscriptionId: string) {
    const draft = (draftCommentBySubscription[subscriptionId] ?? "").trim();
    if (!draft) return;

    setCommentsBySubscription((prev) => ({
      ...prev,
      [subscriptionId]: [...(prev[subscriptionId] ?? []), draft],
    }));

    setDraftCommentBySubscription((prev) => ({
      ...prev,
      [subscriptionId]: "",
    }));
  }

  return (
    <div className="mt-10 space-y-6">
      <section className="border-border bg-card rounded-2xl border p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-foreground text-xl font-semibold">Écoles et Abonnements</h2>
          {!isAddingSchool && (
            <Button onClick={() => setIsAddingSchool(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une école
            </Button>
          )}
        </div>

        {isAddingSchool ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button variant="ghost" onClick={() => setIsAddingSchool(false)} className="mb-6 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux abonnements
            </Button>
            
            <div className="space-y-4 mb-8 max-w-md">
              <Label htmlFor="schoolName" className="text-base">Nom de l'établissement</Label>
              <Input
                id="schoolName"
                placeholder="Ex: Complexe Scolaire Les Élites"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative flex flex-col p-6 rounded-2xl transition-all cursor-pointer border-2 bg-background ${
                    selectedPlan === plan.id
                      ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                      : plan.popular && selectedPlan === null
                      ? "border-primary/50 shadow-md scale-100"
                      : "border-border hover:border-primary/30 hover:scale-[1.01]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 inset-x-0 mx-auto w-fit">
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full flex items-center shadow-sm">
                        <Sparkles className="w-3 h-3 mr-1" /> Recommandé
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground h-10">{plan.description}</p>
                  <div className="mb-4 flex items-baseline">
                    <span className="text-2xl font-extrabold">{plan.price}</span>
                    <span className="text-sm font-medium ml-1 text-muted-foreground">{plan.currency}</span>
                  </div>
                  <ul className="mb-6 space-y-2 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-xs text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={selectedPlan === plan.id || plan.popular ? "default" : "outline"} className="w-full">
                    {selectedPlan === plan.id ? "Sélectionné" : "Choisir"}
                  </Button>
                </div>
              ))}
            </div>

            {selectedPlan && newSchoolName.trim().length > 2 && (
              <div className="p-6 rounded-2xl border-2 border-primary/20 bg-muted/30">
                <h3 className="text-lg font-bold mb-4">Paiement sécurisé</h3>
                <div className="p-4 border border-border rounded-xl bg-background mb-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">Intégration Stripe Elements (Mode Test)</p>
                  <div className="h-10 bg-muted/50 rounded-md border border-input flex items-center justify-center text-muted-foreground/50 text-sm mb-2">
                    Numéro de carte | MM/AA | CVC
                  </div>
                </div>
                <Button className="w-full h-12 text-base font-bold">
                  Payer et activer {plans.find(p => p.id === selectedPlan)?.price} FCFA
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={subscriptionFilter === "all" ? "default" : "outline"}
            onClick={() => setSubscriptionFilter("all")}
          >
            Tous ({subscriptions.length})
          </Button>
          <Button
            type="button"
            variant={subscriptionFilter === "active" ? "default" : "outline"}
            onClick={() => setSubscriptionFilter("active")}
          >
            Actives ({activeCount})
          </Button>
          <Button
            type="button"
            variant={subscriptionFilter === "inactive" ? "default" : "outline"}
            onClick={() => setSubscriptionFilter("inactive")}
          >
            Inactives ({inactiveCount})
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {filteredSubscriptions.map((subscription) => {
            const isOpen = selectedSubscriptionId === subscription.id;
            const comments = commentsBySubscription[subscription.id] ?? [];
            const copyMessage = copyMessageBySubscription[subscription.id] ?? "";

            return (
            <article key={subscription.id} className="border-border rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-foreground font-medium">{subscription.title}</p>
                  <p className="text-muted-foreground text-sm">{subscription.period}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      subscription.status === "active"
                        ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                        : "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {subscription.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedSubscriptionId((prev) =>
                        prev === subscription.id ? null : subscription.id
                      )
                    }
                  >
                    {isOpen ? "Masquer details" : "Voir details"}
                  </Button>
                </div>
              </div>
              {isOpen ? (
                <div className="border-border mt-4 space-y-4 rounded-lg border p-4">
                  <div>
                    <p className="text-foreground text-sm font-medium">Date d'activation :</p>
                    <p className="text-muted-foreground text-sm">{subscription.activationDate}</p>
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">Clé de la licence :</p>
                    <p className="text-muted-foreground break-all text-sm">{subscription.licenseKey}</p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyActivationCode(subscription)}
                    >
                      Copier le code d'activation
                    </Button>
                    <p className="text-muted-foreground text-xs">(pour le Service clientele)</p>
                    {copyMessage ? <p className="text-foreground text-xs">{copyMessage}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground text-sm font-medium">Commentaires :</p>
                    <Textarea
                      placeholder="Ajouter"
                      value={draftCommentBySubscription[subscription.id] ?? ""}
                      onChange={(event) =>
                        setDraftCommentBySubscription((prev) => ({
                          ...prev,
                          [subscription.id]: event.target.value,
                        }))
                      }
                    />
                    <Button type="button" size="sm" onClick={() => handleAddComment(subscription.id)}>
                      Ajouter
                    </Button>
                    {comments.length > 0 ? (
                      <ul className="space-y-1">
                        {comments.map((comment, index) => (
                          <li key={`${subscription.id}-${index}`} className="text-muted-foreground text-sm">
                            - {comment}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </article>
          )})}
        </div>
        </>
        )}
      </section>

      <section className="border-border bg-card rounded-2xl border p-6 sm:p-8">
        <h2 className="text-foreground text-xl font-semibold">Appareils</h2>
        <div className="mt-4">
          <Button type="button" size="lg">
            Ajouter un appareil
          </Button>
        </div>
        <p className="text-muted-foreground mt-4 text-sm">
          Aucun appareil n'est connecte a votre compte.
        </p>
      </section>
    </div>
  );
}
