"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Crown, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { useSubscription } from "@/lib/subscription-context";

export default function UserMenu() {
  const { data: session } = useSession();
  const t = useTranslations("auth");
  const ts = useTranslations("subscription");
  const { tier, isPro, openPortal } = useSubscription();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!session?.user) return null;

  const initials = (session.user.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const tierBadge = tier === "cosmic_plus"
    ? { label: ts("cosmicPlusName"), icon: <Sparkles size={10} />, color: "text-purple-400 bg-purple-400/10 border-purple-400/30" }
    : tier === "pro"
      ? { label: ts("proName"), icon: <Zap size={10} />, color: "text-amber-400 bg-amber-400/10 border-amber-400/30" }
      : null;

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full glass-card flex items-center justify-center overflow-hidden border border-white/10 hover:border-white/20 transition-colors relative"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || ""}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-amber-300">{initials}</span>
        )}
        {tierBadge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
            <Crown size={8} className="text-amber-400" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 glass-card-strong rounded-xl border border-white/10 overflow-hidden min-w-[180px]"
          >
            <div className="px-3 py-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
                {tierBadge && (
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${tierBadge.color}`}>
                    {tierBadge.icon}
                    {tierBadge.label}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">{session.user.email}</p>
            </div>
            {isPro ? (
              <button
                onClick={() => { setOpen(false); openPortal(); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-amber-400/80 hover:bg-amber-400/5 transition-colors"
              >
                <Crown size={14} />
                {ts("manageSubscription")}
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  // Trigger upgrade modal by dispatching a custom event
                  window.dispatchEvent(new CustomEvent("open-upgrade-modal"));
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-amber-400/80 hover:bg-amber-400/5 transition-colors"
              >
                <Zap size={14} />
                {ts("upgradeToPro")}
              </button>
            )}
            <button
              onClick={() => signOut({ redirectTo: "/signin" })}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400/80 hover:bg-red-400/5 transition-colors"
            >
              <LogOut size={14} />
              {t("signOut")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
