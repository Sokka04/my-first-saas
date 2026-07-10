import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

type SubpageLayoutProps = {
  children: React.ReactNode;
  /** Étroit : texte juridique / article. Large : grilles tarifs, FAQ. */
  maxWidth?: "narrow" | "wide";
  withHomeGradient?: boolean;
  gradientClassName?: string;
  className?: string;
};

export function SubpageLayout({
  children,
  maxWidth = "narrow",
  withHomeGradient = false,
  gradientClassName,
  className,
}: SubpageLayoutProps) {
  return (
    <>
      <Navbar />
      <main
        id="contenu-principal"
        className={cn(
          "relative flex flex-1 flex-col",
          withHomeGradient
            ? "overflow-hidden bg-background [background-image:none]"
            : "subpage-surface",
          className
        )}
      >
        {withHomeGradient ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-0 h-[66vh] min-h-[34rem] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_18%,var(--background))_0%,color-mix(in_oklch,var(--primary)_13%,var(--background))_48%,var(--background)_66%)]",
              gradientClassName
            )}
          />
        ) : null}
        <div
          className={cn(
            "relative z-10 mx-auto w-full min-w-0 px-safe pt-8 pb-14 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8 lg:pt-12 lg:pb-20",
            maxWidth === "wide" ? "max-w-6xl" : "max-w-3xl"
          )}
        >
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
