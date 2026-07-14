"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CountryPhone = {
  code: string;
  name: string;
  dial: string;
};

type AccountState = {
  lastName: string;
  firstName: string;
  email: string;
  phoneLocal: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
};

const countryOptions: CountryPhone[] = [
  { code: "DZ", name: "Algerie", dial: "+213" },
  { code: "AO", name: "Angola", dial: "+244" },
  { code: "BJ", name: "Benin", dial: "+229" },
  { code: "BW", name: "Botswana", dial: "+267" },
  { code: "BF", name: "Burkina Faso", dial: "+226" },
  { code: "BI", name: "Burundi", dial: "+257" },
  { code: "CM", name: "Cameroun", dial: "+237" },
  { code: "CV", name: "Cap-Vert", dial: "+238" },
  { code: "CF", name: "Centrafrique", dial: "+236" },
  { code: "TD", name: "Tchad", dial: "+235" },
  { code: "KM", name: "Comores", dial: "+269" },
  { code: "CG", name: "Congo", dial: "+242" },
  { code: "CD", name: "RDC", dial: "+243" },
  { code: "CI", name: "Côté d'Ivoire", dial: "+225" },
  { code: "DJ", name: "Djibouti", dial: "+253" },
  { code: "EG", name: "Egypte", dial: "+20" },
  { code: "GQ", name: "Guinee equatoriale", dial: "+240" },
  { code: "ER", name: "Erythree", dial: "+291" },
  { code: "SZ", name: "Eswatini", dial: "+268" },
  { code: "ET", name: "Ethiopie", dial: "+251" },
  { code: "GA", name: "Gabon", dial: "+241" },
  { code: "GM", name: "Gambie", dial: "+220" },
  { code: "GH", name: "Ghana", dial: "+233" },
  { code: "GN", name: "Guinee", dial: "+224" },
  { code: "GW", name: "Guinee-Bissau", dial: "+245" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "LS", name: "Lesotho", dial: "+266" },
  { code: "LR", name: "Liberia", dial: "+231" },
  { code: "LY", name: "Libye", dial: "+218" },
  { code: "MG", name: "Madagascar", dial: "+261" },
  { code: "MW", name: "Malawi", dial: "+265" },
  { code: "ML", name: "Mali", dial: "+223" },
  { code: "MR", name: "Mauritanie", dial: "+222" },
  { code: "MU", name: "Maurice", dial: "+230" },
  { code: "MA", name: "Maroc", dial: "+212" },
  { code: "MZ", name: "Mozambique", dial: "+258" },
  { code: "NA", name: "Namibie", dial: "+264" },
  { code: "NE", name: "Niger", dial: "+227" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "RW", name: "Rwanda", dial: "+250" },
  { code: "ST", name: "Sao Tome-et-Principe", dial: "+239" },
  { code: "SN", name: "Senegal", dial: "+221" },
  { code: "SC", name: "Seychelles", dial: "+248" },
  { code: "SL", name: "Sierra Leone", dial: "+232" },
  { code: "SO", name: "Somalie", dial: "+252" },
  { code: "ZA", name: "Afrique du Sud", dial: "+27" },
  { code: "SS", name: "Soudan du Sud", dial: "+211" },
  { code: "SD", name: "Soudan", dial: "+249" },
  { code: "TZ", name: "Tanzanie", dial: "+255" },
  { code: "TG", name: "Togo", dial: "+228" },
  { code: "TN", name: "Tunisie", dial: "+216" },
  { code: "UG", name: "Ouganda", dial: "+256" },
  { code: "ZM", name: "Zambie", dial: "+260" },
  { code: "ZW", name: "Zimbabwe", dial: "+263" },
  { code: "OTHER", name: "Autres", dial: "+" },
];

const phonePlaceholdersByCountry: Partial<Record<string, string>> = {
  TG: "90 12 34 56",
  BJ: "97 12 34 56",
  SN: "77 123 45 67",
  CI: "07 01 23 45 67",
  CM: "6 71 23 45 67",
  GH: "24 123 4567",
  NG: "801 234 5678",
  FR: "06 12 34 56 78",
};

const phoneGroupingByCountry: Partial<Record<string, number[]>> = {
  TG: [2, 2, 2, 2],
  BJ: [2, 2, 2, 2],
  SN: [2, 3, 2, 2],
  CI: [2, 2, 2, 2, 2],
  CM: [1, 2, 2, 2, 2],
  GH: [2, 3, 4],
  NG: [3, 3, 4],
  FR: [2, 2, 2, 2, 2],
};

const initialAccountState: AccountState = {
  lastName: "",
  firstName: "",
  email: "",
  phoneLocal: "",
  password: "",
  confirmPassword: "",
  profilePhoto: null,
};

