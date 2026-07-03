import { cn } from "@/lib/utils";

type SectionShellProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
  muted?: boolean;
  tight?: boolean;
};

export function SectionShell({
  id,
  children,
  className,
  as: Tag = "section",
  muted,
  tight,
}: SectionShellProps) {
  return (
    <Tag
      id={id}
      className={cn(
        muted ? "bg-muted/60" : "bg-background",
        tight ? "py-[var(--section-y-tight)]" : "py-[var(--section-py)]",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-safe sm:px-6 lg:px-8">{children}</div>
    </Tag>
  );
}
