"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Camera, RefreshCw, X, Loader2 } from "lucide-react";
import Image from "next/image";
import type { InstagramProfile, InstagramMedia, InstagramCachedData } from "@/types/instagram";
import { getInstagramData, saveInstagramData, clearInstagramData } from "@/lib/instagram-storage";

export default function InstagramConnect() {
  const t = useTranslations("instagram");
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstagramData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, mediaRes] = await Promise.all([
        fetch("/api/instagram/profile"),
        fetch("/api/instagram/media"),
      ]);

      if (profileRes.status === 401 || mediaRes.status === 401) {
        clearInstagramData();
        setProfile(null);
        setMedia([]);
        setError(t("tokenExpired"));
        setLoading(false);
        return;
      }

      if (!profileRes.ok || !mediaRes.ok) {
        setError(t("fetchError"));
        setLoading(false);
        return;
      }

      const profileData: InstagramProfile = await profileRes.json();
      const mediaData = await mediaRes.json();
      const mediaItems: InstagramMedia[] = mediaData.data || [];

      setProfile(profileData);
      setMedia(mediaItems);

      const cached: InstagramCachedData = {
        profile: profileData,
        media: mediaItems,
        fetchedAt: Date.now(),
      };
      saveInstagramData(cached);
    } catch {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // On mount: check URL params and load cached data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const igStatus = params.get("instagram");

    // Clean up URL params
    if (igStatus) {
      const url = new URL(window.location.href);
      url.searchParams.delete("instagram");
      window.history.replaceState({}, "", url.pathname + url.search);
    }

    if (igStatus === "error") {
      setError(t("connectionError"));
      return;
    }

    if (igStatus === "connected") {
      fetchInstagramData();
      return;
    }

    // Try loading from cache
    const cached = getInstagramData();
    if (cached) {
      setProfile(cached.profile);
      setMedia(cached.media);
    }
  }, [fetchInstagramData, t]);

  const handleConnect = () => {
    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const redirectUri = `${appUrl}/api/instagram/callback`;
    const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=instagram_business_basic`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    await fetch("/api/instagram/disconnect", { method: "POST" });
    clearInstagramData();
    setProfile(null);
    setMedia([]);
    setError(null);
  };

  const handleRefresh = () => {
    fetchInstagramData();
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
            background: "linear-gradient(135deg, rgba(131,58,180,0.15) 0%, rgba(193,53,132,0.15) 40%, rgba(252,175,69,0.15) 100%)",
            border: "1px solid rgba(193,53,132,0.3)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #833ab4 0%, #c13584 40%, #fcaf45 100%)",
            }}
          >
            <Camera size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-white">{t("connectInstagram")}</p>
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
        <Loader2 size={24} className="text-purple-400 animate-spin" />
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
        {profile?.profile_picture_url ? (
          <Image
            src={profile.profile_picture_url}
            alt={profile.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #833ab4 0%, #c13584 40%, #fcaf45 100%)",
            }}
          >
            <Camera size={18} className="text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">@{profile?.username}</p>
          {profile?.biography && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{profile.biography}</p>
          )}
        </div>
      </div>

      {/* Photo grid */}
      {media.length > 0 ? (
        <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
          {media.slice(0, 9).map((item) => (
            <div key={item.id} className="aspect-square relative">
              <Image
                src={item.media_url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 384px) 33vw, 120px"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center py-3">{t("noPhotos")}</p>
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
