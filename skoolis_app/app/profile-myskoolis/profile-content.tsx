"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
    title: "Skoolis Pro - Etablissement Principal",
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
        <h2 className="text-foreground text-xl font-semibold">Abonnements disponibles</h2>

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
                    <p className="text-foreground text-sm font-medium">Cle de la licence :</p>
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
