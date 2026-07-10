type MarketingPageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function MarketingPageHeader({
  title,
  description,
  className,
}: MarketingPageHeaderProps) {
  return (
    <header className={className}>
      <h1 className="text-foreground text-balance text-[1.75rem] font-semibold leading-snug tracking-tight sm:text-4xl sm:leading-tight md:text-[2.5rem]">
        {title}
      </h1>
      {description ? (
        <p className="text-muted-foreground mt-4 max-w-2xl text-pretty text-base leading-relaxed sm:mt-5 sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
