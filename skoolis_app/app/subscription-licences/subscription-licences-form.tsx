"use client";

import { useMemo, useState } from "react";

import { selectNativeClassName } from "@/components/select-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  plan: string;
  maxStudents: string;
  maxTeachers: string;
  maxAdmins: string;
  maxDevices: string;
  startDate: string;
  endDate: string;
  status: string;
  licenseType: string;
  paymentMethod: string;
  paymentHistory: string;
  licenseKey: string;
  deviceSignature: string;
  confirmSubscription: boolean;
  confirmServerSecurity: boolean;
};

const initialState: FormState = {
  plan: "starter",
  maxStudents: "",
  maxTeachers: "",
  maxAdmins: "",
  maxDevices: "",
  startDate: "",
  endDate: "",
  status: "essai",
  licenseType: "annuelle",
  paymentMethod: "",
  paymentHistory: "",
  licenseKey: "",
  deviceSignature: "",
  confirmSubscription: false,
  confirmServerSecurity: false,
};

export function SubscriptionLicencesForm() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  const progress = useMemo(() => (step / 4) * 100, [step]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(currentStep: number) {
    if (currentStep === 1) {
      if (!form.plan || !form.maxStudents || !form.maxTeachers || !form.maxAdmins || !form.maxDevices) {
        return "Renseigne tous les champs du bloc Capacites.";
      }
    }

    if (currentStep === 2) {
      if (!form.startDate || !form.endDate || !form.status || !form.licenseType) {
        return "Renseigne toutes les informations de periode et statut.";
      }
    }

    if (currentStep === 3) {
      if (!form.paymentMethod || !form.licenseKey || !form.deviceSignature) {
        return "Renseigne la methode de paiement, la cle de licence et la signature machine.";
      }
    }

    if (currentStep === 4) {
      if (!form.confirmSubscription || !form.confirmServerSecurity) {
        return "Tu dois valider les deux confirmations finales.";
      }
    }

    return "";
  }

  function nextStep() {
    const stepError = validateStep(step);
    if (stepError) {
      setError(stepError);
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, 4));
  }

  function prevStep() {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const stepError = validateStep(4);
    if (stepError) {
      setError(stepError);
      return;
    }
    setDone(true);
    setError("");
  }

  if (done) {
    return (
      <div className="border-border bg-card rounded-2xl border p-8 text-center">
        <p className="text-foreground text-lg font-semibold">Souscription enregistree.</p>
        <p className="text-muted-foreground mt-2 text-sm">
          La verification definitive des licences et de la securite se fera cote serveur.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted-foreground text-sm">Etape {step} sur 4</p>
      </div>

      {step === 1 ? (
        <section className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <h2 className="text-foreground text-xl font-semibold">1. Capacites et plan</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan">Plan choisi</Label>
              <select
                id="plan"
                name="plan"
                value={form.plan}
                onChange={(event) => updateField("plan", event.target.value)}
                className={selectNativeClassName}
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDevices">Nombre d'appareils autorises</Label>
              <Input
                id="maxDevices"
                type="number"
                min="1"
                className="h-11"
                value={form.maxDevices}
                onChange={(event) => updateField("maxDevices", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Nombre maximal d'eleves</Label>
              <Input
                id="maxStudents"
                type="number"
                min="0"
                className="h-11"
                value={form.maxStudents}
                onChange={(event) => updateField("maxStudents", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTeachers">Nombre maximal d'enseignants</Label>
              <Input
                id="maxTeachers"
                type="number"
                min="0"
                className="h-11"
                value={form.maxTeachers}
                onChange={(event) => updateField("maxTeachers", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAdmins">Nombre maximal d'admins</Label>
              <Input
                id="maxAdmins"
                type="number"
                min="0"
                className="h-11"
                value={form.maxAdmins}
                onChange={(event) => updateField("maxAdmins", event.target.value)}
              />
            </div>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <h2 className="text-foreground text-xl font-semibold">2. Periode et statut</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date debut abonnement</Label>
              <Input
                id="startDate"
                type="date"
                className="h-11"
                value={form.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date expiration</Label>
              <Input
                id="endDate"
                type="date"
                className="h-11"
                value={form.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className={selectNativeClassName}
              >
                <option value="actif">Actif</option>
                <option value="suspendu">Suspendu</option>
                <option value="expire">Expire</option>
                <option value="essai">Essai</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseType">Type de licence</Label>
              <select
                id="licenseType"
                value={form.licenseType}
                onChange={(event) => updateField("licenseType", event.target.value)}
                className={selectNativeClassName}
              >
                <option value="mensuelle">Mensuelle</option>
                <option value="annuelle">Annuelle</option>
                <option value="perpetuelle">Perpetuelle</option>
              </select>
            </div>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <h2 className="text-foreground text-xl font-semibold">3. Paiement et licence</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Methode de paiement</Label>
              <select
                id="paymentMethod"
                value={form.paymentMethod}
                onChange={(event) => updateField("paymentMethod", event.target.value)}
                className={selectNativeClassName}
              >
                <option value="">Selectionner</option>
                <option value="mobile-money">Mobile Money</option>
                <option value="virement">Virement bancaire</option>
                <option value="carte">Carte bancaire</option>
                <option value="especes">Especes</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseKey">Cle de licence</Label>
              <Input
                id="licenseKey"
                className="h-11"
                value={form.licenseKey}
                onChange={(event) => updateField("licenseKey", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceSignature">Signature machine/device</Label>
              <Input
                id="deviceSignature"
                className="h-11"
                value={form.deviceSignature}
                onChange={(event) => updateField("deviceSignature", event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="paymentHistory">Historique paiements</Label>
              <Textarea
                id="paymentHistory"
                placeholder="Liste des paiements et references..."
                value={form.paymentHistory}
                onChange={(event) => updateField("paymentHistory", event.target.value)}
              />
            </div>
          </div>
          <div className="border-primary/30 bg-primary/5 mt-6 rounded-xl border p-4">
            <p className="text-foreground text-sm font-semibold">Important</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Ne jamais utiliser la cle licence comme seule securite. La verification doit
              toujours se faire cote serveur.
            </p>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <h2 className="text-foreground text-xl font-semibold">4. Validation</h2>
          <div className="mt-6 space-y-3">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={form.confirmSubscription}
                onChange={(event) => updateField("confirmSubscription", event.target.checked)}
              />
              <span>Je confirme les informations d'abonnement et de licence.</span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={form.confirmServerSecurity}
                onChange={(event) => updateField("confirmServerSecurity", event.target.checked)}
              />
              <span>Je confirme que le controle des licences sera verifie cote serveur.</span>
            </label>
          </div>
        </section>
      ) : null}

      {error ? (
        <p className="text-destructive text-sm font-medium">{error}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
          Retour
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={nextStep}>
            Valider cette etape
          </Button>
        ) : (
          <Button type="submit">Creer l'abonnement</Button>
        )}
      </div>
    </form>
  );
}
