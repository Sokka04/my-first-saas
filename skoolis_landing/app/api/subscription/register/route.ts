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
  confirmPassword: string;
  recaptchaToken: string;
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
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    recaptchaToken: sanitizePlainText(String(formData.get("recaptchaToken") ?? "")),
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

  const captchaCheck = await verifyRecaptchaToken(payload.recaptchaToken);
  if (!captchaCheck.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: captchaCheck.reason ?? "Vérification CAPTCHA invalide. réessayez.",
      },
      { status: 403 }
    );
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
        ? { debugVerificationLink: verificationLink }
        : {}),
    },
    { status: 202 }
  );
}

async function verifyRecaptchaToken(token: string) {
  if (!token) {
    return { ok: false, reason: "Vérification reCAPTCHA manquante." };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return {
      ok: false,
      reason: "reCAPTCHA indisponible: configure RECAPTCHA_SECRET_KEY.",
    };
  }

  const payload = new URLSearchParams({
    secret,
    response: token,
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
