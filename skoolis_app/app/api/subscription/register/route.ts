import { NextResponse } from "next/server";

import {
  applyIpRateLimit,
  createEmailVerificationToken,
  evaluateSignupBehavior,
  getClientIpFromHeaders,
  getImageMimeFromSignature,
  isDisposableEmail,
  isEmailValid,
  isNameValid,
  isPhoneDialValid,
  isPhoneLocalValid,
  logRegistration,
  sanitizeEmail,
  sanitizePlainText,
} from "@/lib/subscription-security";

const MIN_TIME_BEFORE_SUBMIT_MS = 3000;
const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;

type ParsedPayload = {
  lastName: string;
  firstName: string;
  email: string;
  phoneDial: string;
  phoneLocal: string;
  password: string;
  confirmPassword: string;
  recaptchaToken: string;
  honeypot: string;
  formStartedAt: string;
  mouseMoves: string;
  keyStrokes: string;
  pasteCount: string;
};

function parsePayload(formData: FormData): ParsedPayload {
  return {
    lastName: sanitizePlainText(String(formData.get("lastName") ?? "")),
    firstName: sanitizePlainText(String(formData.get("firstName") ?? "")),
    email: sanitizeEmail(String(formData.get("email") ?? "")),
    phoneDial: sanitizePlainText(String(formData.get("phoneDial") ?? "")),
    phoneLocal: sanitizePlainText(String(formData.get("phoneLocal") ?? "")),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    recaptchaToken: sanitizePlainText(String(formData.get("recaptchaToken") ?? "")),
    honeypot: String(formData.get("website") ?? ""),
    formStartedAt: String(formData.get("formStartedAt") ?? ""),
    mouseMoves: String(formData.get("mouseMoves") ?? ""),
    keyStrokes: String(formData.get("keyStrokes") ?? ""),
    pasteCount: String(formData.get("pasteCount") ?? ""),
  };
}

function validatePayload(payload: ParsedPayload) {
  if (
    !payload.lastName ||
    !payload.firstName ||
    !payload.email ||
    !payload.phoneDial ||
    !payload.phoneLocal ||
    !payload.password ||
    !payload.confirmPassword
  ) {
    return "Des champs obligatoires sont manquants.";
  }

  if (!isNameValid(payload.lastName) || !isNameValid(payload.firstName)) {
    return "Nom ou prenoms invalides.";
  }

  if (!isEmailValid(payload.email)) {
    return "Adresse email invalide.";
  }

  if (!isPhoneDialValid(payload.phoneDial) || !isPhoneLocalValid(payload.phoneLocal)) {
    return "Numéro de telephone invalide.";
  }

  if (payload.password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }

  if (payload.password !== payload.confirmPassword) {
    return "Le mot de passe et la confirmation ne correspondent pas.";
  }

  return "";
}

export async function POST(request: Request) {
  const ip = getClientIpFromHeaders(request.headers);
  const rateCheck = applyIpRateLimit(ip);
  if (!rateCheck.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Trop de tentatives depuis cette adresse IP. Réessaie plus tard.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rateCheck.retryAfterMs / 1000)) },
      }
    );
  }

  const formData = await request.formData();
  const payload = parsePayload(formData);

  if (payload.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: false, error: "Requete refusée." }, { status: 400 });
  }

  const startedAt = Number(payload.formStartedAt);
  const formDurationMs = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || formDurationMs < MIN_TIME_BEFORE_SUBMIT_MS) {
    return NextResponse.json(
      { ok: false, error: "Soumission trop rapide, vérification anti-bot en echec." },
      { status: 400 }
    );
  }

  const payloadError = validatePayload(payload);
  if (payloadError) {
    return NextResponse.json({ ok: false, error: payloadError }, { status: 400 });
  }

  const recaptchaCheck = await verifyRecaptchaToken(payload.recaptchaToken, ip);
  if (!recaptchaCheck.ok) {
    return NextResponse.json(
      { ok: false, error: recaptchaCheck.reason ?? "Vérification reCAPTCHA echouee." },
      { status: 400 }
    );
  }

  if (isDisposableEmail(payload.email)) {
    return NextResponse.json(
      { ok: false, error: "Les emails temporaires ne sont pas acceptes." },
      { status: 400 }
    );
  }

  const behavior = evaluateSignupBehavior({
    formDurationMs,
    mouseMoves: Number(payload.mouseMoves) || 0,
    keyStrokes: Number(payload.keyStrokes) || 0,
    pasteCount: Number(payload.pasteCount) || 0,
    recentIpAttempts: rateCheck.attemptsInWindow,
  });

  if (behavior.isSuspicious) {
    console.warn(`[subscription] Suspicious behavior detected for IP ${ip}:`, behavior.reasons);
  }

  const imageFile = formData.get("profilePhoto");
  if (imageFile instanceof File && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Image trop volumineuse (max 3 MB)." },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const signatureMime = getImageMimeFromSignature(bytes);
    if (!signatureMime) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Le fichier image est invalide ou potentiellement dangereux (format non autorise).",
        },
        { status: 400 }
      );
    }
  }

  const emailVerificationToken = createEmailVerificationToken(payload.email, ip);
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const verificationLink = origin
    ? `${origin}/subscription?verifyToken=${emailVerificationToken}&email=${encodeURIComponent(payload.email)}`
    : "";

  // TODO: brancher un provider email (Resend/SES/Postmark). Pour l'instant, log serveur.
  if (verificationLink) {
    console.info(`[subscription] Lien de vérification email: ${verificationLink}`);
  }

  logRegistration(ip, payload.email);

  return NextResponse.json(
    {
      ok: true,
      requiresEmailVerification: true,
      message: "Inscription enregistree. Verifie ton email pour activer le compte.",
      registrationIp: ip,
      ...(process.env.NODE_ENV !== "production"
        ? { debugVerificationLink: verificationLink, suspiciousSignals: behavior.reasons }
        : {}),
    },
    { status: 202 }
  );
}

async function verifyRecaptchaToken(token: string, ip: string) {
  if (!token) {
    return { ok: false, reason: "Vérification reCAPTCHA manquante." };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
  if (!secret) {
    return {
      ok: false,
      reason: "CAPTCHA indisponible: configure RECAPTCHA_SECRET_KEY.",
    };
  }

  const payload = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  });

  const data = (await response.json()) as { success?: boolean };
  if (!response.ok || !data.success) {
    return { ok: false, reason: "reCAPTCHA invalide. Réessaie." };
  }

  return { ok: true as const };
}
