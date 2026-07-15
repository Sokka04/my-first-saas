import { Metadata } from "next";
import Link from "next/link";
import { Plus, Settings, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mes Écoles | Skoolis",
  description: "Gérez vos établissements scolaires et vos licences.",
};

export default function PortalDashboardPage() {
  // Mock data pour la présentation (à remplacer par un appel API / api.get)
  const schools = [
    {
      id: "1",
      name: "Lycée Excellence de Paris",
      licenseStatus: "active",
      plan: "Scale (PRO)",
      expiresAt: "2027-09-01",
    },
    {
      id: "2",
      name: "Collège Lumière",
      licenseStatus: "expired",
      plan: "Starter (BASIC)",
      expiresAt: "2026-06-30",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mes Établissements</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos écoles, renouvelez vos licences et accédez à vos espaces d'administration.
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/portal/new-school">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une école
          </Link>
        </Button>
      </div>

      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Établissement</th>
                <th className="px-6 py-4 font-medium">Plan Actuel</th>
                <th className="px-6 py-4 font-medium">Statut de la licence</th>
                <th className="px-6 py-4 font-medium">Expiration</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {school.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {school.plan}
                  </td>
                  <td className="px-6 py-4">
                    {school.licenseStatus === "active" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                        Expirée
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(school.expiresAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {school.licenseStatus === "active" ? (
                      <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <Link href={`http://localhost:3001?school=${school.id}`}>
                          Accéder <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" asChild className="bg-primary text-primary-foreground">
                        <Link href={`/portal/renew/${school.id}`}>
                          Renouveler <RefreshCw className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}

              {schools.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Vous n'avez pas encore d'établissement. <br />
                    <Link href="/portal/new-school" className="text-primary hover:underline font-medium mt-2 inline-block">
                      Créer votre première école
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
