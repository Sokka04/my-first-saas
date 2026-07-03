import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-primary mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] sm:text-xs">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-foreground text-balance text-[1.6rem] font-semibold leading-snug tracking-tight sm:text-4xl sm:leading-tight lg:text-[2.5rem]">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-4 text-pretty text-base leading-relaxed sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
