"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Star, AlertTriangle, Calendar, X } from "lucide-react";
import type { NotificationData } from "@/types/notification";

interface InAppToastProps {
  notification: NotificationData | null;
  onDismiss: () => void;
  autoDismissMs?: number;
}

function getToastIcon(type: NotificationData["type"]) {
  switch (type) {
    case "match":
      return <Heart size={14} className="text-pink-400" />;
    case "message":
      return <MessageCircle size={14} className="text-indigo-400" />;
    case "like":
      return <Star size={14} className="text-amber-400" />;
    case "retrograde":
      return <AlertTriangle size={14} className="text-orange-400" />;
    case "event":
      return <Calendar size={14} className="text-teal-400" />;
    default:
      return <Star size={14} className="text-slate-400" />;
  }
}

export default function InAppToast({ notification, onDismiss, autoDismissMs = 4000 }: InAppToastProps) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [notification, onDismiss, autoDismissMs]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] max-w-sm w-full px-4"
        >
          <div className="glass-card-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="shrink-0">{getToastIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{notification.title}</p>
              <p className="text-[11px] text-slate-400 truncate">{notification.body}</p>
            </div>
            <button
              onClick={onDismiss}
              className="shrink-0 text-slate-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
