"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type LegacyHtmlContainerProps = {
  html: string;
};

type LegacyWindow = Window & {
  __initSkoolisApp?: () => void;
  __initSkoolisCharts?: () => void;
};

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function LegacyHtmlContainer({ html }: LegacyHtmlContainerProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      if (!href.startsWith("/app")) return;

      event.preventDefault();
      router.push(href);
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [router]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const win = window as LegacyWindow;
    // Relance l'initialisation legacy seulement après une navigation interne.
    const timeoutId = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        try {
          win.__initSkoolisApp?.();
          win.__initSkoolisCharts?.();
        } catch (error) {
          console.error("Erreur pendant la réinitialisation legacy:", error);
        }
      });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [html]);

  return (
    <div
      ref={rootRef}
      id="legacy-skoolis-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
