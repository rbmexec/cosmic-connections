"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Compass, Sun, Moon, Layers, Heart,
  Briefcase, Flame, Shield, Sparkles, ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { generateFullBlueprint } from "@/lib/blueprint-generator";
import type { UserProfile } from "@/types/profile";
import type { FullBlueprint } from "@/types/blueprint";

interface BlueprintViewProps {
  user: UserProfile;
  onBack: () => void;
}

// ─── Section config ───
const sectionConfig = [
  { id: "lifepath", labelKey: "lifePath", icon: Compass, color: "#f59e0b" },
  { id: "western", labelKey: "western", icon: Sun, color: "#a78bfa" },
  { id: "chinese", labelKey: "chinese", icon: Moon, color: "#34d399" },
  { id: "combined", labelKey: "combined", icon: Layers, color: "#f472b6" },
  { id: "dating", labelKey: "dating", icon: Heart, color: "#ec4899" },
  { id: "business", labelKey: "business", icon: Briefcase, color: "#3b82f6" },
  { id: "shadow", labelKey: "shadow", icon: Flame, color: "#ef4444" },
  { id: "expression", labelKey: "expression", icon: Shield, color: "#8b5cf6" },
  { id: "timelines", labelKey: "timelines", icon: Sparkles, color: "#eab308" },
] as const;

type SectionId = (typeof sectionConfig)[number]["id"];

// ─── Collapsible Section ───
function CollapsibleSection({
  title,
  icon,
  color,
  id,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  id: string;
  expanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-4 border"
      style={{
        background: `rgba(${hexToRgb(color)}, 0.03)`,
        borderColor: `rgba(${hexToRgb(color)}, 0.2)`,
      }}
    >
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <p className="text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color }}>
            {title}
          </p>
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color }} />
        ) : (
          <ChevronDown size={14} style={{ color }} />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Dual Block (realized/unrealized) ───
function DualBlock({
  realized,
  unrealized,
  realizedLabel = "Realized",
  unrealizedLabel = "Unrealized",
}: {
  realized: { traits: string[]; energy?: string };
  unrealized: { traits: string[]; energy?: string };
  realizedLabel?: string;
  unrealizedLabel?: string;
}) {
  return (
    <>
      {/* Realized */}
      <div
        className="p-3 rounded-xl border"
        style={{
          background: "rgba(251, 191, 36, 0.04)",
          borderColor: "rgba(251, 191, 36, 0.2)",
        }}
      >
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-amber-400 mb-2">
          {realizedLabel}
        </p>
        <ul className="space-y-1">
          {realized.traits.map((t) => (
            <li key={t} className="text-xs text-slate-300 flex items-start gap-1.5">
              <span className="text-amber-400 mt-0.5 text-[8px]">&#9670;</span>
              {t}
            </li>
          ))}
        </ul>
        {realized.energy && (
          <p className="text-[11px] italic text-amber-300/70 mt-2 leading-relaxed">
            &ldquo;{realized.energy}&rdquo;
          </p>
        )}
      </div>

      {/* Unrealized */}
      <div
        className="p-3 rounded-xl border"
        style={{
          background: "rgba(239, 68, 68, 0.04)",
          borderColor: "rgba(239, 68, 68, 0.2)",
        }}
      >
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-red-400 mb-2">
          {unrealizedLabel}
        </p>
        <ul className="space-y-1">
          {unrealized.traits.map((t) => (
            <li key={t} className="text-xs text-slate-300 flex items-start gap-1.5">
              <span className="text-red-400 mt-0.5 text-[8px]">&#9670;</span>
              {t}
            </li>
          ))}
        </ul>
        {unrealized.energy && (
          <p className="text-[11px] italic text-red-300/70 mt-2 leading-relaxed">
            &ldquo;{unrealized.energy}&rdquo;
          </p>
        )}
      </div>
    </>
  );
}

// ─── Trait List ───
function TraitList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-1">
      {items.map((t) => (
        <li key={t} className="text-xs text-slate-300 flex items-start gap-1.5">
          <span style={{ color }} className="mt-0.5 text-[8px]">&#9670;</span>
          {t}
        </li>
      ))}
    </ul>
  );
}

