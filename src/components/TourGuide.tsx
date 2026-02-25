"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Hand } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AppMode } from "@/types/profile";

interface TourGuideProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onComplete: () => void;
}

interface TourStep {
  key: string;
  target?: string; // data-tour selector, undefined = full-screen
  switchMode?: AppMode;
  showSwipeDemo?: boolean;
}

const STEPS: TourStep[] = [
  { key: "welcome" },
  { key: "profileTab", target: "tab-personal", switchMode: "personal" },
  { key: "discoverTab", target: "tab-attraction", switchMode: "attraction" },
  { key: "swipeGesture", target: "profile-feed", showSwipeDemo: true },
  { key: "modeTabs", target: "tabs-modes" },
  { key: "messagesTab", target: "tab-messages" },
  { key: "done" },
];

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };
const PADDING = 8;
const RADIUS = 12;

export default function TourGuide({ mode, onModeChange, onComplete }: TourGuideProps) {
  const t = useTranslations("tour");
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const measuringRef = useRef(false);

  const current = STEPS[step];
  const isFullScreen = !current.target;
  const isLastStep = step === STEPS.length - 1;
  const isFirstStep = step === 0;

  // Lock body scroll during tour
  useEffect(() => {
    document.body.style.overflow = "hidden";
    setMounted(true);
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Measure target element
  const measureTarget = useCallback(() => {
    if (!current.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    }
  }, [current.target]);

  // Re-measure on step change (with optional delay for mode switch)
  useEffect(() => {
    if (measuringRef.current) return;
    measuringRef.current = true;

    if (current.switchMode && current.switchMode !== mode) {
      onModeChange(current.switchMode);
      const timer = setTimeout(() => {
        measureTarget();
        measuringRef.current = false;
      }, 150);
      return () => {
        clearTimeout(timer);
        measuringRef.current = false;
      };
    } else {
      measureTarget();
      measuringRef.current = false;
    }
  }, [step, current.switchMode, mode, onModeChange, measureTarget]);

  // Re-measure on resize
  useEffect(() => {
    const handleResize = () => measureTarget();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureTarget]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      // Switch back to attraction mode on done
      onModeChange("attraction");
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  }, [isLastStep, onComplete, onModeChange]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleSkip = useCallback(() => {
    onModeChange("attraction");
    onComplete();
  }, [onComplete, onModeChange]);

  if (!mounted) return null;

  // Spotlight cutout coordinates
  const cx = targetRect ? targetRect.left - PADDING : 0;
  const cy = targetRect ? targetRect.top - PADDING : 0;
  const cw = targetRect ? targetRect.width + PADDING * 2 : 0;
  const ch = targetRect ? targetRect.height + PADDING * 2 : 0;

  // Tooltip positioning
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect || isFullScreen) return {};
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const tooltipAbove = spaceBelow < 200 && spaceAbove > 200;

    return {
      position: "absolute",
      left: Math.max(16, Math.min(targetRect.left, window.innerWidth - 320)),
      ...(tooltipAbove
        ? { bottom: viewportH - targetRect.top + PADDING + 16 }
        : { top: targetRect.bottom + PADDING + 16 }),
      maxWidth: Math.min(320, window.innerWidth - 32),
    };
  };

  const stepKey = current.key as "welcome" | "profileTab" | "discoverTab" | "swipeGesture" | "modeTabs" | "messagesTab" | "done";

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="tour-overlay"
        className="fixed inset-0 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* SVG Mask Overlay */}
        {isFullScreen ? (
          <div className="absolute inset-0 bg-black/85" />
        ) : (
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="tour-mask">
                <rect width="100%" height="100%" fill="white" />
                <motion.rect
                  fill="black"
                  rx={RADIUS}
                  ry={RADIUS}
                  initial={{ x: cx, y: cy, width: cw, height: ch, opacity: 0 }}
                  animate={{ x: cx, y: cy, width: cw, height: ch, opacity: 1 }}
                  transition={SPRING}
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.85)"
              mask="url(#tour-mask)"
            />
          </svg>
        )}

        {/* Full-screen content (welcome / done) */}
        {isFullScreen && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              key={`fullscreen-${step}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={SPRING}
              className="w-full max-w-sm bg-black/90 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center">
                  <Sparkles size={28} className="text-violet-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {t(`steps.${stepKey}.title`)}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {t(`steps.${stepKey}.description`)}
              </p>

              {isFirstStep && (
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-base transition-transform active:scale-[0.98]"
                >
                  {t("letsGo")}
                </button>
              )}

              {isLastStep && (
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-base transition-transform active:scale-[0.98]"
                >
                  {t("letsGo")}
                </button>
              )}

              {/* Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === step ? "bg-violet-500" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Skip */}
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  className="mt-4 text-xs text-white/30 hover:text-white/50 transition-colors"
                >
                  {t("skip")}
                </button>
              )}
            </motion.div>
          </div>
        )}

        {/* Spotlight tooltip */}
        {!isFullScreen && targetRect && (
          <motion.div
            key={`tooltip-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={SPRING}
            style={getTooltipStyle()}
            className="bg-black/90 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-white mb-1.5">
              {t(`steps.${stepKey}.title`)}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-1">
              {t(`steps.${stepKey}.description`)}
            </p>

            {/* Swipe demo animation */}
            {current.showSwipeDemo && (
              <div className="flex items-center justify-center py-3">
                <motion.div
                  animate={{ x: [0, 40, 0, -40, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-2 text-violet-400"
                >
                  <Hand size={24} />
                </motion.div>
              </div>
            )}

            {/* Step counter */}
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">
              {t("stepOf", { current: step + 1, total: STEPS.length })}
            </p>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              {!isFirstStep && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium transition-colors hover:border-white/20 min-h-[44px]"
                >
                  {t("back")}
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold transition-transform active:scale-[0.98] min-h-[44px]"
              >
                {t("next")}
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? "bg-violet-500" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* Skip */}
            <button
              onClick={handleSkip}
              className="mt-3 w-full text-xs text-white/30 hover:text-white/50 transition-colors text-center"
            >
              {t("skip")}
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
