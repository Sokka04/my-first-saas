import { cn } from "@/lib/utils";

export const selectNativeClassName = cn(
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-lg border px-3 py-2 text-sm transition-colors",
  "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-50"
);
