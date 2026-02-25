"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useNotifications } from "@/lib/notification-context";
import NotificationPanel from "@/components/NotificationPanel";

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);

  const togglePanel = useCallback(() => {
    setPanelOpen((prev) => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  return (
    <div className="relative">
      <motion.button
        onClick={togglePanel}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Notifications"
      >
        <Bell size={20} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {panelOpen && <NotificationPanel onClose={closePanel} />}
      </AnimatePresence>
    </div>
  );
}
