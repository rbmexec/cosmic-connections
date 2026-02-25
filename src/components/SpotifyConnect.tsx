"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Music, RefreshCw, X, Loader2 } from "lucide-react";
import Image from "next/image";
import type { SpotifyProfile, SpotifyTrack, SpotifyCachedData } from "@/types/spotify";
import { getSpotifyData, saveSpotifyData, clearSpotifyData } from "@/lib/spotify-storage";

export default function SpotifyConnect() {
  const t = useTranslations("spotify");
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpotifyData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/spotify/tracks");

      if (res.status === 401) {
        clearSpotifyData();
        setProfile(null);
        setTracks([]);
        setError(t("tokenExpired"));
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(t("fetchError"));
        setLoading(false);
        return;
      }

      const data = await res.json();
      const profileData: SpotifyProfile = data.profile;
      const trackItems: SpotifyTrack[] = data.tracks || [];

      setProfile(profileData);
      setTracks(trackItems);

      const cached: SpotifyCachedData = {
        profile: profileData,
        tracks: trackItems,
        fetchedAt: Date.now(),
      };
      saveSpotifyData(cached);
    } catch {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // On mount: check URL params and load cached data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spStatus = params.get("spotify");

    // Clean up URL params
    if (spStatus) {
      const url = new URL(window.location.href);
      url.searchParams.delete("spotify");
      window.history.replaceState({}, "", url.pathname + url.search);
    }

    if (spStatus === "error") {
      setError(t("connectionError"));
      return;
    }

    if (spStatus === "connected") {
      fetchSpotifyData();
      return;
    }

    // Try loading from cache
    const cached = getSpotifyData();
    if (cached) {
      setProfile(cached.profile);
      setTracks(cached.tracks);
    }
  }, [fetchSpotifyData, t]);

  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/spotify/callback`;
    const scopes = "user-read-private user-top-read";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    await fetch("/api/spotify/disconnect", { method: "POST" });
    clearSpotifyData();
    setProfile(null);
    setTracks([]);
    setError(null);
  };

  const handleRefresh = () => {
    fetchSpotifyData();
  };

  // Not connected state
  if (!profile && !loading) {
    return (
      <div className="space-y-3">
        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}
        <button
          onClick={handleConnect}
          className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "rgba(29, 185, 84, 0.1)",
            border: "1px solid rgba(29, 185, 84, 0.3)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#1DB954" }}
          >
            <Music size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-white">{t("connectSpotify")}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t("connectDesc")}</p>
          </div>
        </button>
      </div>
    );
  }

  // Loading state
  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={24} className="text-green-400 animate-spin" />
      </div>
    );
  }

  // Connected state
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Profile header */}
      <div className="flex items-center gap-3">
        {profile?.images?.[0]?.url ? (
          <Image
            src={profile.images[0].url}
            alt={profile.display_name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#1DB954" }}
          >
            <Music size={18} className="text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{profile?.display_name}</p>
        </div>
      </div>

      {/* Top tracks list */}
      {tracks.length > 0 ? (
        <div className="space-y-2">
          {tracks.map((track) => (
            <a
              key={track.id}
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
            >
              {track.album.images?.[track.album.images.length - 1]?.url ? (
                <Image
                  src={track.album.images[track.album.images.length - 1].url}
                  alt={track.album.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Music size={16} className="text-slate-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{track.name}</p>
                <p className="text-[10px] text-slate-400 truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center py-3">{t("noTracks")}</p>
      )}

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {t("refresh")}
        </button>
        <button
          onClick={handleDisconnect}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-400/80 bg-red-400/5 hover:bg-red-400/10 transition-colors"
        >
          <X size={12} />
          {t("disconnect")}
        </button>
      </div>
    </motion.div>
  );
}