function getCountryCodeFromBrowserLocale() {
  if (typeof navigator === "undefined") return null;

  const locales = [navigator.language, ...(navigator.languages ?? [])].filter(Boolean);
  for (const locale of locales) {
    const match = locale.match(/[-_]([A-Za-z]{2})\b/);
    if (!match) continue;
    const regionCode = match[1].toUpperCase();
    const country = countryOptions.find((option) => option.code === regionCode);
    if (country && country.code !== "OTHER") {
      return country.code;
    }
  }

  return null;
}

export function SubscriptionAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [debugVerificationLink, setDebugVerificationLink] = useState("");
  const [mouseMoves, setMouseMoves] = useState(0);
  const [keyStrokes, setKeyStrokes] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [selectedCountryCode, setSelectedCountryCode] = useState("TG");
  const [customDialCode, setCustomDialCode] = useState("+228");
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [account, setAccount] = useState<AccountState>(initialAccountState);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const detectedCountryCode = getCountryCodeFromBrowserLocale();
      if (!detectedCountryCode) return;
      const detectedCountry = countryOptions.find((country) => country.code === detectedCountryCode);
      if (!detectedCountry) return;
      setSelectedCountryCode(detectedCountry.code);
      setCustomDialCode(detectedCountry.dial);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const verifyToken = searchParams.get("verifyToken");
    const email = searchParams.get("email");
    if (!verifyToken || !email) return;

    let cancelled = false;

    async function verifyEmailFromLink() {
      setIsVerifyingEmail(true);
      setError("");
      setNotice("");
      try {
        const response = await fetch("/api/subscription/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: verifyToken, email }),
        });
        const data = (await response.json()) as { ok?: boolean; error?: string };

        if (!response.ok || !data.ok) {
          if (!cancelled) {
            setError(data.error ?? "Impossible de verifier cet email.");
          }
          return;
        }

        if (!cancelled) {
          setNotice("Email verifie. Redirection vers Profile MySkoolis...");
          router.push("/register-app");
        }
      } catch {
        if (!cancelled) {
          setError("Erreur reseau pendant la vérification email.");
        }
      } finally {
        if (!cancelled) {
          setIsVerifyingEmail(false);
        }
      }
    }

    verifyEmailFromLink();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  // reCAPTCHA is used instead of local math challenge

  const selectedCountry = useMemo(
    () => countryOptions.find((country) => country.code === selectedCountryCode) ?? countryOptions[0],
    [selectedCountryCode]
  );
  const selectedDialCode = customDialCode;
  const phonePlaceholder =
    phonePlaceholdersByCountry[selectedCountryCode] ??
    (selectedCountryCode === "OTHER" ? "Numéro local" : "12 34 56 78");

  const passwordChecks = useMemo(() => {
    const value = account.password;
    const checks = [
      { label: "8 caractères minimum", valid: value.length >= 8 },
      { label: "Au moins une majuscule", valid: /[A-Z]/.test(value) },
      { label: "Au moins une minuscule", valid: /[a-z]/.test(value) },
      { label: "Au moins un chiffre", valid: /\d/.test(value) },
      { label: "Au moins un caractere special", valid: /[^A-Za-z0-9]/.test(value) },
    ];
    const score = checks.filter((item) => item.valid).length;
    return { checks, score };
  }, [account.password]);

  const passwordLevel = useMemo(() => {
    if (passwordChecks.score <= 2) return { label: "Faible", tone: "text-destructive" };
    if (passwordChecks.score <= 3) return { label: "Moyen", tone: "text-amber-500" };
    if (passwordChecks.score <= 4) return { label: "Fort", tone: "text-emerald-600" };
    return { label: "Très fort", tone: "text-emerald-700" };
  }, [passwordChecks.score]);

  function normalizeValue(value: string) {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const filteredCountries = useMemo(() => {
    const query = normalizeValue(countrySearch);
    if (!query) return countryOptions;
    return countryOptions.filter((country) => {
      const normalizedName = normalizeValue(country.name);
      const normalizedCode = country.code.toLowerCase();
      const normalizedDial = country.dial.replace(/\s/g, "");
      return (
        normalizedName.includes(query) ||
        normalizedCode.includes(query) ||
        normalizedDial.includes(query)
      );
    });
  }, [countrySearch]);

  function getFlagUrl(code: string) {
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  }

  function renderCountryFlag(countryCode: string, countryName: string) {
    if (countryCode === "OTHER") {
      return (
        <span className="border-border/70 bg-muted text-muted-foreground inline-flex h-6 w-9 items-center justify-center rounded-md border p-0.5 text-[10px] shadow-sm">
          --
        </span>
      );
    }

    return (
      <span className="border-border/70 inline-flex h-6 w-9 items-center justify-center rounded-md border bg-white p-0.5 shadow-sm">
        <img
          src={getFlagUrl(countryCode)}
          alt={`Drapeau ${countryName}`}
          className="h-full w-full rounded-[3px] object-cover"
        />
      </span>
    );
  }

  function updateAccount<K extends keyof AccountState>(key: K, value: AccountState[K]) {
    setAccount((prev) => ({ ...prev, [key]: value }));
  }

  function onCustomDialCodeChange(value: string) {
    setCustomDialCode(value);
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly) {
      setSelectedCountryCode("OTHER");
      return;
    }

    const normalizedDial = `+${digitsOnly}`;
    const match = countryOptions.find(
      (country) => country.code !== "OTHER" && country.dial === normalizedDial
    );
    if (!match) {
      setSelectedCountryCode("OTHER");
      return;
    }

    setSelectedCountryCode(match.code);
    setIsCountryListOpen(false);
  }

  function formatLocalPhoneInput(value: string, countryCode: string) {
    const digits = value.replace(/\D/g, "");
    const groups = phoneGroupingByCountry[countryCode] ?? [2, 2, 2, 2];
    const maxDigits = groups.reduce((sum, count) => sum + count, 0);
    const limitedDigits = digits.slice(0, maxDigits);

    let cursor = 0;
    const parts: string[] = [];
    for (const size of groups) {
      if (cursor >= limitedDigits.length) break;
      const part = limitedDigits.slice(cursor, cursor + size);
      parts.push(part);
      cursor += size;
    }
    return parts.join(" ");
  }

  function onPhoneLocalChange(value: string) {
    const formatted = formatLocalPhoneInput(value, selectedCountryCode);
    updateAccount("phoneLocal", formatted);
  }

  function validateAccount() {
    if (
      !account.lastName ||
      !account.firstName ||
      !account.email ||
      !account.phoneLocal ||
      !account.password ||
      !account.confirmPassword
    ) {
      return "Renseigne tous les champs obligatoires du compte mySkoolis.";
    }
    if (selectedCountryCode === "OTHER" && (!customDialCode || customDialCode.length < 2)) {
      return "Renseigne un indicatif valide pour l'option Autres.";
    }
    if (account.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (account.password !== account.confirmPassword) {
      return "Le mot de passe et sa confirmation ne correspondent pas.";
    }
    return "";
  }

  // No longer needed

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateAccount();
    if (message) {
      setError(message);
      return;
    }
    setIsSubmitting(true);
    setError("");
    setNotice("");

    // Create FormData before async call to preserve references
    const formData = new FormData(event.currentTarget);

    try {
      const token = await recaptchaRef.current?.executeAsync();
      if (!token) {
        setError("Validation anti-bot annulee ou echouee.");
        setIsSubmitting(false);
        return;
      }

      formData.set("lastName", account.lastName);
      formData.set("firstName", account.firstName);
      formData.set("email", account.email);
      formData.set("phoneDial", selectedDialCode);
      formData.set("phoneLocal", account.phoneLocal);
      formData.set("password", account.password);
      formData.set("confirmPassword", account.confirmPassword);
      formData.set("recaptchaToken", token);
      formData.set("formStartedAt", String(formStartedAt));
      formData.set("mouseMoves", String(mouseMoves));
      formData.set("keyStrokes", String(keyStrokes));
      formData.set("pasteCount", String(pasteCount));
      formData.set("website", "");
      if (account.profilePhoto) {
        formData.set("profilePhoto", account.profilePhoto);
      }

      const response = await fetch("/api/subscription/register", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        requiresEmailVerification?: boolean;
        debugVerificationLink?: string;
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Inscription refusée.");
        recaptchaRef.current?.reset();
        return;
      }

      setNotice("Inscription réussie. Verifie ton email pour activer ton accès.");
      if (data.debugVerificationLink) {
        setDebugVerificationLink(data.debugVerificationLink);
      } else {
        setDebugVerificationLink("");
      }
      if (!data.requiresEmailVerification) {
        router.push("/register-app");
      }
    } catch {
      setError("Erreur reseau pendant l'inscription. Réessaie.");
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border-border bg-card rounded-2xl border p-6 sm:p-8">
      <form
        className="space-y-5"
        onSubmit={onSubmit}
        autoComplete="on"
        onMouseMove={() => setMouseMoves((prev) => prev + 1)}
        onKeyDown={() => setKeyStrokes((prev) => prev + 1)}
        onPaste={() => setPasteCount((prev) => prev + 1)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénoms</Label>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              className="h-11"
              value={account.firstName}
              onChange={(event) => updateAccount("firstName", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              className="h-11"
              value={account.lastName}
              onChange={(event) => updateAccount("lastName", event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="h-11"
            value={account.email}
            onChange={(event) => updateAccount("email", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Numéro de telephone</Label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCountryListOpen((prev) => !prev)}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm focus-visible:ring-[3px] focus-visible:outline-none"
            >
              <span className="flex items-center gap-2">
                {renderCountryFlag(selectedCountry.code, selectedCountry.name)}
                <span className="text-foreground">
                  {selectedCountry.name} ({selectedDialCode})
                </span>
              </span>
              <ChevronDown className="text-muted-foreground size-4" />
            </button>

            {isCountryListOpen ? (
              <div className="border-border bg-card absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border p-1.5 shadow-lg">
                <div className="bg-card sticky top-0 z-10 pb-1.5">
                  <Input
                    aria-label="Rechercher un pays"
                    className="h-9"
                    placeholder="Rechercher un pays, code ou indicatif"
                    value={countrySearch}
                    onChange={(event) => setCountrySearch(event.target.value)}
                  />
                </div>
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountryCode(country.code);
                      setCustomDialCode(country.dial);
                      setCountrySearch("");
                      setIsCountryListOpen(false);
                    }}
                    className="hover:bg-muted focus-visible:ring-ring flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      {renderCountryFlag(country.code, country.name)}
                      <span>{country.name}</span>
                    </span>
                    <span className="text-muted-foreground">{country.dial}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountryCode("OTHER");
                      setCountrySearch("");
                      setIsCountryListOpen(false);
                    }}
                    className="hover:bg-muted focus-visible:ring-ring mt-1 flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm focus-visible:ring-[3px] focus-visible:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      {renderCountryFlag("OTHER", "Autres")}
                      <span>Autres</span>
                    </span>
                    <span className="text-muted-foreground">{customDialCode || "+"}</span>
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Input
              aria-label="Indicatif personnalise"
              name="phoneDial"
              autoComplete="tel-country-code"
              className="h-11 w-28"
              placeholder="+999"
              value={customDialCode}
              onChange={(event) => onCustomDialCodeChange(event.target.value)}
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              className="h-11 flex-1"
              placeholder={phonePlaceholder}
              value={account.phoneLocal}
              onChange={(event) => onPhoneLocalChange(event.target.value)}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Indicatif selectionne : {selectedDialCode}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="h-11"
              value={account.password}
              onChange={(event) => updateAccount("password", event.target.value)}
            />
            <div className="mt-2 space-y-2">
              <p className={`text-xs font-medium ${passwordLevel.tone}`}>
                Niveau du mot de passe : {passwordLevel.label}
              </p>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full ${index < passwordChecks.score ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <ul className="space-y-1">
                {passwordChecks.checks.map((check) => (
                  <li
                    key={check.label}
                    className={`text-xs ${check.valid ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {check.valid ? "OK" : "--"} {check.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="h-11"
              value={account.confirmPassword}
              onChange={(event) => updateAccount("confirmPassword", event.target.value)}
            />
          </div>
        </div>

        <div className="hidden" aria-hidden="true">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
            onChange={() => {
              // Champ leurre anti-bot: doit rester vide.
            }}
          />
        </div>

        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
        />

        <div className="space-y-2">
          <Label htmlFor="profilePhoto">Photo de profil (optionnel)</Label>
          <Input
            id="profilePhoto"
            type="file"
            accept="image/*"
            className="h-11"
            onChange={(event) =>
              updateAccount("profilePhoto", event.target.files?.[0] ?? null)
            }
          />
          {account.profilePhoto ? (
            <p className="text-muted-foreground text-xs">
              Fichier selectionne : {account.profilePhoto.name}
            </p>
          ) : null}
        </div>

        {isVerifyingEmail ? (
          <p className="text-muted-foreground text-sm font-medium">Vérification de ton email...</p>
        ) : null}
        {notice ? <p className="text-emerald-700 text-sm font-medium">{notice}</p> : null}
        {error ? <p className="text-destructive text-sm font-medium">{error}</p> : null}
        {debugVerificationLink ? (
          <a
            href={debugVerificationLink}
            className="text-primary text-sm underline underline-offset-4"
          >
            Ouvrir le lien de vérification (mode dev)
          </a>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="min-h-12 w-full text-base font-semibold"
          disabled={isSubmitting || isVerifyingEmail}
        >
          {isSubmitting ? "Vérification en cours..." : "Créer mon compte"}
        </Button>
      </form>
    </section>
  );
}
