import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|zh-hant|zh-hans|ja|ko)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
