import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
}

function hasValidAuthSession(request: NextRequest) {
  const rawCookie = request.cookies.get("bb_auth")?.value;
  if (!rawCookie) {
    return false;
  }

  const payload = rawCookie.split(".")[0];
  if (!payload) {
    return false;
  }

  try {
    const session = JSON.parse(decodeBase64Url(payload)) as { exp?: number };
    if (typeof session.exp !== "number") {
      return false;
    }

    return session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedRouteMatch = pathname.match(/^\/(en|zh-hant|zh-hans|ja|ko)\/checkout(?:\/|$)/);

  if (protectedRouteMatch && !hasValidAuthSession(request)) {
    const locale = protectedRouteMatch[1];
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|zh-hant|zh-hans|ja|ko)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
