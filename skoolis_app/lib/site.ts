const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "/app";

export const siteConfig = {
  name: "Skoolis",
  tagline: "Le système scolaire moderne conçu pour l'Afrique",
  description:
    "Skoolis est la plateforme scolaire moderne pensée pour les écoles africaines. Elle centralise gestion, communication, suivi pédagogique et expérience parent/élève dans une interface simple et premium.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.skoolis.app",
  appUrl,
  links: {
    home: "/",
    features: "/features",
    pricing: "/pricing",
    about: "/about",
    faq: "/faq",
    contact: "/contact",
    legal: "/legal",
    trial: "/subscription",
    demo: "/demo",
    faqFull: "/faq",
    horsLigne: "/hors-ligne",
    tarifs: "/tarifs",
    modules: "/modules",
    produit: "/produit",
    connexion: "/connexion",
    app: appUrl,
    mentionsLegales: "/mentions-legales",
    confidentialite: "/confidentialite",
    conditions: "/conditions-utilisation",
    whatsapp: "https://wa.me/22870693550",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Fonctionnalités", href: "/features" },
    { label: "Tarifs", href: "/pricing" },
    { label: "À propos", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
