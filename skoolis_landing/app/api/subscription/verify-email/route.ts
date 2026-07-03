import { NextResponse } from "next/server";

import {
  consumeEmailVerificationToken,
  sanitizeEmail,
  sanitizePlainText,
} from "@/lib/subscription-security";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string; email?: string };

  const token = sanitizePlainText(String(body.token ?? ""));
  const email = sanitizeEmail(String(body.email ?? ""));

  if (!token || !email) {
    return NextResponse.json(
      { ok: false, error: "Token et email sont requis." },
      { status: 400 }
    );
  }

  const result = consumeEmailVerificationToken(token, email);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 400 });
  }

  return NextResponse.json(
    { ok: true, message: "Email verifie. Compte active." },
    { status: 200 }
  );
}
