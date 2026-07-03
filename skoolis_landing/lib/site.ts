const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "/app";

export const siteConfig = {
  name: "Skoolis",
  tagline: "Le systeme scolaire moderne concu pour l'Afrique",
  description:
    "Skoolis est la plateforme scolaire moderne pensee pour les ecoles africaines. Elle centralise gestion, communication, suivi pedagogique et experience parent/eleve dans une interface simple et premium.",
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
    { label: "Fonctionnalites", href: "/features" },
    { label: "Tarifs", href: "/pricing" },
    { label: "A propos", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
