"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Lock, Check, CheckCheck } from "lucide-react";
import { sampleProfiles } from "@/data/profiles";
import { useTranslations } from "next-intl";
import { getIcebreakers } from "@/lib/icebreakers";
import { useSubscription } from "@/lib/subscription-context";
import VerifiedBadge from "@/components/VerifiedBadge";
import VideoCallButton from "@/components/VideoCallButton";
import ConversationStarters from "@/components/ConversationStarters";
import { generateConversationStarters } from "@/lib/cosmic-conversation-starters";
import type { UserProfile } from "@/types/profile";

interface MessageData {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
}

interface ChatViewProps {
  matchId: string;
  profileId: string;
  score: number;
  currentUser: UserProfile;
  onBack: () => void;
  icebreakerComment?: string | null;
  icebreakerPromptIndex?: number | null;
  locked?: boolean;
}

function formatDayLabel(date: Date, todayLabel: string, yesterdayLabel: string): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - msgDay.getTime()) / 86400000);

  if (diffDays === 0) return todayLabel;
  if (diffDays === 1) return yesterdayLabel;
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="glass-card-strong rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-slate-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageStatus({ message, isLatest }: { message: MessageData; isLatest: boolean }) {
  if (message.readAt) {
    return <CheckCheck size={12} className="text-blue-400" />;
  }
  if (isLatest) {
    return <CheckCheck size={12} className="text-slate-500" />;
  }
  return <Check size={12} className="text-slate-500" />;
}

