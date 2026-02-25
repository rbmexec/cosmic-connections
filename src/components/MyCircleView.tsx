"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, UserPlus, Users, Share2, Trash2,
  Sun, Moon, Hash, Sparkles, Star, Gem, Calendar,
  Compass, TrendingUp, Check,
} from "lucide-react";
import {
  lifePathData,
  zodiacDescriptions,
  chineseAnimalDescriptions,
  elementDescriptions,
  chineseElementDescriptions,
  calculateCompatibility,
  getCompatibilityLabel,
  calculateBirthdayNumber,
  calculatePersonalYear,
  birthdayNumberData,
  personalYearData,
} from "@/lib/cosmic-calculations";
import { getCircleConnections, removeCircleConnection } from "@/lib/circle-storage";
import { buildProfileFromConnection } from "@/lib/circle-profile";
import { buildComparisonUrl } from "@/lib/referral-link";
import { useSubscription } from "@/lib/subscription-context";
import AddConnectionModal from "@/components/AddConnectionModal";
import type { CircleConnection } from "@/types/circle";
import type { LifePathInfo, UserProfile } from "@/types/profile";

interface MyCircleViewProps {
  currentUser: UserProfile;
  onBack: () => void;
}

type SubView = "list" | "detail";

export default function MyCircleView({ currentUser, onBack }: MyCircleViewProps) {
  const t = useTranslations('circle');
  const { circleAdds } = useSubscription();
  const [connections, setConnections] = useState<CircleConnection[]>([]);
  const [subView, setSubView] = useState<SubView>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [justAddedConnection, setJustAddedConnection] = useState<CircleConnection | null>(null);

  const loadConnections = useCallback(() => {
    setConnections(getCircleConnections());
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const selectedConnection = connections.find((c) => c.id === selectedId) ?? null;

  const openDetail = (id: string) => {
    setSelectedId(id);
    setSubView("detail");
  };

  const backToList = () => {
    setSubView("list");
    setSelectedId(null);
  };

  const handleAdded = (connection: CircleConnection) => {
    loadConnections();
    setJustAddedConnection(connection);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[28px] overflow-hidden max-w-sm mx-auto card-stack-shadow"
    >
      <AnimatePresence mode="wait">
        {subView === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CircleList
              connections={connections}
              currentUser={currentUser}
              onBack={onBack}
              onOpenDetail={openDetail}
              onOpenAdd={() => setAddModalOpen(true)}
              circleAdds={circleAdds}
              justAdded={justAddedConnection}
              onDismissJustAdded={() => setJustAddedConnection(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {selectedConnection && (
              <ConnectionDetail
                connection={selectedConnection}
                currentUser={currentUser}
                onBack={backToList}
                onRemoved={() => {
                  backToList();
                  loadConnections();
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AddConnectionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={handleAdded}
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Circle List
// ═══════════════════════════════════════

function CircleList({
  connections,
  currentUser,
  onBack,
  onOpenDetail,
  onOpenAdd,
  circleAdds,
  justAdded,
  onDismissJustAdded,
}: {
  connections: CircleConnection[];
  currentUser: UserProfile;
  onBack: () => void;
  onOpenDetail: (id: string) => void;
  onOpenAdd: () => void;
  circleAdds: import("@/lib/subscription-context").CircleAddBalance | null;
  justAdded: CircleConnection | null;
  onDismissJustAdded: () => void;
}) {
  const t = useTranslations('circle');

  const addsLabel = circleAdds
    ? circleAdds.totalRemaining === -1
      ? t('unlimitedAdds')
      : t('addsRemaining', { count: circleAdds.totalRemaining })
    : null;

  const handleShareJustAdded = async () => {
    if (!justAdded) return;
    const userBirthday = currentUser.birthYear && currentUser.birthMonth && currentUser.birthDay
      ? `${currentUser.birthYear}-${String(currentUser.birthMonth).padStart(2, "0")}-${String(currentUser.birthDay).padStart(2, "0")}`
      : "";
    const url = buildComparisonUrl({
      user: { name: currentUser.name, birthday: userBirthday },
      connection: { name: justAdded.name, birthday: justAdded.birthday },
    });
    try {
      if (navigator.share) {
        await navigator.share({ title: t('shareConnection'), url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // user cancelled share
    }
    onDismissJustAdded();
  };

  if (connections.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-white">{t('myCircle')}</h2>
        </div>
        <EmptyState onAdd={onOpenAdd} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-white">{t('myCircle')}</h2>
          <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{connections.length}</span>
        </div>
      </div>

      {/* Just Added Banner */}
      <AnimatePresence>
        {justAdded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-teal-300">{t('justAdded', { name: justAdded.name })}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t('sharePrompt', { name: justAdded.name })}</p>
              </div>
              <button
                onClick={handleShareJustAdded}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 text-[10px] font-semibold hover:bg-teal-500/30 transition-colors"
              >
                <Share2 size={12} className="inline mr-1" />
                {t('shareConnection')}
              </button>
              <button onClick={onDismissJustAdded} className="text-slate-500 hover:text-white shrink-0">
                <span className="text-xs">&times;</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button + Adds Remaining */}
      <div className="mb-5">
        <motion.button
          onClick={onOpenAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(20,184,166,0.25)]"
        >
          <UserPlus size={16} />
          {t('addSomeone')}
        </motion.button>
        {addsLabel && (
          <p className="text-[10px] text-slate-500 text-center mt-1.5">{addsLabel}</p>
        )}
      </div>

      {/* Connection Cards */}
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
        {connections.map((conn, i) => (
          <ConnectionCard
            key={conn.id}
            connection={conn}
            currentUser={currentUser}
            index={i}
            onClick={() => onOpenDetail(conn.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Connection Card ───

function ConnectionCard({
  connection,
  currentUser,
  index,
  onClick,
}: {
  connection: CircleConnection;
  currentUser: UserProfile;
  index: number;
  onClick: () => void;
}) {
  const profile = useMemo(() => buildProfileFromConnection(connection), [connection]);
  const compat = useMemo(() => calculateCompatibility(currentUser, profile), [currentUser, profile]);
  const label = getCompatibilityLabel(compat.overall);

  const initials = connection.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all text-left"
    >
      {/* Initials avatar */}
      <div className="w-11 h-11 rounded-full bg-teal-900/60 border border-teal-400/30 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-teal-300">{initials}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white truncate">{connection.name}</p>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-500 capitalize shrink-0">
            {connection.relationship}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-amber-400 font-semibold">{profile.lifePath}</span>
          <span className="text-[10px] text-slate-600">&middot;</span>
          <span className="text-[10px] text-slate-400">{profile.westernZodiac.symbol} {profile.westernZodiac.sign}</span>
          <span className="text-[10px] text-slate-600">&middot;</span>
          <span className="text-[10px] text-slate-400">{profile.chineseZodiac.symbol} {profile.chineseZodiac.animal}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-lg font-bold" style={{ color: label.color }}>{compat.overall}%</span>
        <p className="text-[8px]" style={{ color: label.color }}>{label.label}</p>
      </div>
    </motion.button>
  );
}

// ─── Empty State ───

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations('circle');

  return (
    <div className="text-center py-12">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Users size={48} className="mx-auto text-slate-600 mb-4" />
      </motion.div>
      <p className="text-base font-semibold text-white mb-1">{t('emptyTitle')}</p>
      <p className="text-xs text-slate-500 mb-6 max-w-[220px] mx-auto">{t('emptyDesc')}</p>
      <motion.button
        onClick={onAdd}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-[0_4px_20px_rgba(20,184,166,0.25)]"
      >
        <UserPlus size={16} />
        {t('addSomeone')}
      </motion.button>
    </div>
  );
}

// ═══════════════════════════════════════
// Connection Detail View
// ═══════════════════════════════════════

const detailTabKeys = ["overview", "numerology", "western", "eastern"] as const;
type DetailTab = (typeof detailTabKeys)[number];

function ConnectionDetail({
  connection,
  currentUser,
  onBack,
  onRemoved,
}: {
  connection: CircleConnection;
  currentUser: UserProfile;
  onBack: () => void;
  onRemoved: () => void;
}) {
  const t = useTranslations('circle');
  const tc = useTranslations('common');
  const tcompat = useTranslations('compatibility');

  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const tabLabels: Record<DetailTab, string> = {
    overview: tc('overview'),
    numerology: tc('numerology'),
    western: tc('western'),
    eastern: tc('eastern'),
  };

  const profile = useMemo(() => buildProfileFromConnection(connection), [connection]);
  const compat = useMemo(() => calculateCompatibility(currentUser, profile), [currentUser, profile]);
  const compatLabel = getCompatibilityLabel(compat.overall);

  const lp = lifePathData[profile.lifePath];
  const zodiac = zodiacDescriptions[profile.westernZodiac.sign];
  const animal = chineseAnimalDescriptions[profile.chineseZodiac.animal];

  const birthdayNum = profile.birthDay ? calculateBirthdayNumber(profile.birthDay) : null;
  const personalYear = profile.birthMonth && profile.birthDay ? calculatePersonalYear(profile.birthMonth, profile.birthDay) : null;

  const initials = connection.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleShare = async () => {
    const userBirthday = currentUser.birthYear && currentUser.birthMonth && currentUser.birthDay
      ? `${currentUser.birthYear}-${String(currentUser.birthMonth).padStart(2, "0")}-${String(currentUser.birthDay).padStart(2, "0")}`
      : "";
    const url = buildComparisonUrl({
      user: { name: currentUser.name, birthday: userBirthday },
      connection: { name: connection.name, birthday: connection.birthday },
    });
    try {
      if (navigator.share) {
        await navigator.share({ title: t('shareConnection'), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled or clipboard failed
    }
  };

  const handleRemove = () => {
    removeCircleConnection(connection.id);
    onRemoved();
  };

  return (
    <div>
      {/* Header */}
      <div className="relative py-6 px-5 flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(13,61,56,0.6) 0%, transparent 100%)" }}>
        <button onClick={onBack} className="absolute top-5 left-5 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-20 h-20 rounded-full bg-teal-900/60 border-2 border-teal-400/40 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-teal-300">{initials}</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">{connection.name}</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 capitalize mt-1">
          {connection.relationship}
        </span>
        {/* Cosmic trio badges */}
        <div className="flex gap-2 mt-3">
          <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
            <span className="text-amber-400 font-bold">{profile.lifePath}</span>
            <span className="text-[9px] text-slate-400">LP</span>
          </span>
          <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
            <span>{profile.westernZodiac.symbol}</span>
            <span className="text-[9px] text-slate-400">{profile.westernZodiac.sign}</span>
          </span>
          <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
            <span>{profile.chineseZodiac.symbol}</span>
            <span className="text-[9px] text-slate-400">{profile.chineseZodiac.animal}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pt-1">
        {detailTabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[10px] font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab
                ? "bg-teal-400/15 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && (
              <DetailOverview profile={profile} lp={lp} zodiac={zodiac} animal={animal} />
            )}
            {activeTab === "numerology" && (
              <DetailNumerology profile={profile} lp={lp} birthdayNum={birthdayNum} personalYear={personalYear} />
            )}
            {activeTab === "western" && zodiac && (
              <DetailWestern profile={profile} zodiac={zodiac} />
            )}
            {activeTab === "eastern" && animal && (
              <DetailEastern profile={profile} animal={animal} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Compatibility Section */}
      <div className="px-5 pb-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-3">{tcompat('compatibilityWithYou')}</p>

          {/* Overall */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center border-2" style={{ borderColor: compatLabel.color + "60" }}>
              <span className="text-2xl font-bold" style={{ color: compatLabel.color }}>{compat.overall}%</span>
            </div>
            <p className="text-xs font-semibold mt-1.5" style={{ color: compatLabel.color }}>{compatLabel.label}</p>
          </div>

          {/* Dimension bars */}
          <div className="space-y-2">
            {[
              { label: tc('numerology'), score: compat.lifePath, color: "#fbbf24" },
              { label: tc('western'), score: compat.western, color: "#a78bfa" },
              { label: tc('chinese'), score: compat.chinese, color: "#34d399" },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-20 text-right">{d.label}</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                </div>
                <span className="text-[10px] font-semibold w-8" style={{ color: d.color }}>{d.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-6 space-y-2.5">
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(20,184,166,0.25)]"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? t('copiedToClipboard') : t('shareConnection')}
        </motion.button>

        {showRemoveConfirm ? (
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowRemoveConfirm(false)}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-2xl border border-slate-600/50 text-sm font-semibold text-slate-300"
            >
              {tc('cancel')}
            </motion.button>
            <motion.button
              onClick={handleRemove}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold"
            >
              {t('confirmRemove')}
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => setShowRemoveConfirm(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl border border-red-500/20 text-red-400/60 text-sm font-semibold flex items-center justify-center gap-2 hover:border-red-500/40 hover:text-red-400 transition-all"
          >
            <Trash2 size={14} />
            {t('removeFromCircle')}
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── Detail Tabs ───

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-amber-400">{icon}</span>
      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-400">{label}</p>
    </div>
  );
}

function DetailOverview({
  profile, lp, zodiac, animal,
}: {
  profile: UserProfile;
  lp: LifePathInfo | undefined;
  zodiac: { traits: string; ruler: string; compatibleSigns: string[] } | undefined;
  animal: { traits: string; luckyNumbers: number[]; luckyColors: string[]; compatibleAnimals: string[]; incompatibleAnimals: string[] } | undefined;
}) {
  const tc = useTranslations('common');
  const tp = useTranslations('personal');

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest">{tc('cosmicBlueprint')}</p>
      </div>
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400/5 to-transparent border border-amber-400/10">
        <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center">
          <span className="text-2xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{lp?.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{lp?.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-400/5 to-transparent border border-purple-400/10">
        <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center">
          <Sun size={22} className="text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{profile.westernZodiac.symbol} {profile.westernZodiac.sign}</p>
          <p className="text-xs text-slate-400 mt-0.5">{tp('elementSignLabel', { element: profile.westernZodiac.element })} &middot; {tc('ruledBy', { ruler: zodiac?.ruler ?? '' })}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
          <Moon size={22} className="text-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{profile.chineseZodiac.symbol} {profile.chineseZodiac.fullName}</p>
          <p className="text-xs text-slate-400 mt-0.5">{tp('chineseZodiacLabel', { element: profile.chineseZodiac.element })}</p>
        </div>
      </div>
    </div>
  );
}

function DetailNumerology({
  profile, lp, birthdayNum, personalYear,
}: {
  profile: UserProfile;
  lp: LifePathInfo | undefined;
  birthdayNum: number | null;
  personalYear: number | null;
}) {
  const tc = useTranslations('common');
  const bdData = birthdayNum ? birthdayNumberData[birthdayNum] : null;
  const pyData = personalYear ? personalYearData[personalYear] : null;

  return (
    <div className="space-y-5">
      {lp && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400/20 to-amber-400/5 flex items-center justify-center border border-amber-400/20">
            <span className="text-4xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
          </div>
          <p className="text-lg font-bold mt-3 text-white">{lp.name}</p>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">{lp.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {lp.traits.map((trait) => (
              <span key={trait} className="cosmic-tag bg-amber-400/10 text-amber-400 border border-amber-400/20">{trait}</span>
            ))}
          </div>
        </div>
      )}

      {bdData && birthdayNum !== null && (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-400/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
              <span className="text-xl font-serif font-bold text-amber-300">{birthdayNum}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-400/60 uppercase tracking-widest font-semibold">{tc('birthdayNumber')}</p>
              <p className="text-sm font-semibold text-white mt-0.5">{bdData.name}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{bdData.description}</p>
        </div>
      )}

      {pyData && personalYear !== null && (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-teal-400/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
              <span className="text-xl font-serif font-bold text-teal-300">{personalYear}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-teal-400/60 uppercase tracking-widest font-semibold">{tc('personalYear', { year: new Date().getFullYear() })}</p>
              <p className="text-sm font-semibold text-white mt-0.5">{pyData.name}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{pyData.description}</p>
        </div>
      )}
    </div>
  );
}

function DetailWestern({
  profile,
  zodiac,
}: {
  profile: UserProfile;
  zodiac: { traits: string; ruler: string; compatibleSigns: string[]; polarity: string; polarityLabel: string };
}) {
  const tc = useTranslations('common');

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400/20 to-purple-400/5 flex items-center justify-center border border-purple-400/20">
          <span className="text-4xl">{profile.westernZodiac.symbol}</span>
        </div>
        <p className="text-lg font-bold mt-3 text-white">{profile.westernZodiac.sign}</p>
        <p className="text-xs text-slate-400">{tc('ruledBy', { ruler: zodiac.ruler })} &middot; {profile.westernZodiac.element} {tc('element')}</p>
        <p className="text-[10px] text-purple-300/70 mt-1">{zodiac.polarityLabel}</p>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{zodiac.traits}</p>
      <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10">
        <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-widest mb-1">
          <Sparkles size={10} className="inline mr-1" />{tc('elementMeaning')}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">{elementDescriptions[profile.westernZodiac.element]}</p>
      </div>
      <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10">
        <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-widest mb-1">{tc('polarity')}</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          {zodiac.polarity === "Positive"
            ? tc('polarityPositive')
            : tc('polarityNegative')}
        </p>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">{tc('bestMatches')}</p>
        <div className="flex flex-wrap gap-2">
          {zodiac.compatibleSigns.map((s) => (
            <span key={s} className="cosmic-tag bg-purple-400/10 text-purple-300 border border-purple-400/20">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailEastern({
  profile,
  animal,
}: {
  profile: UserProfile;
  animal: { traits: string; luckyNumbers: number[]; luckyColors: string[]; compatibleAnimals: string[]; incompatibleAnimals: string[] };
}) {
  const tc = useTranslations('common');

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center border border-green-500/20">
          <span className="text-4xl">{profile.chineseZodiac.symbol}</span>
        </div>
        <p className="text-lg font-bold mt-3 text-white">{profile.chineseZodiac.fullName}</p>
        <p className="text-xs text-slate-400">{profile.chineseZodiac.element} {tc('element')}</p>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{animal.traits}</p>
      <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
        <p className="text-[10px] text-green-400 font-semibold uppercase tracking-widest mb-1">{tc('elementMeaning')}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{chineseElementDescriptions[profile.chineseZodiac.element]}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{tc('luckyNumbers')}</p>
          <p className="text-sm font-semibold text-white">{animal.luckyNumbers.join(", ")}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{tc('luckyColors')}</p>
          <p className="text-sm font-semibold text-white">{animal.luckyColors.join(", ")}</p>
        </div>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">{tc('compatibleAnimals')}</p>
        <div className="flex flex-wrap gap-2">
          {animal.compatibleAnimals.map((a) => (
            <span key={a} className="cosmic-tag bg-green-500/10 text-green-400 border border-green-500/20">{a}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">{tc('incompatibleAnimals')}</p>
        <div className="flex flex-wrap gap-2">
          {animal.incompatibleAnimals.map((a) => (
            <span key={a} className="cosmic-tag bg-red-500/10 text-red-400 border border-red-500/20">{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
