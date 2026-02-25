"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, Lock } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import { sampleProfiles } from "@/data/profiles";
import { SkeletonMatchItem } from "@/components/SkeletonCard";
import { useTranslations } from "next-intl";
import { useSubscription } from "@/lib/subscription-context";

interface MatchWithLastMessage {
  id: string;
  matchedProfileId: string;
  mode: string;
  score: number;
  createdAt: string;
  messages: { id: string; content: string; senderId: string; createdAt: string }[];
}

interface MatchListProps {
  onSelectMatch: (matchId: string, profileId: string) => void;
}

export default function MatchList({ onSelectMatch }: MatchListProps) {
  const t = useTranslations('matchList');
  const { features } = useSubscription();
  const [matches, setMatches] = useState<MatchWithLastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"conversations" | "all">("all");

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Compute which matches are unlocked based on conversation limit
  // Only matches WITH messages count against the limit
  const unlockedMatchIds = useMemo(() => {
    const limit = features.activeConversationLimit;
    if (limit === -1) return null; // null = all unlocked
    const withMessages = matches
      .filter((m) => m.messages.length > 0)
      .sort((a, b) => {
        const aTime = a.messages[0] ? new Date(a.messages[0].createdAt).getTime() : 0;
        const bTime = b.messages[0] ? new Date(b.messages[0].createdAt).getTime() : 0;
        return bTime - aTime; // most recent first
      });
    const unlocked = new Set<string>();
    for (let i = 0; i < Math.min(limit, withMessages.length); i++) {
      unlocked.add(withMessages[i].id);
    }
    // Matches without messages are always accessible
    for (const m of matches) {
      if (m.messages.length === 0) unlocked.add(m.id);
    }
    return unlocked;
  }, [matches, features.activeConversationLimit]);

  const filteredMatches = filter === "conversations"
    ? matches.filter((m) => m.messages.length > 0)
    : matches;

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-5 w-28 rounded bg-white/5 animate-pulse mb-1 mx-1" />
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMatchItem key={i} />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle size={48} className="text-mode-messages/40" />
        </motion.div>
        <div className="text-center">
          <p className="text-slate-400 text-sm font-medium">{t('noMatches')}</p>
          <p className="text-slate-600 text-xs mt-1">{t('keepSwiping')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Filter toggle */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${
            filter === "all"
              ? "text-mode-messages bg-mode-messages/10"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {t('allMatches')}
        </button>
        <button
          onClick={() => setFilter("conversations")}
          className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${
            filter === "conversations"
              ? "text-mode-messages bg-mode-messages/10"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {t('conversations')}
        </button>
      </div>
      {filteredMatches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 text-xs">
            {filter === "conversations" ? t('noConversations') : t('noMatches')}
          </p>
        </div>
      )}
      {filteredMatches.map((match, i) => {
        const profile = sampleProfiles.find((p) => p.id === match.matchedProfileId);
        if (!profile) return null;

        const isLocked = unlockedMatchIds !== null && !unlockedMatchIds.has(match.id);

        const lastMsg = match.messages[0];
        const timeAgo = lastMsg
          ? getTimeAgo(new Date(lastMsg.createdAt))
          : getTimeAgo(new Date(match.createdAt));

        return (
          <motion.button
            key={match.id}
            initial={{ opacity: 0, y: 10, x: -8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => {
              if (isLocked) {
                window.dispatchEvent(new CustomEvent("open-upgrade-modal"));
              } else {
                onSelectMatch(match.id, profile.id);
              }
            }}
            className={`glass-card rounded-2xl p-3 flex items-center gap-3 text-left hover:bg-white/5 transition-all w-full ${isLocked ? "opacity-60" : ""}`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-mode-messages/30"
              />
              {/* Zodiac indicator */}
              <div className="absolute -top-1 -left-1 glass-card-strong rounded-full w-6 h-6 flex items-center justify-center text-[10px]">
                {profile.westernZodiac.symbol}
              </div>
              {isLocked ? (
                <div className="absolute -bottom-1 -right-1 glass-card-strong rounded-full w-6 h-6 flex items-center justify-center">
                  <Lock size={10} className="text-amber-400" />
                </div>
              ) : (
                <div className="absolute -bottom-1 -right-1 glass-card-strong rounded-full px-1.5 py-0.5">
                  <span className="text-[9px] font-bold text-mode-messages">{match.score}%</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">{profile.name}</span>
                {profile.isVerified && <VerifiedBadge size="sm" />}
                <span className="text-[10px] text-slate-500">
                  {profile.westernZodiac.symbol}
                </span>
                <span className="text-[8px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded-full uppercase">
                  {match.mode}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {isLocked
                  ? "Upgrade to Pro for unlimited conversations"
                  : lastMsg
                    ? lastMsg.senderId === "self"
                      ? t('youPrefix', { message: lastMsg.content })
                      : lastMsg.content
                    : t('startConversation')}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[10px] text-slate-600">{timeAgo}</span>
              {!lastMsg && !isLocked && (
                <Sparkles size={12} className="text-mode-messages" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}
