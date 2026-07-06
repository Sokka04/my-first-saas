import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

type LegacyScript = {
  src: string;
  defer: boolean;
};

type LegacyDocument = {
  bodyHtml: string;
  styles: string[];
  scripts: LegacyScript[];
};

const LEGACY_ROOT = path.join(process.cwd(), "public", "skolis");
const SLUG_PATTERN = /^[a-z0-9_-]+$/i;
const LEGACY_SCRIPT_ORDER = [
  "chart.umd.min.js",
  "utils.js",
  "charts.js",
  "app.js",
  "skoolis-core.js",
];

function sortLegacyScripts(scripts: LegacyScript[]): LegacyScript[] {
  const orderIndex = (src: string) => {
    const fileName = src.split("/").pop() ?? src;
    const index = LEGACY_SCRIPT_ORDER.indexOf(fileName);
    return index === -1 ? LEGACY_SCRIPT_ORDER.length : index;
  };

  return [...scripts].sort((a, b) => orderIndex(a.src) - orderIndex(b.src));
}

function normalizeAssetPath(rawUrl: string): string {
  if (/^(https?:)?\/\//i.test(rawUrl) || rawUrl.startsWith("#")) {
    return rawUrl;
  }

  const cleaned = rawUrl.replace(/^\.?\//, "");

  if (cleaned.startsWith("assets/") || cleaned.startsWith("../assets/")) {
    return `/skolis/${cleaned.replace(/^\.\.\//, "")}`;
  }

  return rawUrl;
}

function normalizeNavigationPath(rawUrl: string, isNestedPage: boolean): string {
  if (
    /^(https?:)?\/\//i.test(rawUrl) ||
    rawUrl.startsWith("#") ||
    rawUrl.startsWith("mailto:") ||
    rawUrl.startsWith("tel:")
  ) {
    return rawUrl;
  }

  if (rawUrl === "index.html" || rawUrl === "../index.html") {
    return "/app";
  }

  const pagesMatch = rawUrl.match(/^pages\/([a-z0-9_-]+)\.html$/i);
  if (pagesMatch) {
    return `/app/${pagesMatch[1]}`;
  }

  if (isNestedPage) {
    const nestedMatch = rawUrl.match(/^([a-z0-9_-]+)\.html$/i);
    if (nestedMatch) {
      return `/app/${nestedMatch[1]}`;
    }
  }

  return normalizeAssetPath(rawUrl);
}

function normalizeBodyHtml(html: string, isNestedPage: boolean): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch?.[1] ?? html;

  let normalized = bodyContent.replace(
    /(href|src|action)=["']([^"']+)["']/gi,
    (full, attribute, rawUrl: string) => {
      const normalizedUrl = normalizeNavigationPath(rawUrl, isNestedPage);
      return `${attribute}="${normalizedUrl}"`;
    }
  );

  // Retirer le canvas du graphique pour le gérer séparément
  normalized = normalized.replace(
    /<canvas id="gradesChart"[^>]*><\/canvas>/g,
    '<div id="gradesChart-placeholder" data-chart-placeholder="true"></div>'
  );

  return normalized;
}

function extractStyles(headHtml: string): string[] {
  const matches = headHtml.matchAll(
    /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi
  );
  return [...matches].map((match) => normalizeAssetPath(match[1]));
}

function extractScripts(headHtml: string): LegacyScript[] {
  const matches = headHtml.matchAll(/<script([^>]+)><\/script>/gi);
  const scripts: LegacyScript[] = [];

  for (const match of matches) {
    const attrs = match[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) continue;

    scripts.push({
      src: normalizeAssetPath(srcMatch[1]),
      defer: /\sdefer(\s|$)/i.test(attrs),
    });
  }

  return scripts;
}

async function readLegacyFile(absolutePath: string): Promise<string> {
  try {
    return await readFile(absolutePath, "utf-8");
  } catch {
    notFound();
  }
}

export async function getLegacyDocument(slug?: string): Promise<LegacyDocument> {
  const isRootPage = !slug;

  if (slug && !SLUG_PATTERN.test(slug)) {
    notFound();
  }

  const filePath = isRootPage
    ? path.join(LEGACY_ROOT, "index.html")
    : path.join(LEGACY_ROOT, "pages", `${slug}.html`);

  const html = await readLegacyFile(filePath);
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headHtml = headMatch?.[1] ?? "";

  return {
    bodyHtml: normalizeBodyHtml(html, !isRootPage),
    styles: extractStyles(headHtml),
    scripts: sortLegacyScripts(extractScripts(headHtml)),
  };
}
