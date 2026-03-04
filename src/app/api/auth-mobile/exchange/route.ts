import { NextRequest, NextResponse } from "next/server";
import { encode, decode } from "@auth/core/jwt";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  // Decode the one-time mobile auth token
  let payload;
  try {
    payload = await decode({
      token: body.token,
      secret,
      salt: "mobile-auth-token",
    });
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  if (!payload || payload.purpose !== "mobile-auth" || !payload.sub) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Create a proper NextAuth session JWT (matching auth.ts JWT callback structure)
  const sessionToken = await encode({
    token: {
      sub: payload.sub,
      id: payload.id,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    },
    secret,
    salt: "authjs.session-token",
  });

  // Set the session cookie so the WebView is authenticated
  const response = NextResponse.json({ ok: true });
  const isSecure = request.nextUrl.protocol === "https:";

  response.cookies.set("authjs.session-token", sessionToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
