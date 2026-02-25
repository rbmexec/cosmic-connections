import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "instagram_token";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/v21.0/me?fields=user_id,username,profile_picture_url,biography&access_token=${token}`
    );

    if (!res.ok) {
      if (res.status === 401 || res.status === 400) {
        // Token expired — clear cookie
        cookieStore.delete(COOKIE_NAME);
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 502 });
    }

    const profile = await res.json();
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
