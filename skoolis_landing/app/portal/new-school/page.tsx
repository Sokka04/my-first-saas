"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewSchoolPage() {
  const [schoolName, setSchoolName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "B4SY1C",
      name: "Starter",
      price: "15 000",
      currency: "FCFA",
      period: "/ an",
      description: "L'essentiel pour démarrer la gestion de votre petite école.",
      features: ["Jusqu'à 100 élèves", "Gestion des notes basique", "Support par email", "1 administrateur"],
      popular: false,
    },
    {
      id: "PYL8U5",
      name: "Growth",
      price: "45 000",
      currency: "FCFA",
      period: "/ an",
      description: "Pour les établissements en croissance avec des besoins avancés.",
      features: ["Élèves illimités", "Bulletins automatisés", "Portail parents", "Support prioritaire", "5 administrateurs"],
      popular: true, // This one is highlighted
    },
    {
      id: "P4R5YO",
      name: "Scale",
      price: "90 000",
      currency: "FCFA",
      period: "/ an",
      description: "La solution complète pour les grands groupes scolaires.",
      features: ["Multi-campus", "API d'intégration", "Marque blanche", "Support téléphonique 24/7", "Administrateurs illimités"],
      popular: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
      <div className="mb-8">
        <Link href="/portal" className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Ajouter un établissement</h1>
        <p className="text-muted-foreground text-lg">
          Créez votre école et choisissez l'offre qui correspond le mieux à vos besoins.
        </p>
      </div>

      {/* Step 1: School Name */}
      <div className="max-w-md mx-auto mb-16 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName" className="text-base">Nom de l'établissement</Label>
            <Input
              id="schoolName"
              placeholder="Ex: Complexe Scolaire Les Élites"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Pricing Cards */}
      <div className="relative">
        {/* Subtle background glow for the pricing section */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl opacity-50"></div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col p-8 rounded-3xl transition-all cursor-pointer border-2 bg-card ${
                selectedPlan === plan.id
                  ? "border-primary shadow-[0_0_2rem_-0.5rem_oklch(0.5_0.27_298)] scale-[1.02] md:-translate-y-2"
                  : plan.popular && selectedPlan === null
                  ? "border-primary/50 shadow-lg scale-100"
                  : "border-border hover:border-primary/30 hover:scale-[1.01]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 inset-x-0 mx-auto w-fit">
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center shadow-sm">
                    <Sparkles className="w-3 h-3 mr-1" /> Recommandé
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground h-10">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline text-foreground">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-lg font-medium ml-1 text-muted-foreground">{plan.currency}</span>
                <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-muted-foreground">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={selectedPlan === plan.id || plan.popular ? "default" : "outline"}
                className={`w-full py-6 text-base font-semibold ${selectedPlan === plan.id ? "bg-primary text-primary-foreground" : ""}`}
              >
                {selectedPlan === plan.id ? "Plan Sélectionné" : "Choisir ce plan"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Payment (Mocked for now) */}
      {selectedPlan && schoolName.trim().length > 2 && (
        <div className="max-w-2xl mx-auto mt-20 p-8 rounded-3xl border-2 border-primary/20 bg-card/50 shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold mb-6 text-foreground text-center">Finaliser votre commande</h3>
          
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-medium text-foreground">{schoolName}</p>
                <p className="text-sm text-muted-foreground">Licence: {plans.find(p => p.id === selectedPlan)?.name} (1 an)</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-foreground">{plans.find(p => p.id === selectedPlan)?.price} FCFA</p>
              </div>
            </div>

            {/* Fake Stripe Integration Zone */}
            <div className="p-6 border border-border rounded-xl bg-background">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Module de paiement sécurisé (Stripe Elements)
              </p>
              
              <div className="space-y-4">
                <div className="h-12 bg-muted/50 rounded-md border border-input flex items-center px-3 text-muted-foreground/50 text-sm">
                  Numéro de carte
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-muted/50 rounded-md border border-input flex items-center px-3 text-muted-foreground/50 text-sm">
                    MM/AA
                  </div>
                  <div className="h-12 bg-muted/50 rounded-md border border-input flex items-center px-3 text-muted-foreground/50 text-sm">
                    CVC
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              Payer et Activer {plans.find(p => p.id === selectedPlan)?.price} FCFA
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Paiement sécurisé. Votre licence sera générée instantanément.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
