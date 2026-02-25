import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const publicPaths = ["/signin", "/api/auth", "/privacy", "/terms"];

function isPublicPath(pathname: string) {
  return publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.match(new RegExp(`^/(en|es|zh|hi|ar|fr|pt|ru|ja|ko)${p}(/|$)`))
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // All API routes bypass i18n processing entirely
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Run i18n middleware first
  const response = intlMiddleware(request);

  // Skip auth check for public paths
  if (isPublicPath(pathname)) {
    return response;
  }

  // Check for auth session cookie (Auth.js v5 uses this cookie name)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    // Redirect to sign-in
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(en|es|zh|hi|ar|fr|pt|ru|ja|ko)/:path*"],
};