export default function ChatView({ matchId, profileId, score, currentUser, onBack, icebreakerComment, icebreakerPromptIndex, locked }: ChatViewProps) {
  const t = useTranslations('chat');
  const ts = useTranslations('subscription');
  const { features } = useSubscription();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typingVisible, setTypingVisible] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const profile = sampleProfiles.find((p) => p.id === profileId);
  const icebreakers = profile ? getIcebreakers(currentUser, profile) : [];
  const starters = profile ? generateConversationStarters(currentUser, profile) : [];

  const fetchMessages = useCallback(() => {
    fetch(`/api/matches/${matchId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(() => {});
  }, [matchId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Poll for new messages (auto-replies)
  useEffect(() => {
    const poll = () => {
      pollRef.current = setTimeout(() => {
        fetchMessages();
        poll();
      }, 2000);
    };
    poll();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingVisible]);

  const handleSendIcebreaker = async (text: string) => {
    if (sending) return;
    setSending(true);
    if (features.typingIndicators) setTypingVisible(true);
    try {
      await fetch(`/api/matches/${matchId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      fetchMessages();
      setTimeout(() => {
        fetchMessages();
        setTypingVisible(false);
      }, 2500);
    } catch {
      setTypingVisible(false);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");
    if (features.typingIndicators) setTypingVisible(true);

    try {
      await fetch(`/api/matches/${matchId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      fetchMessages();
      // Fetch again after delay to catch auto-reply
      setTimeout(() => {
        fetchMessages();
        setTypingVisible(false);
      }, 2500);
    } catch {
      setTypingVisible(false);
    } finally {
      setSending(false);
    }
  };

  if (!profile) return null;

  // Lazy import VideoCallScreen only when needed
  const VideoCallScreen = showVideoCall
    ? require("@/components/VideoCallScreen").default
    : null;

  let lastDayKey = "";
  const userSentMessages = messages.filter((m) => m.senderId === "self");
  const lastUserMsg = userSentMessages[userSentMessages.length - 1];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-card-strong rounded-2xl p-3 flex items-center gap-3 mb-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-mode-messages/30"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{profile.name}</span>
            {profile.isVerified && <VerifiedBadge size="sm" />}
            <span className="text-[10px] text-slate-500">
              {profile.westernZodiac.symbol} {profile.westernZodiac.sign}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">{profile.occupation}</p>
        </div>
        <VideoCallButton
          onClick={() => setShowVideoCall(true)}
          locked={!features.videoCall}
        />
        <div className="glass-card rounded-full px-2.5 py-1">
          <span className="text-[10px] font-bold text-mode-messages">{score}%</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 px-1 min-h-0">
        {/* Icebreaker comment at top if present */}
        {icebreakerComment && icebreakerPromptIndex != null && profile.prompts[icebreakerPromptIndex] && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 mb-3"
          >
            <p className="text-[9px] text-amber-400 uppercase tracking-wider font-semibold mb-1">
              <Sparkles size={9} className="inline mr-1" />
              {profile.prompts[icebreakerPromptIndex].question}
            </p>
            <p className="text-xs text-slate-300 italic">&ldquo;{icebreakerComment}&rdquo;</p>
          </motion.div>
        )}

        {messages.length === 0 && !typingVisible && (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl"
            >
              {profile.westernZodiac.symbol}
            </motion.div>
            <p className="text-white font-semibold text-sm">
              {t('sayHello', { name: profile.name })}
            </p>
            <p className="text-slate-500 text-xs">
              {t('connectionAwaits')}
            </p>

            {/* Conversation Starters — replaces old icebreakers for matched chats */}
            {starters.length > 0 && features.conversationStarters > 0 && (
              <div className="mt-4 w-full px-2">
                <ConversationStarters
                  starters={starters}
                  onSelect={handleSendIcebreaker}
                  maxVisible={features.conversationStarters}
                />
              </div>
            )}

            {/* Fallback icebreaker suggestions — gated */}
            {(features.conversationStarters === 0 && icebreakers.length > 0) && (
              <div className="mt-4 w-full px-2">
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <Sparkles size={12} className="text-amber-400" />
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {t('suggestedOpeners')}
                  </p>
                </div>
                {features.icebreakers ? (
                  <div className="flex flex-col gap-2">
                    {icebreakers.map((text, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSendIcebreaker(text)}
                        className="glass-card-subtle rounded-2xl px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-all text-left leading-relaxed"
                      >
                        {text}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-3 glass-card rounded-2xl border border-amber-400/20">
                    <Lock size={12} className="text-amber-400" />
                    <span className="text-xs text-amber-400 font-semibold">{ts("unlockIcebreakers")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {messages.map((msg, i) => {
          const isUser = msg.senderId === "self";
          const msgDate = new Date(msg.createdAt);
          const dayKey = getDayKey(msgDate);
          let showDaySeparator = false;
          if (dayKey !== lastDayKey) {
            showDaySeparator = true;
            lastDayKey = dayKey;
          }

          const isLastUserMsg = isUser && lastUserMsg?.id === msg.id;

          return (
            <div key={msg.id}>
              {showDaySeparator && (
                <div className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] text-slate-500 font-medium">{formatDayLabel(msgDate, t('today'), t('yesterday'))}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    isUser
                      ? "bg-gradient-to-r from-indigo-600/90 to-indigo-500/80 text-white rounded-br-sm shadow-[0_2px_12px_rgba(99,102,241,0.25)]"
                      : "glass-card-strong text-slate-200 rounded-bl-sm"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isUser ? "justify-end" : ""}`}>
                    <p className={`text-[9px] ${isUser ? "text-indigo-200/60" : "text-slate-500"}`}>
                      {msgDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {isUser && features.readReceipts && (
                      <MessageStatus message={msg} isLatest={isLastUserMsg} />
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
        {typingVisible && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      {locked ? (
        <div className="glass-card-strong rounded-2xl p-3 mt-3 flex items-center gap-3 border border-amber-400/20">
          <Lock size={16} className="text-amber-400 shrink-0" />
          <span className="text-xs text-slate-400 flex-1">Upgrade to Pro for unlimited conversations</span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.dispatchEvent(new CustomEvent("open-upgrade-modal"))}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shrink-0"
          >
            Upgrade
          </motion.button>
        </div>
      ) : (
        <div className="glass-card-strong rounded-2xl p-2 mt-3 flex items-center gap-2 border border-indigo-900/30">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t('messagePlaceholder', { name: profile.name })}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none px-3 py-2"
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            whileTap={{ scale: 0.85, rotate: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 flex items-center justify-center text-white disabled:opacity-30 hover:opacity-90 transition-all flex-shrink-0"
          >
            <Send size={16} />
          </motion.button>
        </div>
      )}

      {/* Video Call Screen */}
      {showVideoCall && VideoCallScreen && (
        <VideoCallScreen
          matchProfile={{ name: profile.name, photo: profile.photo }}
          userPhoto={currentUser.photo}
          onEnd={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
}
