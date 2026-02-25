import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "instagram_token";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
  }

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}?instagram=error`);
  }

  try {
    // Exchange code for short-lived token
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: `${appUrl}/api/instagram/callback`,
        code,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${appUrl}?instagram=error`);
    }

    const tokenData = await tokenRes.json();
    const shortLivedToken: string = tokenData.access_token;

    // Exchange short-lived token for long-lived token (60 days)
    const longLivedRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${shortLivedToken}`
    );

    if (!longLivedRes.ok) {
      return NextResponse.redirect(`${appUrl}?instagram=error`);
    }

    const longLivedData = await longLivedRes.json();
    const longLivedToken: string = longLivedData.access_token;

    // Set httpOnly cookie with the long-lived token
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, longLivedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 24 * 60 * 60, // 60 days
      path: "/",
    });

    return NextResponse.redirect(`${appUrl}?instagram=connected`);
  } catch {
    return NextResponse.redirect(`${appUrl}?instagram=error`);
  }
}
