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

function ChartPreserver() {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ensureChartCanvas = () => {
      const placeholder = document.querySelector('#gradesChart-placeholder');
      if (placeholder && !chartCanvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.id = 'gradesChart';
        placeholder.replaceWith(canvas);
        chartCanvasRef.current = canvas;

        setTimeout(() => {
          const win = window as LegacyWindow;
          win.__initSkoolisCharts?.();
        }, 100);
      }
    };

    ensureChartCanvas();

    const observer = new MutationObserver(ensureChartCanvas);

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}

export function LegacyHtmlContainer({ html }: LegacyHtmlContainerProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);

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
    const win = window as LegacyWindow;

    const timeoutId = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        try {
          win.__initSkoolisApp?.();
        } catch (error) {
          console.error("Erreur pendant l'initialisation legacy:", error);
        }
      });
    }, 50);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [html]);

  return (
    <>
      <ChartPreserver />
      <div
        ref={rootRef}
        id="legacy-skoolis-root"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
