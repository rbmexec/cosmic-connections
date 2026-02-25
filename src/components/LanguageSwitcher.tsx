"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/config";

const localeLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
  hi: "हिन्दी",
  ar: "العربية",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  ko: "한국어",
};

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function switchLocale(newLocale: string) {
    setOpen(false);
    // Remove current locale prefix from pathname if present
    const segments = pathname.split("/");
    const currentLocaleInPath = locales.includes(segments[1] as typeof locales[number]);
    const pathWithoutLocale = currentLocaleInPath
      ? "/" + segments.slice(2).join("/")
      : pathname;
    const newPath = newLocale === "en" ? pathWithoutLocale || "/" : `/${newLocale}${pathWithoutLocale}`;
    router.replace(newPath);
  }

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        aria-label={t("title")}
      >
        <Globe size={18} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-12 right-0 z-50 glass-card-strong rounded-2xl p-2 min-w-[160px] shadow-xl border border-white/10"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold px-3 py-1.5">
              {t("title")}
            </p>
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                  locale === loc
                    ? "bg-white/10 text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {localeLabels[loc]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
