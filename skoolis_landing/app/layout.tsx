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
    default: "Skoolis - Le systeme scolaire moderne concu pour l'Afrique",
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
    title: "Skoolis - Le systeme scolaire moderne concu pour l'Afrique",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Skoolis - Le systeme scolaire moderne concu pour l'Afrique",
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
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`(() => {
  try {
    const key = "skoolis-theme";
    const savedThemeRaw = window.localStorage.getItem(key);
    let savedTheme = null;
    if (savedThemeRaw) {
      try {
        savedTheme = JSON.parse(savedThemeRaw);
      } catch {
        savedTheme = savedThemeRaw;
      }
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const cookieMatch = document.cookie.match(/(?:^|;\\s*)skoolis-theme=([^;]*)/);
    const currentCookie = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    if (currentCookie !== theme) {
      document.cookie = "skoolis-theme=" + theme + "; path=/; max-age=31536000; SameSite=Lax";
    }
  } catch {}
})();`}
        </Script>
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