// ─── Lesson Block ───
function LessonBlock({ text, label }: { text: string; label?: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
      <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-1">{label ?? "Lesson"}</p>
      <p className="text-xs italic text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Helper ───
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// ═══════════════════════════════════════════
// Main BlueprintView
// ═══════════════════════════════════════════

export default function BlueprintView({ user, onBack }: BlueprintViewProps) {
  const t = useTranslations('blueprint');
  const tc = useTranslations('common');
  const tm = useTranslations('modes');

  const navLabels: Record<string, string> = {
    lifepath: tc('lifePath'),
    western: tc('western'),
    chinese: tc('chinese'),
    combined: t('combined'),
    dating: t('dating'),
    business: tm('business'),
    shadow: t('shadow'),
    expression: t('expression'),
    timelines: t('timelines'),
  };

  const blueprint = useMemo(() => generateFullBlueprint(user), [user]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    lifepath: true,
    western: false,
    chinese: false,
    combined: false,
    dating: false,
    business: false,
    shadow: false,
    expression: false,
    timelines: false,
  });

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleSection = useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const scrollToSection = useCallback((id: SectionId) => {
    setExpanded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[28px] overflow-hidden max-w-sm mx-auto card-stack-shadow flex flex-col"
      style={{ maxHeight: "calc(100dvh - 200px)" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} className="text-slate-400" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-white tracking-tight">{t('cosmicBlueprint')}</h2>
          <p className="text-[10px] text-slate-500">
            LP{user.lifePath} &middot; {user.westernZodiac.sign} &middot; {user.chineseZodiac.fullName}
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="px-4 pb-2 shrink-0">
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-400/5 via-purple-400/5 to-green-400/5 border border-white/5">
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {blueprint.combined.intro}
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="px-4 pb-3 shrink-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {sectionConfig.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className="px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap"
              style={{
                background: expanded[s.id] ? `rgba(${hexToRgb(s.color)}, 0.15)` : "rgba(255,255,255,0.03)",
                color: expanded[s.id] ? s.color : "#94a3b8",
                border: `1px solid ${expanded[s.id] ? `rgba(${hexToRgb(s.color)}, 0.3)` : "rgba(255,255,255,0.05)"}`,
              }}
            >
              {navLabels[s.id]}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 scrollbar-hide">
        {/* 1. Life Path */}
        <div ref={(el) => { sectionRefs.current.lifepath = el; }}>
          <LifePathSection bp={blueprint} user={user} expanded={expanded.lifepath} onToggle={toggleSection} />
        </div>

        {/* 2. Western */}
        <div ref={(el) => { sectionRefs.current.western = el; }}>
          <WesternSection bp={blueprint} user={user} expanded={expanded.western} onToggle={toggleSection} />
        </div>

        {/* 3. Chinese */}
        <div ref={(el) => { sectionRefs.current.chinese = el; }}>
          <ChineseSection bp={blueprint} user={user} expanded={expanded.chinese} onToggle={toggleSection} />
        </div>

        {/* 4. Combined */}
        <div ref={(el) => { sectionRefs.current.combined = el; }}>
          <CombinedSection bp={blueprint} expanded={expanded.combined} onToggle={toggleSection} />
        </div>

        {/* 5. Dating */}
        <div ref={(el) => { sectionRefs.current.dating = el; }}>
          <DatingSection bp={blueprint} expanded={expanded.dating} onToggle={toggleSection} />
        </div>

        {/* 6. Business */}
        <div ref={(el) => { sectionRefs.current.business = el; }}>
          <BusinessSection bp={blueprint} expanded={expanded.business} onToggle={toggleSection} />
        </div>

        {/* 7. Shadow */}
        <div ref={(el) => { sectionRefs.current.shadow = el; }}>
          <ShadowSection bp={blueprint} expanded={expanded.shadow} onToggle={toggleSection} />
        </div>

        {/* 8. Expression */}
        <div ref={(el) => { sectionRefs.current.expression = el; }}>
          <ExpressionSection bp={blueprint} expanded={expanded.expression} onToggle={toggleSection} />
        </div>

        {/* 9. Timelines */}
        <div ref={(el) => { sectionRefs.current.timelines = el; }}>
          <TimelinesSection bp={blueprint} expanded={expanded.timelines} onToggle={toggleSection} />
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Section Components
// ═══════════════════════════════════════════

function LifePathSection({ bp, user, expanded, onToggle }: { bp: FullBlueprint; user: UserProfile; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  return (
    <CollapsibleSection
      id="lifepath"
      title={t('lifePath', { number: user.lifePath })}
      icon={<Compass size={13} />}
      color="#f59e0b"
      expanded={expanded}
      onToggle={onToggle}
    >
      <p className="text-[10px] text-amber-400/60 uppercase tracking-widest font-semibold">
        {bp.lifePath.coreTheme}
      </p>
      <DualBlock
        realized={bp.lifePath.dual.realized}
        unrealized={bp.lifePath.dual.unrealized}
        realizedLabel={t('realized')}
        unrealizedLabel={t('unrealized')}
      />
    </CollapsibleSection>
  );
}

function WesternSection({ bp, user, expanded, onToggle }: { bp: FullBlueprint; user: UserProfile; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  return (
    <CollapsibleSection
      id="western"
      title={`${user.westernZodiac.symbol} ${user.westernZodiac.sign}`}
      icon={<Sun size={13} />}
      color="#a78bfa"
      expanded={expanded}
      onToggle={onToggle}
    >
      <p className="text-[10px] text-purple-400/60 uppercase tracking-widest font-semibold">
        {bp.western.coreTheme}
      </p>
      <DualBlock
        realized={bp.western.dual.realized}
        unrealized={bp.western.dual.unrealized}
        realizedLabel={t('realized')}
        unrealizedLabel={t('unrealized')}
      />
    </CollapsibleSection>
  );
}

function ChineseSection({ bp, user, expanded, onToggle }: { bp: FullBlueprint; user: UserProfile; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  const tc = useTranslations('common');
  return (
    <CollapsibleSection
      id="chinese"
      title={`${user.chineseZodiac.symbol} ${user.chineseZodiac.fullName}`}
      icon={<Moon size={13} />}
      color="#34d399"
      expanded={expanded}
      onToggle={onToggle}
    >
      <p className="text-[10px] text-green-400/60 uppercase tracking-widest font-semibold mb-1">
        {bp.chineseAnimal.description}
      </p>
      <DualBlock
        realized={bp.chineseAnimal.dual.realized}
        unrealized={bp.chineseAnimal.dual.unrealized}
        realizedLabel={t('realized')}
        unrealizedLabel={t('unrealized')}
      />
      {/* Element modifier */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-green-300 mb-1">
          {user.chineseZodiac.element} {tc('element')}
        </p>
        <p className="text-xs text-slate-400 mb-2">{bp.chineseElement.description}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-amber-400/60 mb-1">{t('adds')}</p>
            {bp.chineseElement.realizedTraits.slice(0, 3).map((tr) => (
              <p key={tr} className="text-[10px] text-slate-300">&bull; {tr}</p>
            ))}
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-red-400/60 mb-1">{t('risks')}</p>
            {bp.chineseElement.unrealizedTraits.slice(0, 3).map((tr) => (
              <p key={tr} className="text-[10px] text-slate-300">&bull; {tr}</p>
            ))}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}

function CombinedSection({ bp, expanded, onToggle }: { bp: FullBlueprint; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  return (
    <CollapsibleSection
      id="combined"
      title={t('combinedBlueprint')}
      icon={<Layers size={13} />}
      color="#f472b6"
      expanded={expanded}
      onToggle={onToggle}
    >
      <DualBlock
        realized={{ traits: bp.combined.realizedTraits }}
        unrealized={{ traits: bp.combined.unrealizedTraits }}
        realizedLabel={t('realizedBlend')}
        unrealizedLabel={t('unrealizedBlend')}
      />
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-pink-400 mb-1">{t('coreConflict')}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{bp.combined.coreConflict}</p>
      </div>
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-pink-400 mb-1">{t('evolutionPath')}</p>
        <TraitList items={bp.combined.evolutionPath} color="#f472b6" />
      </div>
    </CollapsibleSection>
  );
}

function DatingSection({ bp, expanded, onToggle }: { bp: FullBlueprint; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  const tc = useTranslations('common');
  return (
    <CollapsibleSection
      id="dating"
      title={t('datingRelationships')}
      icon={<Heart size={13} />}
      color="#ec4899"
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="p-3 rounded-xl bg-pink-400/5 border border-pink-400/10">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-pink-400 mb-1">{t('howDimensionsInteract')}</p>
        <TraitList items={bp.dating.coreDynamic} color="#ec4899" />
      </div>
      <div className="p-3 rounded-xl bg-pink-400/5 border border-pink-400/10">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-pink-400 mb-1">{t('yourLoveStyle')}</p>
        <TraitList items={bp.dating.loveStyle} color="#ec4899" />
      </div>
      <DualBlock
        realized={{ traits: bp.dating.realized }}
        unrealized={{ traits: bp.dating.unrealized }}
        realizedLabel={t('realizedInLove')}
        unrealizedLabel={t('unrealizedInLove')}
      />
      <div className="p-3 rounded-xl bg-pink-400/5 border border-pink-400/10">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-pink-400 mb-1">{t('bestPartnerTraits')}</p>
        <TraitList items={bp.dating.bestPartnerTraits} color="#ec4899" />
      </div>
      <LessonBlock text={bp.dating.lesson} label={tc('lesson')} />
    </CollapsibleSection>
  );
}

function BusinessSection({ bp, expanded, onToggle }: { bp: FullBlueprint; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  const tc = useTranslations('common');
  return (
    <CollapsibleSection
      id="business"
      title={t('businessMoney')}
      icon={<Briefcase size={13} />}
      color="#3b82f6"
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="p-3 rounded-xl bg-blue-400/5 border border-blue-400/10">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-blue-400 mb-1">{t('whyFinanciallyStrong')}</p>
        <TraitList items={bp.business.whyStrong} color="#3b82f6" />
      </div>
      <DualBlock
        realized={{ traits: bp.business.realized }}
        unrealized={{ traits: bp.business.unrealized }}
        realizedLabel={t('realizedInBusiness')}
        unrealizedLabel={t('unrealizedInBusiness')}
      />
      <div className="p-3 rounded-xl bg-blue-400/5 border border-blue-400/10">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-blue-400 mb-1">{t('bestCareerLanes')}</p>
        <TraitList items={bp.business.bestLanes} color="#3b82f6" />
      </div>
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-blue-400 mb-1">{t('purpose')}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{bp.business.purpose}</p>
      </div>
      <LessonBlock text={bp.business.lesson} label={tc('lesson')} />
    </CollapsibleSection>
  );
}

function ShadowSection({ bp, expanded, onToggle }: { bp: FullBlueprint; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  return (
    <CollapsibleSection
      id="shadow"
      title={t('shadowWorkGrowth')}
      icon={<Flame size={13} />}
      color="#ef4444"
      expanded={expanded}
      onToggle={onToggle}
    >
      {bp.shadowWork.perDimension.map((dim) => (
        <div key={dim.label} className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
          <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-red-400 mb-1">
            {dim.label} {t('shadows')}
          </p>
          <TraitList items={dim.shadows} color="#ef4444" />
        </div>
      ))}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-red-400 mb-1">{t('innerConflict')}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{bp.shadowWork.innerConflict}</p>
      </div>
      <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/10">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-amber-400 mb-1">{t('growthKeys')}</p>
        <TraitList items={bp.shadowWork.growthKeys} color="#f59e0b" />
      </div>
    </CollapsibleSection>
  );
}

function ExpressionSection({ bp, expanded, onToggle }: { bp: FullBlueprint; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  return (
    <CollapsibleSection
      id="expression"
      title={t('masculineVsFeminine')}
      icon={<Shield size={13} />}
      color="#8b5cf6"
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-blue-400/5 border border-blue-400/10">
          <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-blue-400 mb-1.5">
            {t('masculineHigh')}
          </p>
          <TraitList items={bp.expression.masculineHigh.slice(0, 5)} color="#3b82f6" />
        </div>
        <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
          <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-red-400 mb-1.5">
            {t('masculineShadow')}
          </p>
          <TraitList items={bp.expression.masculineShadow.slice(0, 5)} color="#ef4444" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10">
          <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-purple-400 mb-1.5">
            {t('feminineHigh')}
          </p>
          <TraitList items={bp.expression.feminineHigh.slice(0, 5)} color="#a78bfa" />
        </div>
        <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
          <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-red-400 mb-1.5">
            {t('feminineShadow')}
          </p>
          <TraitList items={bp.expression.feminineShadow.slice(0, 5)} color="#ef4444" />
        </div>
      </div>
    </CollapsibleSection>
  );
}

function TimelinesSection({ bp, expanded, onToggle }: { bp: FullBlueprint; expanded: boolean; onToggle: (id: string) => void }) {
  const t = useTranslations('blueprint');
  return (
    <CollapsibleSection
      id="timelines"
      title={t('yourTwoTimelines')}
      icon={<Sparkles size={13} />}
      color="#eab308"
      expanded={expanded}
      onToggle={onToggle}
    >
      {/* Highest */}
      <div
        className="p-3 rounded-xl border"
        style={{
          background: "rgba(251, 191, 36, 0.04)",
          borderColor: "rgba(251, 191, 36, 0.2)",
        }}
      >
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-amber-400 mb-1.5">
          {t('highestTimeline')}
        </p>
        <TraitList items={bp.timelines.highest.traits.slice(0, 6)} color="#f59e0b" />
        <p className="text-[11px] italic text-amber-300/70 mt-2 leading-relaxed">
          {bp.timelines.highest.perception}
        </p>
      </div>

      {/* Lowest */}
      <div
        className="p-3 rounded-xl border"
        style={{
          background: "rgba(239, 68, 68, 0.04)",
          borderColor: "rgba(239, 68, 68, 0.2)",
        }}
      >
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-red-400 mb-1.5">
          {t('lowestTimeline')}
        </p>
        <TraitList items={bp.timelines.lowest.traits.slice(0, 6)} color="#ef4444" />
        <p className="text-[11px] italic text-red-300/70 mt-2 leading-relaxed">
          {bp.timelines.lowest.perception}
        </p>
      </div>

      {/* Master Lesson */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-400/5 to-purple-400/5 border border-white/5">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-amber-400 mb-1">
          {t('masterLesson')}
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">{bp.timelines.masterLesson}</p>
      </div>

      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-amber-400 mb-1">
          {t('masterKeys')}
        </p>
        <TraitList items={bp.timelines.masterKeys} color="#eab308" />
      </div>
    </CollapsibleSection>
  );
}
