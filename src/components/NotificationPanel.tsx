"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Star, AlertTriangle, Calendar, CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/lib/notification-context";
import type { NotificationData } from "@/types/notification";

interface NotificationPanelProps {
  onClose: () => void;
}

function getNotificationIcon(type: NotificationData["type"]) {
  switch (type) {
    case "match":
      return <Heart size={16} className="text-pink-400" />;
    case "message":
      return <MessageCircle size={16} className="text-indigo-400" />;
    case "like":
      return <Star size={16} className="text-amber-400" />;
    case "retrograde":
      return <AlertTriangle size={16} className="text-orange-400" />;
    case "event":
      return <Calendar size={16} className="text-teal-400" />;
    default:
      return <Star size={16} className="text-slate-400" />;
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const t = useTranslations("notifications");
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications();

  const { todayNotifications, earlierNotifications } = useMemo(() => {
    const today: NotificationData[] = [];
    const earlier: NotificationData[] = [];
    for (const n of notifications) {
      if (isToday(n.createdAt)) {
        today.push(n);
      } else {
        earlier.push(n);
      }
    }
    return { todayNotifications: today, earlierNotifications: earlier };
  }, [notifications]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] overflow-y-auto glass-card-strong rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <h3 className="text-sm font-bold text-white">{t("title")}</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-[10px] text-teal-400 hover:text-teal-300 font-semibold transition-colors"
            >
              <CheckCheck size={12} />
              {t("markAllRead")}
            </button>
          )}
        </div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-slate-500">{t("empty")}</p>
          </div>
        )}

        {/* Today group */}
        {todayNotifications.length > 0 && (
          <div>
            <div className="px-4 py-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {t("today")}
              </p>
            </div>
            {todayNotifications.map((n) => (
              <motion.button
                key={n.id}
                onClick={() => markRead(n.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/5 transition-colors ${
                  !n.readAt ? "bg-white/[0.03]" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">{getNotificationIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${!n.readAt ? "text-white" : "text-slate-300"}`}>
                    {n.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-600">{formatTimeAgo(n.createdAt)}</span>
                  {!n.readAt && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.5)]" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Earlier group */}
        {earlierNotifications.length > 0 && (
          <div>
            <div className="px-4 py-2 border-t border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {t("earlier")}
              </p>
            </div>
            {earlierNotifications.map((n) => (
              <motion.button
                key={n.id}
                onClick={() => markRead(n.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/5 transition-colors ${
                  !n.readAt ? "bg-white/[0.03]" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">{getNotificationIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${!n.readAt ? "text-white" : "text-slate-300"}`}>
                    {n.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-600">{formatTimeAgo(n.createdAt)}</span>
                  {!n.readAt && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.5)]" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}
