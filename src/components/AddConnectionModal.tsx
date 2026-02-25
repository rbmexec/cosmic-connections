"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, UserPlus } from "lucide-react";
import { useTranslations } from 'next-intl';
import { calculateLifePath, getWesternZodiacFromDate, getChineseZodiacFromYear, lifePathData } from "@/lib/cosmic-calculations";
import { saveCircleConnection } from "@/lib/circle-storage";
import { useSubscription } from "@/lib/subscription-context";
import type { CircleConnection, RelationshipType } from "@/types/circle";

const relationshipTypes: { value: RelationshipType; labelKey: string }[] = [
  { value: "partner", labelKey: "partner" },
  { value: "parent", labelKey: "parent" },
  { value: "sibling", labelKey: "sibling" },
  { value: "child", labelKey: "child" },
  { value: "friend", labelKey: "friend" },
  { value: "colleague", labelKey: "colleague" },
  { value: "other", labelKey: "other" },
];

interface AddConnectionModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: (connection: CircleConnection) => void;
}

export default function AddConnectionModal({ open, onClose, onAdded }: AddConnectionModalProps) {
  const t = useTranslations('connection');
  const tc = useTranslations('common');
  const tCircle = useTranslations('circle');
  const ts = useTranslations('subscription');
  const { circleAdds, consumeCircleAdd, purchaseCircleAdd, openCheckout } = useSubscription();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [relationship, setRelationship] = useState<RelationshipType>("friend");
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [consuming, setConsuming] = useState(false);

  const canProceed = name.trim().length > 0 && birthday.length === 10;

  // Computed cosmic data for preview
  const cosmicPreview = (() => {
    if (!canProceed) return null;
    const date = new Date(birthday + "T00:00:00");
    if (isNaN(date.getTime())) return null;
    const lifePath = calculateLifePath(date);
    const western = getWesternZodiacFromDate(date);
    const chinese = getChineseZodiacFromYear(date.getFullYear());
    const lpInfo = lifePathData[lifePath];
    return { lifePath, western, chinese, lpInfo };
  })();

  const handleNext = () => {
    if (canProceed) setStep(2);
  };

  const handleConfirm = async () => {
    const hasAdds = circleAdds && (circleAdds.totalRemaining === -1 || circleAdds.totalRemaining > 0);

    if (!hasAdds && circleAdds !== null) {
      setShowPaymentGate(true);
      return;
    }

    setConsuming(true);
    const consumed = await consumeCircleAdd();
    setConsuming(false);

    if (!consumed) {
      setShowPaymentGate(true);
      return;
    }

    const connection: CircleConnection = {
      id: crypto.randomUUID(),
      name: name.trim(),
      birthday,
      relationship,
      createdAt: new Date().toISOString(),
    };
    saveCircleConnection(connection);
    // Reset state
    setStep(1);
    setName("");
    setBirthday("");
    setRelationship("friend");
    setShowPaymentGate(false);
    onAdded(connection);
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setName("");
    setBirthday("");
    setRelationship("friend");
    setShowPaymentGate(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-[28px] p-6 max-w-sm w-full overflow-hidden"
          >
            <div className="absolute inset-0 shimmer pointer-events-none" />

            <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <UserPlus size={32} className="mx-auto text-teal-400 mb-2" />
                    <h3 className="text-xl font-bold text-white">{t('addToCircle')}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t('enterDetails')}</p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 block mb-1.5">{t('name')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('theirName')}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/25 transition-all"
                    />
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 block mb-1.5">{t('birthday')}</label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/25 transition-all [color-scheme:dark]"
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 block mb-1.5">{t('relationship')}</label>
                    <div className="flex flex-wrap gap-2">
                      {relationshipTypes.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => setRelationship(r.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            relationship === r.value
                              ? "bg-teal-400/20 text-teal-300 border border-teal-400/40"
                              : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          {t(r.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleNext}
                    disabled={!canProceed}
                    whileHover={canProceed ? { scale: 1.02 } : undefined}
                    whileTap={canProceed ? { scale: 0.97 } : undefined}
                    className={`w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      canProceed
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-[0_4px_20px_rgba(20,184,166,0.35)]"
                        : "bg-white/5 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {t('seeCosmicChart')}
                    <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">{t('chart', { name: name.trim() })}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t('cosmicBlueprint')}</p>
                  </div>

                  {cosmicPreview && (
                    <div className="space-y-3">
                      {/* Life Path */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400/5 to-transparent border border-amber-400/10"
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                          <span className="text-2xl font-serif font-bold text-gradient-gold">{cosmicPreview.lifePath}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{tc('lifePath')} {cosmicPreview.lifePath}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{cosmicPreview.lpInfo?.name}</p>
                        </div>
                      </motion.div>

                      {/* Western Zodiac */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-400/5 to-transparent border border-purple-400/10"
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center border border-purple-400/20">
                          <span className="text-2xl">{cosmicPreview.western.symbol}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{cosmicPreview.western.sign}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{cosmicPreview.western.element} {tc('element')}</p>
                        </div>
                      </motion.div>

                      {/* Chinese Zodiac */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-400/5 to-transparent border border-green-400/10"
                      >
                        <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center border border-green-400/20">
                          <span className="text-2xl">{cosmicPreview.chinese.symbol}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{cosmicPreview.chinese.fullName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{cosmicPreview.chinese.element} {tc('element')}</p>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {showPaymentGate ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-center">
                        <p className="text-xs text-amber-400 font-semibold mb-1">{tCircle('noAddsRemaining')}</p>
                      </div>
                      <motion.button
                        onClick={purchaseCircleAdd}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold shadow-[0_4px_20px_rgba(20,184,166,0.35)]"
                      >
                        {tCircle('buyAdd')}
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          const proMonthlyId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "";
                          openCheckout(proMonthlyId);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-2.5 rounded-2xl border border-amber-400/30 text-amber-400 text-xs font-semibold hover:bg-amber-400/5 transition-all"
                      >
                        {tCircle('upgradeForMore')}
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setStep(1)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 py-3 rounded-2xl border border-slate-600/50 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-all"
                      >
                        {tc('back')}
                      </motion.button>
                      <motion.button
                        onClick={handleConfirm}
                        disabled={consuming}
                        whileHover={!consuming ? { scale: 1.02 } : undefined}
                        whileTap={!consuming ? { scale: 0.97 } : undefined}
                        className={`flex-1 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(20,184,166,0.35)] ${consuming ? "opacity-60" : ""}`}
                      >
                        <UserPlus size={16} />
                        {consuming ? "..." : t('addToCircle')}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
