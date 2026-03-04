import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { encode } from "@auth/core/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Authentication failed", { status: 401 });
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return new NextResponse("Server configuration error", { status: 500 });
  }

  // Create a short-lived one-time token to transfer the session to the WebView
  const token = await encode({
    token: {
      sub: session.user.id,
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      picture: session.user.image,
      purpose: "mobile-auth",
    },
    secret,
    salt: "mobile-auth-token",
    maxAge: 60, // 60 seconds
  });

  // Redirect to the custom URL scheme so Capacitor can intercept it
  return NextResponse.redirect(`astr://auth/callback?token=${encodeURIComponent(token)}`);
}
