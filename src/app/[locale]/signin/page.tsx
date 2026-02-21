"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import CosmicBackground from "@/components/CosmicBackground";
import SignInButtons from "@/components/SignInButtons";
import PhoneSignIn from "@/components/PhoneSignIn";

export default function SignInPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [view, setView] = useState<"landing" | "auth" | "phone">("landing");

  // If there's an auth error, jump straight to the auth view
  useEffect(() => {
    if (authError) setView("auth");
  }, [authError]);

  // Clear any stale session so OAuth flows don't conflict
  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  return (
    <main className="min-h-[100dvh] relative flex flex-col">
      <CosmicBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo + Tagline — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles size={22} className="text-violet-400" />
            <h1 className="text-5xl font-bold tracking-tight text-white">
              {tc("appName")}
            </h1>
            <Sparkles size={22} className="text-violet-400" />
          </div>
          <p className="text-xs text-slate-400 tracking-[0.25em] uppercase">
            {tc("tagline")}
          </p>
        </motion.div>
      </div>

      {/* Bottom pinned content */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 pb-10">
        <AnimatePresence mode="wait">
          {view === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Terms text */}
              <p className="text-[11px] text-slate-500 text-center leading-relaxed px-2">
                {t("termsConsent")}{" "}
                <span className="text-violet-400 underline">{t("termsOfService")}</span>.{" "}
                {t("learnData")}{" "}
                <span className="text-violet-400 underline">{t("privacyPolicy")}</span>.
              </p>

              {/* Create account button */}
              <button
                onClick={() => setView("auth")}
                className="w-full py-4 rounded-full font-bold text-base text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all active:scale-[0.98] shadow-lg shadow-violet-600/25"
              >
                {t("createAccount")}
              </button>

              {/* Sign in text link */}
              <button
                onClick={() => setView("auth")}
                className="text-sm text-white/70 hover:text-white transition-colors py-2"
              >
                {t("signIn")}
              </button>
            </motion.div>
          ) : view === "auth" ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              {authError && (
                <div className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{t("authError")}</span>
                </div>
              )}
              <SignInButtons onPhoneClick={() => setView("phone")} />

              {/* Back link */}
              <button
                onClick={() => setView("landing")}
                className="text-sm text-white/50 hover:text-white transition-colors py-2 mt-1"
              >
                {tc("back")}
              </button>

              {/* Dev bypass */}
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={async () => {
                    const res = await fetch("/api/auth/dev-bypass", { method: "POST" });
                    if (res.ok) window.location.href = "/";
                  }}
                  className="text-[10px] text-white/20 hover:text-white/40 transition-colors mt-4"
                >
                  [DEV] Skip auth
                </button>
              )}
            </motion.div>
          ) : (
            <PhoneSignIn onBack={() => setView("auth")} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
