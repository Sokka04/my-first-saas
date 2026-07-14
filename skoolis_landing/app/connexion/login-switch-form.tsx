"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Phone } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { selectNativeClassName } from "@/components/select-native";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setMyskoolisSession } from "@/lib/myskoolis-session";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type LoginMode = "email" | "phone";

type CountryOption = {
  countryCode: string;
  dialCode: string;
  label: string;
};

const countryOptions: CountryOption[] = [
  { countryCode: "TG", dialCode: "+228", label: "Togo (+228)" },
  { countryCode: "BJ", dialCode: "+229", label: "Benin (+229)" },
  { countryCode: "CI", dialCode: "+225", label: "Côté d'Ivoire (+225)" },
  { countryCode: "SN", dialCode: "+221", label: "Senegal (+221)" },
  { countryCode: "CM", dialCode: "+237", label: "Cameroun (+237)" },
  { countryCode: "GA", dialCode: "+241", label: "Gabon (+241)" },
  { countryCode: "CD", dialCode: "+243", label: "RDC (+243)" },
  { countryCode: "FR", dialCode: "+33", label: "France (+33)" },
];

function getDefaultDialCodeFromLocale() {
  if (typeof window === "undefined") return "+228";
  const locale = window.navigator.language ?? "fr-TG";
  const countryCode = locale.split("-")[1]?.toUpperCase();
  if (!countryCode) return "+228";

  const match = countryOptions.find((option) => option.countryCode === countryCode);
  return match?.dialCode ?? "+228";
}

export function LoginSwitchForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<LoginMode>("email");
  const [dialCode, setDialCode] = useState("+228");

  const redirectTarget = useMemo(() => {
    const redirect = searchParams.get("redirect");
    if (redirect?.startsWith("/")) return redirect;
    return siteConfig.links.app;
  }, [searchParams]);

  useEffect(() => {
    setDialCode(getDefaultDialCodeFromLocale());
  }, []);

  const sliderClassName = useMemo(
    () => (mode === "email" ? "translate-x-0" : "translate-x-full"),
    [mode]
  );

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("motDePasse") ?? "").trim();

    try {
      // Simulation visuelle d'un login SaaS (le backend n'existe pas encore)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email && !formData.get("numéro")) {
        throw new Error("Veuillez remplir les identifiants.");
      }

      setMyskoolisSession({
        identifier: mode === "email" ? email : String(formData.get("numéro") || ""),
        mode,
        loggedInAt: new Date().toISOString(),
        user: { name: "Fondateur Skoolis", role: "admin" },
      });

      window.location.href = redirectTarget;
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-muted relative grid h-12 grid-cols-2 rounded-xl p-1"
        role="tablist"
        aria-label="Mode de connexion"
      >
        <span
          aria-hidden
          className={cn(
            "bg-background border-border absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-lg border shadow-sm transition-transform duration-300 ease-out",
            sliderClassName
          )}
        />
        <button
          type="button"
          role="tab"
          aria-selected={mode === "email"}
          onClick={() => setMode("email")}
          className={cn(
            "relative z-10 rounded-lg text-sm font-semibold transition-colors",
            mode === "email" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Email
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "phone"}
          onClick={() => setMode("phone")}
          className={cn(
            "relative z-10 rounded-lg text-sm font-semibold transition-colors",
            mode === "phone" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Telephone
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-medium text-center">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        {mode === "email" ? (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email
            </Label>
            <div className="relative">
              <Mail
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden
              />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nom@école.com"
                className="h-12 pl-9"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="numéro" className="text-sm font-semibold">
              Telephone
            </Label>
            <div className="flex gap-2">
              <select
                aria-label="Indicatif pays"
                value={dialCode}
                onChange={(event) => setDialCode(event.target.value)}
                className={cn(selectNativeClassName, "h-12 w-40 shrink-0")}
              >
                {countryOptions.map((option) => (
                  <option key={option.countryCode} value={option.dialCode}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="relative min-w-0 flex-1">
                <Phone
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                  aria-hidden
                />
                <Input
                  id="numéro"
                  name="numéro"
                  type="tel"
                  autoComplete="tel"
                  placeholder="70 00 00 00"
                  className="h-12 pl-9"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="mot-de-passe" className="text-sm font-semibold">
              Mot de passe
            </Label>
            <Link
              href="/contact?objet=mot-de-passe-oublie#form"
              className="text-primary text-xs font-medium underline-offset-4 hover:underline"
            >
              Mot de passe oublie ?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <Input
              id="mot-de-passe"
              name="motDePasse"
              type="password"
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              className="h-12 pl-9"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-12 w-full justify-center text-base font-semibold"
          )}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>

        <button
          type="button"
          disabled={isLoading}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "min-h-12 w-full justify-center gap-2 text-base"
          )}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.805 10.023H12v3.955h5.62c-.242 1.272-.966 2.35-2.056 3.072v2.549h3.33c1.948-1.794 3.073-4.439 3.073-7.576 0-.67-.06-1.313-.162-2z"
              fill="#4285F4"
            />
            <path
              d="M12 22c2.78 0 5.112-.92 6.816-2.5l-3.33-2.549c-.924.62-2.106.987-3.486.987-2.678 0-4.948-1.806-5.758-4.235H2.8v2.662A10 10 0 0 0 12 22z"
              fill="#34A853"
            />
            <path
              d="M6.242 13.703A5.996 5.996 0 0 1 5.92 12c0-.591.103-1.164.322-1.703V7.635H2.8A10.003 10.003 0 0 0 2 12c0 1.61.385 3.132.8 4.365l3.442-2.662z"
              fill="#FBBC05"
            />
            <path
              d="M12 6.062c1.512 0 2.868.52 3.936 1.541l2.95-2.95C17.107 2.993 14.775 2 12 2A10 10 0 0 0 2.8 7.635l3.442 2.662C7.052 7.868 9.322 6.062 12 6.062z"
              fill="#EA4335"
            />
          </svg>
          Se connecter avec Google
        </button>
      </form>
    </>
  );
}
