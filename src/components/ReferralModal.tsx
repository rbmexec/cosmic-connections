"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Send, ChevronDown, Check, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { sampleProfiles } from "@/data/profiles";
import type { UserProfile } from "@/types/profile";

interface ReferralModalProps {
  open: boolean;
  onClose: () => void;
  profileToRefer?: UserProfile;
}

export default function ReferralModal({
  open,
  onClose,
  profileToRefer,
}: ReferralModalProps) {
  const t = useTranslations("referral");

  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    profileToRefer ?? null,
  );
  const [selectedRecipient, setSelectedRecipient] =
    useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [profileSearch, setProfileSearch] = useState("");
  const [recipientSearch, setRecipientSearch] = useState("");

  // Profiles available to refer (simulated matched profiles — first 10)
  const referrableProfiles = useMemo(
    () => sampleProfiles.slice(0, 10),
    [],
  );

  // Potential recipients (simulated friends — profiles 10-20)
  const recipientProfiles = useMemo(
    () => sampleProfiles.slice(10, 20),
    [],
  );

  const filteredProfiles = useMemo(
    () =>
      referrableProfiles.filter((p) =>
        p.name.toLowerCase().includes(profileSearch.toLowerCase()),
      ),
    [referrableProfiles, profileSearch],
  );

  const filteredRecipients = useMemo(
    () =>
      recipientProfiles.filter((p) =>
        p.name.toLowerCase().includes(recipientSearch.toLowerCase()),
      ),
    [recipientProfiles, recipientSearch],
  );

  function handleSend() {
    if (!selectedProfile || !selectedRecipient) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedProfile(profileToRefer ?? null);
      setSelectedRecipient(null);
      setMessage("");
      onClose();
    }, 1800);
  }

  function handleClose() {
    setSelectedProfile(profileToRefer ?? null);
    setSelectedRecipient(null);
    setMessage("");
    setSent(false);
    setShowProfileDropdown(false);
    setShowRecipientDropdown(false);
    onClose();
  }

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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-[28px] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Sent confirmation */}
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[28px] bg-cosmic-card/95 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                    }}
                    className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mb-4"
                  >
                    <Check size={32} className="text-teal-400" />
                  </motion.div>
                  <p className="text-lg font-bold text-white">
                    {t("sentSuccess")}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {t("sentDescription")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Gift size={36} className="text-purple-400 mx-auto mb-2" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gradient-cosmic">
                {t("title")}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{t("subtitle")}</p>
            </div>

            {/* Select profile to refer */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">
                {t("selectProfile")}
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileDropdown((v) => !v);
                    setShowRecipientDropdown(false);
                  }}
                  className="w-full glass-card rounded-2xl px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  {selectedProfile ? (
                    <>
                      <img
                        src={selectedProfile.photo}
                        alt={selectedProfile.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {selectedProfile.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {selectedProfile.westernZodiac.symbol}{" "}
                          {selectedProfile.westernZodiac.sign}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm text-slate-500 flex-1">
                      {t("chooseSomeone")}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 right-0 top-full mt-1 glass-card-strong rounded-2xl border border-white/10 max-h-48 overflow-y-auto z-30"
                    >
                      <div className="px-3 pt-3 pb-1">
                        <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2">
                          <Search size={12} className="text-slate-500" />
                          <input
                            type="text"
                            value={profileSearch}
                            onChange={(e) => setProfileSearch(e.target.value)}
                            placeholder={t("searchPlaceholder")}
                            className="bg-transparent text-xs text-white placeholder:text-slate-600 outline-none flex-1"
                          />
                        </div>
                      </div>
                      {filteredProfiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProfile(p);
                            setShowProfileDropdown(false);
                            setProfileSearch("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                        >
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {p.westernZodiac.symbol}{" "}
                              {p.westernZodiac.sign} &middot; {p.occupation}
                            </p>
                          </div>
                          {selectedProfile?.id === p.id && (
                            <Check size={14} className="text-teal-400" />
                          )}
                        </button>
                      ))}
                      {filteredProfiles.length === 0 && (
                        <p className="text-xs text-slate-600 text-center py-4">
                          {t("noResults")}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Select recipient */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">
                {t("selectRecipient")}
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowRecipientDropdown((v) => !v);
                    setShowProfileDropdown(false);
                  }}
                  className="w-full glass-card rounded-2xl px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  {selectedRecipient ? (
                    <>
                      <img
                        src={selectedRecipient.photo}
                        alt={selectedRecipient.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {selectedRecipient.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {selectedRecipient.westernZodiac.symbol}{" "}
                          {selectedRecipient.westernZodiac.sign}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm text-slate-500 flex-1">
                      {t("chooseRecipient")}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${showRecipientDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showRecipientDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 right-0 top-full mt-1 glass-card-strong rounded-2xl border border-white/10 max-h-48 overflow-y-auto z-30"
                    >
                      <div className="px-3 pt-3 pb-1">
                        <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2">
                          <Search size={12} className="text-slate-500" />
                          <input
                            type="text"
                            value={recipientSearch}
                            onChange={(e) =>
                              setRecipientSearch(e.target.value)
                            }
                            placeholder={t("searchPlaceholder")}
                            className="bg-transparent text-xs text-white placeholder:text-slate-600 outline-none flex-1"
                          />
                        </div>
                      </div>
                      {filteredRecipients.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedRecipient(p);
                            setShowRecipientDropdown(false);
                            setRecipientSearch("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                        >
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {p.westernZodiac.symbol}{" "}
                              {p.westernZodiac.sign} &middot; {p.occupation}
                            </p>
                          </div>
                          {selectedRecipient?.id === p.id && (
                            <Check size={14} className="text-teal-400" />
                          )}
                        </button>
                      ))}
                      {filteredRecipients.length === 0 && (
                        <p className="text-xs text-slate-600 text-center py-4">
                          {t("noResults")}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Optional message */}
            <div className="mb-6">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">
                {t("addMessage")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                rows={3}
                maxLength={200}
                className="w-full glass-card rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 resize-none outline-none focus:ring-1 focus:ring-purple-400/30 transition-all"
              />
              <p className="text-[10px] text-slate-600 text-right mt-1">
                {message.length}/200
              </p>
            </div>

            {/* Send button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={!selectedProfile || !selectedRecipient}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(168,85,247,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {t("sendReferral")}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
