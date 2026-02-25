"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MatchList from "@/components/MatchList";
import ChatView from "@/components/ChatView";
import { useSubscription } from "@/lib/subscription-context";
import type { UserProfile } from "@/types/profile";

interface MessagesViewProps {
  initialMatchId?: string | null;
  initialProfileId?: string | null;
  currentUser: UserProfile;
}

interface MatchData {
  id: string;
  score: number;
  icebreakerComment?: string | null;
  icebreakerPromptIndex?: number | null;
  messages?: { id: string; createdAt: string }[];
}

export default function MessagesView({ initialMatchId, initialProfileId, currentUser }: MessagesViewProps) {
  const { features } = useSubscription();
  const [activeMatch, setActiveMatch] = useState<{ matchId: string; profileId: string } | null>(null);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [matchDataMap, setMatchDataMap] = useState<Record<string, MatchData>>({});

  // Load match data
  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((matches: MatchData[]) => {
        const scores: Record<string, number> = {};
        const dataMap: Record<string, MatchData> = {};
        for (const m of matches) {
          scores[m.id] = m.score;
          dataMap[m.id] = m;
        }
        setMatchScores(scores);
        setMatchDataMap(dataMap);
      })
      .catch(() => {});
  }, []);

  // Compute unlocked match IDs based on conversation limit
  const unlockedMatchIds = useMemo(() => {
    const limit = features.activeConversationLimit;
    if (limit === -1) return null; // null = all unlocked
    const allMatches = Object.values(matchDataMap);
    const withMessages = allMatches
      .filter((m) => m.messages && m.messages.length > 0)
      .sort((a, b) => {
        const aTime = a.messages?.[0] ? new Date(a.messages[0].createdAt).getTime() : 0;
        const bTime = b.messages?.[0] ? new Date(b.messages[0].createdAt).getTime() : 0;
        return bTime - aTime;
      });
    const unlocked = new Set<string>();
    for (let i = 0; i < Math.min(limit, withMessages.length); i++) {
      unlocked.add(withMessages[i].id);
    }
    // Matches without messages are always accessible
    for (const m of allMatches) {
      if (!m.messages || m.messages.length === 0) unlocked.add(m.id);
    }
    return unlocked;
  }, [matchDataMap, features.activeConversationLimit]);

  // Open chat from MatchModal "Message" button
  useEffect(() => {
    if (initialMatchId && initialProfileId) {
      setActiveMatch({ matchId: initialMatchId, profileId: initialProfileId });
    }
  }, [initialMatchId, initialProfileId]);

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {activeMatch ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <ChatView
              matchId={activeMatch.matchId}
              profileId={activeMatch.profileId}
              score={matchScores[activeMatch.matchId] ?? 0}
              currentUser={currentUser}
              onBack={() => setActiveMatch(null)}
              icebreakerComment={matchDataMap[activeMatch.matchId]?.icebreakerComment}
              icebreakerPromptIndex={matchDataMap[activeMatch.matchId]?.icebreakerPromptIndex}
              locked={unlockedMatchIds !== null && !unlockedMatchIds.has(activeMatch.matchId)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <MatchList
              onSelectMatch={(matchId, profileId) =>
                setActiveMatch({ matchId, profileId })
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
