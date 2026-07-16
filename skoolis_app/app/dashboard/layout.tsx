import "./legacy.scss";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import Script from "next/script";

export const metadata = {
  title: 'Skoolis - Gestion Scolaire',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="legacy-app">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
        
        {/* We still load FontAwesome from local assets for the legacy app */}
        <link rel="stylesheet" href="/skolis/assets/css/all.min.css" />

        {/* Global layout for the dashboard */}
        <div className="container">
            <Sidebar />
            <main className="main-content">
                <TopHeader />
                {children}
            </main>
        </div>

        {/* Core Scripts needed by legacy pages if they are accessed inside or outside */}
        <Script src="/skolis/assets/js/chart.umd.min.js" strategy="afterInteractive" />
        <Script src="/skolis/assets/js/utils.js" strategy="afterInteractive" />
    </div>
  );
}
