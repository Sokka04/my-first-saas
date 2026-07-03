import { getLegacyDocument } from "@/lib/skolis-legacy";
import { LegacyHtmlContainer } from "./legacy-html-container";
import Script from "next/script";

type SkolisLegacyPageProps = {
  slug?: string;
};

export async function SkolisLegacyPage({ slug }: SkolisLegacyPageProps) {
  const legacyDoc = await getLegacyDocument(slug);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      {legacyDoc.styles.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {legacyDoc.scripts.map((script) => (
        <Script
          key={script.src}
          src={script.src}
          strategy="afterInteractive"
        />
      ))}
      <LegacyHtmlContainer html={legacyDoc.bodyHtml} />
    </>
  );
}
