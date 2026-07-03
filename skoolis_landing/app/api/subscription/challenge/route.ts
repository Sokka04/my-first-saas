import { NextResponse } from "next/server";

import { createMathChallenge, getClientIpFromHeaders } from "@/lib/subscription-security";

export async function GET(request: Request) {
  const ip = getClientIpFromHeaders(request.headers);
  const challenge = createMathChallenge(ip);
  return NextResponse.json(challenge, { status: 200 });
}
