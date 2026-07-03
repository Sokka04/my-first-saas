import { FadeIn } from "@/components/fade-in";
import { SectionShell } from "@/components/section-shell";

const items = [
  "Données structurées par année scolaire",
  "Sauvegardes cloud planifiées",
  "Accès multi‑profils (direction, enseignants, parents)",
  "Conformité et traçabilité des actions sensibles",
];

export function TrustSection() {
  return (
    <SectionShell tight muted className="border-border border-y">
      <FadeIn>
        <p className="text-primary text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] sm:text-xs">
          Confiance & stabilité
        </p>
        <h2 className="text-foreground mt-3 text-center text-[1.5rem] font-semibold leading-snug tracking-tight sm:text-3xl sm:leading-tight">
          Pensé pour les directions qui veulent dormir tranquilles.
        </h2>
        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {items.map((text) => (
            <li
              key={text}
              className="border-border bg-background flex min-h-[3rem] items-center gap-2.5 rounded-xl border px-4 py-3 text-sm leading-snug sm:px-5"
            >
              <span
                className="text-primary bg-accent inline-flex size-[1.375rem] shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold"
                aria-hidden
              >
                ✓
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </FadeIn>
    </SectionShell>
  );
}
