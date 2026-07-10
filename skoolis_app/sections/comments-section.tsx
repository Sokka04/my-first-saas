"use client";

import Link from "next/link";
import { Lock, MessageSquareText } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  addPublicComment,
  getMyskoolisSession,
  getPublicComments,
  type MyskoolisSession,
  type PublicComment,
} from "@/lib/myskoolis-session";
import { cn } from "@/lib/utils";

export function CommentsSection() {
  const [session, setSession] = useState<MyskoolisSession | null>(null);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getMyskoolisSession());
    setComments(getPublicComments());
    setReady(true);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;

    const text = draft.trim();
    if (!text) return;

    const comment: PublicComment = {
      id: crypto.randomUUID(),
      author: session.identifier,
      text,
      createdAt: new Date().toISOString(),
    };

    addPublicComment(comment);
    setComments((prev) => [comment, ...prev]);
    setDraft("");
  }

  return (
    <SectionShell id="commentaires">
      <SectionHeading
        eyebrow="Commentaires"
        title="Partagez votre retour sur Skoolis."
        description="Les commentaires publics sont réservés aux comptes mySkoolis connectés."
      />

      <FadeIn>
        {!ready ? (
          <div className="mt-10 h-40 animate-pulse rounded-xl bg-muted/50" aria-hidden />
        ) : session ? (
          <div className="mt-10 space-y-6">
            <Card className="border-border shadow-none">
              <CardContent className="pt-6 pb-6">
                <p className="text-muted-foreground text-sm">
                  Connecté en tant que{" "}
                  <span className="text-foreground font-medium">{session.identifier}</span>
                </p>
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Votre commentaire sur Skoolis…"
                    rows={4}
                    className="min-h-28 resize-y text-sm"
                  />
                  <button
                    type="submit"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "min-h-11 px-6 text-sm font-semibold"
                    )}
                  >
                    Publier le commentaire
                  </button>
                </form>
              </CardContent>
            </Card>

            {comments.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <Card className="border-border h-full shadow-none">
                      <CardContent className="flex h-full flex-col gap-3 pt-5 pb-5">
                        <p className="text-foreground flex-1 text-sm leading-relaxed">
                          {comment.text}
                        </p>
                        <div className="text-muted-foreground mt-auto border-t pt-3 text-xs">
                          <p className="text-foreground font-medium">{comment.author}</p>
                          <p>
                            {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center text-sm">
                Aucun commentaire pour le moment. Soyez le premier à partager votre avis.
              </p>
            )}
          </div>
        ) : (
          <Card className="border-border mx-auto mt-10 max-w-xl shadow-none">
            <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
              <span className="bg-muted text-muted-foreground inline-flex size-11 items-center justify-center rounded-xl">
                <Lock className="size-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <p className="text-foreground flex items-center justify-center gap-2 text-base font-semibold">
                  <MessageSquareText className="text-primary size-5" aria-hidden />
                  Connexion requise
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Connectez-vous à votre compte mySkoolis pour lire et publier des commentaires.
                </p>
              </div>
              <Link
                href="/connexion?redirect=%2F%23commentaires"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "min-h-11 px-8 text-sm font-semibold"
                )}
              >
                Se connecter à mySkoolis
              </Link>
            </CardContent>
          </Card>
        )}
      </FadeIn>
    </SectionShell>
  );
}
