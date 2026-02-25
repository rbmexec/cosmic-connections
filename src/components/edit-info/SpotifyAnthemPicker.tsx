"use client";

import { useState, useEffect, useCallback } from "react";
import { Music, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { SpotifyAnthem } from "@/types/profile";
import type { SpotifyTrack } from "@/types/spotify";
import { getSpotifyData } from "@/lib/spotify-storage";

interface SpotifyAnthemPickerProps {
  anthem?: SpotifyAnthem;
  onChange: (anthem: SpotifyAnthem | undefined) => void;
}

export default function SpotifyAnthemPicker({ anthem, onChange }: SpotifyAnthemPickerProps) {
  const t = useTranslations("editInfo");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const cached = getSpotifyData();
    if (cached && cached.tracks.length > 0) {
      setTracks(cached.tracks);
      setConnected(true);
    }
  }, []);

  const select = useCallback((track: SpotifyTrack) => {
    onChange({
      trackId: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      albumArt: track.album.images[0]?.url,
      previewUrl: track.preview_url || undefined,
    });
    setOpen(false);
  }, [onChange]);

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("spotifyAnthem")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
        {anthem ? (
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 w-full p-3"
          >
            {anthem.albumArt ? (
              <Image
                src={anthem.albumArt}
                alt={anthem.name}
                width={44}
                height={44}
                className="rounded-lg"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Music size={18} className="text-violet-400" />
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{anthem.name}</p>
              <p className="text-xs text-slate-400 truncate">{anthem.artist}</p>
            </div>
            <Check size={16} className="text-violet-400 shrink-0" />
          </button>
        ) : (
          <button
            onClick={() => connected && setOpen(!open)}
            className="flex items-center gap-3 w-full p-3"
          >
            <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center">
              <Music size={18} className="text-slate-500" />
            </div>
            <span className="text-sm text-slate-500">
              {connected ? t("pickAnthem") : t("noSpotify")}
            </span>
          </button>
        )}

        {open && tracks.length > 0 && (
          <div className="border-t border-white/5 max-h-60 overflow-y-auto">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => select(track)}
                className={`flex items-center gap-3 w-full p-3 hover:bg-white/5 transition-colors ${
                  anthem?.trackId === track.id ? "bg-violet-500/10" : ""
                }`}
              >
                {track.album.images[0] ? (
                  <Image
                    src={track.album.images[0].url}
                    alt={track.name}
                    width={36}
                    height={36}
                    className="rounded"
                  />
                ) : (
                  <div className="w-9 h-9 rounded bg-white/5" />
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-white truncate">{track.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
                {anthem?.trackId === track.id && (
                  <Check size={14} className="text-violet-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
