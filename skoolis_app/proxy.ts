import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BLOCKED_LEGACY_HTML = /^\/skolis\/(index\.html|pages\/[a-z0-9-]+\.html)$/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BLOCKED_LEGACY_HTML.test(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/skolis/:path*"],
};