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
      `https://graph.instagram.com/v21.0/me/media?fields=id,media_type,media_url,thumbnail_url,timestamp&limit=9&access_token=${token}`
    );

    if (!res.ok) {
      if (res.status === 401 || res.status === 400) {
        cookieStore.delete(COOKIE_NAME);
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Failed to fetch media" }, { status: 502 });
    }

    const data = await res.json();
    // Filter to IMAGE and CAROUSEL_ALBUM only
    const media = (data.data || []).filter(
      (item: { media_type: string }) =>
        item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM"
    );

    return NextResponse.json({ data: media });
  } catch {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
