import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "spotify_token";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };

    const [profileRes, tracksRes] = await Promise.all([
      fetch("https://api.spotify.com/v1/me", { headers }),
      fetch("https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term", { headers }),
    ]);

    if (profileRes.status === 401 || tracksRes.status === 401) {
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    if (!profileRes.ok || !tracksRes.ok) {
      return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
    }

    const profile = await profileRes.json();
    const tracksData = await tracksRes.json();

    return NextResponse.json({
      profile: {
        id: profile.id,
        display_name: profile.display_name,
        images: profile.images || [],
      },
      tracks: (tracksData.items || []).map((track: Record<string, unknown>) => ({
        id: track.id,
        name: track.name,
        artists: (track.artists as { name: string }[]) || [],
        album: track.album,
        external_urls: track.external_urls,
        preview_url: track.preview_url,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}
