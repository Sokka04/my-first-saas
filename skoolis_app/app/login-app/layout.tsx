import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion — Skoolis",
    description: "Connectez-vous à votre espace d'administration scolaire Skoolis.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Poppins & Font Awesome — uniquement pour la page login */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            />
            {children}
        </>
    );
}
