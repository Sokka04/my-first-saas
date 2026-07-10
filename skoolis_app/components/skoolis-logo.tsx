import { cn } from "@/lib/utils";

const sizes = {
  sm: "w-[70px]",
  md: "w-[70px]",
  nav: "w-[70px]",
  lg: "w-[70px]",
  xl: "w-[70px]",
} as const;

type SkoolisLogoProps = {
  /** Affiche « Skoolis » pour les lecteurs d’écran ; la marque stylée est décorative. */
  showSrOnlyLabel?: boolean;
  size?: keyof typeof sizes;
  className?: string;
};

export function SkoolisLogo({
  showSrOnlyLabel = true,
  size = "md",
  className,
}: SkoolisLogoProps) {
  return (
    <>
      {showSrOnlyLabel ? <span className="sr-only">Skoolis</span> : null}
      <img
        src="/skoolis_logo.png"
        alt={showSrOnlyLabel ? "" : "Skoolis"}
        aria-hidden={showSrOnlyLabel}
        className={cn(
          "block h-auto max-w-none object-contain",
          sizes[size],
          className
        )}
        translate="no"
      />
    </>
  );
}
