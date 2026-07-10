import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skoolis — Application",
};

export default function AppLegacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="skoolis-legacy-shell" className="legacy-app-shell">
      {children}
    </div>
  );
}
