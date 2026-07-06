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
      {legacyDoc.styles.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {legacyDoc.scripts.map((script) => (
        <Script
          key={script.src}
          id={`legacy-script-${script.src.split("/").pop()?.split("?")[0]}`}
          src={script.src}
          strategy="afterInteractive"
        />
      ))}
      <LegacyHtmlContainer html={legacyDoc.bodyHtml} />
    </>
  );
}
