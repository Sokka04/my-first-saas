import crypto from "node:crypto";

type ChallengeEntry = {
  answer: string;
  ip: string;
  expiresAt: number;
};

type RateLimitEntry = {
  attempts: number[];
};

type RegistrationLog = {
  at: number;
  ip: string;
  email: string;
};

type PendingEmailVerification = {
  email: string;
  ip: string;
  expiresAt: number;
};

type SignupBehaviorInput = {
  formDurationMs: number;
  mouseMoves: number;
  keyStrokes: number;
  pasteCount: number;
  recentIpAttempts: number;
};

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const EMAIL_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const challengeStore = new Map<string, ChallengeEntry>();
const rateLimitStore = new Map<string, RateLimitEntry>();
const registrationLogs: RegistrationLog[] = [];
const emailVerificationStore = new Map<string, PendingEmailVerification>();

const disposableEmailDomains = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "10minutemail.com",
  "yopmail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "dispostable.com",
]);

function now() {
  return Date.now();
}

export function getClientIpFromHeaders(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export function createMathChallenge(ip: string) {
  const left = crypto.randomInt(2, 10);
  const right = crypto.randomInt(2, 10);
  const challengeId = crypto.randomUUID();
  const answer = String(left + right);

  challengeStore.set(challengeId, {
    answer,
    ip,
    expiresAt: now() + CHALLENGE_TTL_MS,
  });

  return {
    challengeId,
    question: `${left} + ${right} = ?`,
    expiresInMs: CHALLENGE_TTL_MS,
  };
}

export function validateMathChallenge(ip: string, challengeId: string, answer: string) {
  const entry = challengeStore.get(challengeId);
  if (!entry) {
    return { ok: false, reason: "Challenge invalide ou déjà consomme." };
  }

  challengeStore.delete(challengeId);

  if (entry.expiresAt < now()) {
    return { ok: false, reason: "Challenge expire." };
  }
  if (entry.ip !== ip) {
    return { ok: false, reason: "Challenge non associe a cette adresse IP." };
  }
  if (entry.answer !== answer.trim()) {
    return { ok: false, reason: "Reponse du challenge incorrecte." };
  }

  return { ok: true as const };
}

export function applyIpRateLimit(ip: string) {
  const current = rateLimitStore.get(ip) ?? { attempts: [] };
  const minTimestamp = now() - RATE_LIMIT_WINDOW_MS;
  const freshAttempts = current.attempts.filter((timestamp) => timestamp >= minTimestamp);
  freshAttempts.push(now());
  rateLimitStore.set(ip, { attempts: freshAttempts });

  return {
    ok: freshAttempts.length <= RATE_LIMIT_MAX_ATTEMPTS,
    attemptsInWindow: freshAttempts.length,
    retryAfterMs:
      freshAttempts.length <= RATE_LIMIT_MAX_ATTEMPTS
        ? 0
        : Math.max(1, freshAttempts[0] + RATE_LIMIT_WINDOW_MS - now()),
  };
}

export function logRegistration(ip: string, email: string) {
  registrationLogs.push({
    at: now(),
    ip,
    email,
  });

  if (registrationLogs.length > 1000) {
    registrationLogs.splice(0, registrationLogs.length - 1000);
  }
}

export function sanitizePlainText(input: string) {
  return input.replace(/[<>"'`;\\]/g, "").trim();
}

export function sanitizeEmail(input: string) {
  return input.trim().toLowerCase();
}

export function isEmailValid(input: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

export function isDisposableEmail(input: string) {
  const domain = input.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return disposableEmailDomains.has(domain);
}

export function isNameValid(input: string) {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,80}$/.test(input);
}

export function isPhoneDialValid(input: string) {
  return /^\+\d{1,4}$/.test(input);
}

export function isPhoneLocalValid(input: string) {
  return /^[0-9 ]{6,20}$/.test(input);
}

export function getImageMimeFromSignature(bytes: Uint8Array) {
  if (bytes.length >= 8) {
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;
    if (isPng) return "image/png";
  }

  if (bytes.length >= 3) {
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (isJpeg) return "image/jpeg";
  }

  if (bytes.length >= 6) {
    const header = new TextDecoder().decode(bytes.slice(0, 6));
    if (header === "GIF87a" || header === "GIF89a") return "image/gif";
  }

  if (bytes.length >= 12) {
    const riff = new TextDecoder().decode(bytes.slice(0, 4));
    const webp = new TextDecoder().decode(bytes.slice(8, 12));
    if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  }

  return null;
}

export function createEmailVerificationToken(email: string, ip: string) {
  const token = crypto.randomBytes(32).toString("hex");
  emailVerificationStore.set(token, {
    email,
    ip,
    expiresAt: now() + EMAIL_TOKEN_TTL_MS,
  });
  return token;
}

export function consumeEmailVerificationToken(token: string, email: string) {
  const entry = emailVerificationStore.get(token);
  if (!entry) {
    return { ok: false, reason: "Token de vérification invalide." };
  }

  emailVerificationStore.delete(token);

  if (entry.expiresAt < now()) {
    return { ok: false, reason: "Token de vérification expire." };
  }

  if (entry.email !== email) {
    return { ok: false, reason: "Token non associe a cet email." };
  }

  return { ok: true as const };
}

export function evaluateSignupBehavior(input: SignupBehaviorInput) {
  const reasons: string[] = [];

  if (input.formDurationMs < 7000) {
    reasons.push("soumission-trop-rapide");
  }
  if (input.mouseMoves < 1) {
    reasons.push("aucun-mouvement-souris");
  }
  if (input.keyStrokes < 6) {
    reasons.push("frappe-clavier-faible");
  }
  if (input.pasteCount > 3) {
    reasons.push("copier-coller-massif");
  }
  if (input.recentIpAttempts >= 3) {
    reasons.push("multiples-tentatives-ip");
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}
