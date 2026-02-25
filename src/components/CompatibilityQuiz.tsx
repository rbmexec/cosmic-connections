"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Frown, Meh, Minus, Smile, Heart, Sparkles, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { compatibilityQuestions } from "@/lib/compatibility-questions";

interface CompatibilityQuizProps {
  onComplete: (answers: Record<string, number>) => void;
  maxQuestions: number;
  existingAnswers?: Record<string, number>;
}

const ANSWER_OPTIONS = [
  { value: 1, label: "stronglyDisagree", Icon: Frown, color: "#ef4444" },
  { value: 2, label: "disagree", Icon: Meh, color: "#f97316" },
  { value: 3, label: "neutral", Icon: Minus, color: "#94a3b8" },
  { value: 4, label: "agree", Icon: Smile, color: "#10b981" },
  { value: 5, label: "stronglyAgree", Icon: Heart, color: "#a78bfa" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  elements: "text-teal-400",
  energy: "text-amber-400",
  lifestyle: "text-green-400",
  cosmic: "text-purple-400",
  values: "text-pink-400",
};

export default function CompatibilityQuiz({
  onComplete,
  maxQuestions,
  existingAnswers,
}: CompatibilityQuizProps) {
  const t = useTranslations("quiz");

  const questions = compatibilityQuestions.slice(0, maxQuestions);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(existingAnswers || {});
  const [completed, setCompleted] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const handleAnswer = useCallback(
    (value: number) => {
      const newAnswers = { ...answers, [String(currentQuestion.id)]: value };
      setAnswers(newAnswers);

      if (currentIndex < totalQuestions - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
        onComplete(newAnswers);
      }
    },
    [answers, currentIndex, currentQuestion, totalQuestions, onComplete]
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleClose = useCallback(() => {
    // Complete with whatever answers we have so far
    onComplete(answers);
  }, [answers, onComplete]);

  // Completion celebration
  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative glass-card-strong rounded-[28px] p-8 max-w-sm w-full text-center"
        >
          {/* Celebration particles */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const distance = 80 + Math.random() * 100;
            const colors = ["#fbbf24", "#a78bfa", "#10b981", "#ec4899"];
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{
                  left: "50%",
                  top: "40%",
                  backgroundColor: colors[i % colors.length],
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.5],
                }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: "easeOut" }}
              />
            );
          })}

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Sparkles size={48} className="text-amber-400 mx-auto mb-4" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gradient-cosmic mb-2">
            {t("complete")}
          </h2>
          <p className="text-sm text-slate-400 mb-2">
            {t("answeredCount", { count: Object.keys(answers).length })}
          </p>
          <p className="text-xs text-slate-500 mb-6">
            {t("completeDescription")}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="glass-card rounded-full px-5 py-2 flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              <span className="text-sm text-green-400 font-semibold">{t("saved")}</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe pb-3">
        <button
          onClick={currentIndex > 0 ? handleBack : handleClose}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          {currentIndex > 0 ? <ArrowLeft size={20} /> : <X size={20} />}
        </button>

        <span className="text-xs text-slate-500">
          {currentIndex + 1} / {totalQuestions}
        </span>

        <button
          onClick={handleClose}
          className="text-xs text-amber-400 font-semibold hover:text-amber-300 transition-colors px-3 py-1"
        >
          {t("skip")}
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mb-8">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-md text-center"
          >
            {/* Category badge */}
            <div className="mb-6">
              <span
                className={`text-[10px] uppercase tracking-widest font-semibold ${
                  CATEGORY_COLORS[currentQuestion.category] || "text-slate-400"
                }`}
              >
                {t(`category_${currentQuestion.category}`)}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-xl font-bold text-white leading-relaxed mb-10">
              {currentQuestion.question}
            </h3>

            {/* Answer buttons */}
            <div className="space-y-3">
              {ANSWER_OPTIONS.map(({ value, label, Icon, color }) => {
                const isSelected = answers[String(currentQuestion.id)] === value;
                return (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(value)}
                    className={`
                      w-full py-3.5 px-5 rounded-2xl flex items-center gap-3 transition-all
                      ${isSelected
                        ? "border-2 shadow-lg"
                        : "glass-card border border-white/10 hover:border-white/20"
                      }
                    `}
                    style={{
                      borderColor: isSelected ? color : undefined,
                      boxShadow: isSelected ? `0 0 20px ${color}30` : undefined,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: isSelected ? color : "#94a3b8" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: isSelected ? color : "#cbd5e1" }}
                    >
                      {t(label)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
