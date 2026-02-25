import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "spotify_token";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
  }
  const spotifyRedirectUri = process.env.SPOTIFY_REDIRECT_URI || `${appUrl}/api/spotify/callback`;

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}?spotify=error`);
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const redirectUri = spotifyRedirectUri;

    // Exchange code for access + refresh token
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${appUrl}?spotify=error`);
    }

    const tokenData = await tokenRes.json();
    const accessToken: string = tokenData.access_token;

    // Set httpOnly cookie with the access token
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour (Spotify access tokens expire in 1h)
      path: "/",
    });

    return NextResponse.redirect(`${appUrl}?spotify=connected`);
  } catch {
    return NextResponse.redirect(`${appUrl}?spotify=error`);
  }
}
