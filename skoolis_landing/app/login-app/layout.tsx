import "../dashboard/legacy.scss";

export const metadata = {
  title: 'Connexion - Skoolis',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="legacy-app" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--bg-color)',
      padding: '20px'
    }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
        
        {/* FontAwesome */}
        <link rel="stylesheet" href="/skolis/assets/css/all.min.css" />

        {children}
    </div>
  );
}
