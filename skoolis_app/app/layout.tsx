import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";

import { siteConfig } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Skoolis - Le système scolaire moderne conçu pour l'Afrique",
    template: "%s — Skoolis",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "gestion scolaire",
    "école",
    "SaaS",
    "Afrique",
    "bulletins",
    "parents",
    "Skoolis Connect",
    "présences",
    "cloud",
  ],
  authors: [{ name: "Skoolis" }],
  creator: "Skoolis",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Skoolis - Le système scolaire moderne conçu pour l'Afrique",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Skoolis - Le système scolaire moderne conçu pour l'Afrique",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("skoolis-theme")?.value;
  const initialTheme = themeCookie === "dark" ? "dark" : undefined;

  return (
    <html
      lang="fr"
      data-theme={initialTheme}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: `body { opacity: 0; } body.theme-ready { opacity: 1; transition: opacity 0.15s ease; }` }} />
        <script
          id="theme-bootstrap"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    var key = "skoolis-theme";
    var raw = localStorage.getItem(key);
    var theme = "light";
    if (raw === "dark") theme = "dark";
    else if (raw) { try { var p = JSON.parse(raw); if (p === "dark") theme = "dark"; } catch(e) {} }
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    var cm = document.cookie.match(/(?:^|;\\s*)skoolis-theme=([^;]*)/);
    var cc = cm ? decodeURIComponent(cm[1]) : null;
    if (cc !== theme) document.cookie = "skoolis-theme=" + theme + "; path=/; max-age=31536000; SameSite=Lax";
  } catch(e) {}
  document.body ? document.body.classList.add("theme-ready") : document.addEventListener("DOMContentLoaded", function() { document.body.classList.add("theme-ready"); });
})();`
          }}
        />
      </head>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <a
          href="#contenu-principal"
          className="bg-background text-primary ring-ring focus-visible:ring-[3px] sr-only focus:not-sr-only fixed top-4 left-4 z-[100] rounded-lg px-4 py-3 text-sm font-semibold shadow-md focus-visible:outline-none"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
