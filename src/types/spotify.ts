export interface SpotifyProfile {
  id: string;
  display_name: string;
  images: { url: string; width: number; height: number }[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  external_urls: { spotify: string };
  preview_url: string | null;
}

export interface SpotifyCachedData {
  profile: SpotifyProfile;
  tracks: SpotifyTrack[];
  fetchedAt: number;
}
