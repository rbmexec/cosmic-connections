"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { calculateCompatibility } from "@/lib/cosmic-calculations";
import { sampleProfiles } from "@/data/profiles";
import { useSubscription } from "@/lib/subscription-context";
import DiscoveryFilters from "@/components/DiscoveryFilters";
import DiscoveryProfileSheet from "@/components/DiscoveryProfileSheet";
import type { UserProfile } from "@/types/profile";
import type { DiscoveryFilterState } from "@/types/discovery";

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

interface DiscoveryViewProps {
  currentUser: UserProfile;
  onUpgradeRequired: (trigger: string) => void;
}

export default function DiscoveryView({ currentUser, onUpgradeRequired }: DiscoveryViewProps) {
  const t = useTranslations("discovery");
  const { features } = useSubscription();

  const [filters, setFilters] = useState<DiscoveryFilterState>({
    element: null,
    zodiacSign: null,
    lifePath: null,
    chineseAnimal: null,
    sortBy: "compatibility",
  });

  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  // Calculate compatibility for all profiles
  const profilesWithScores = useMemo(() => {
    return sampleProfiles
      .filter((p) => p.id !== currentUser.id)
      .map((profile) => ({
        profile,
        score: calculateCompatibility(currentUser, profile).overall,
      }));
  }, [currentUser]);

  // Apply filters
  const filteredProfiles = useMemo(() => {
    let result = [...profilesWithScores];

    if (filters.element) {
      result = result.filter((p) => p.profile.westernZodiac.element === filters.element);
    }

    if (filters.zodiacSign) {
      result = result.filter((p) => p.profile.westernZodiac.sign === filters.zodiacSign);
    }

    // Advanced filters gated
    if (filters.lifePath && features.discoveryAdvancedFilters) {
      result = result.filter((p) => p.profile.lifePath === filters.lifePath);
    }

    if (filters.chineseAnimal && features.discoveryAdvancedFilters) {
      result = result.filter((p) => p.profile.chineseZodiac.animal === filters.chineseAnimal);
    }

    // Sort
    switch (filters.sortBy) {
      case "compatibility":
        result.sort((a, b) => b.score - a.score);
        break;
      case "name":
        result.sort((a, b) => a.profile.name.localeCompare(b.profile.name));
        break;
      case "age":
        result.sort((a, b) => a.profile.age - b.profile.age);
        break;
    }

    return result;
  }, [profilesWithScores, filters, features.discoveryAdvancedFilters]);

  const handleFilterChange = (newFilters: DiscoveryFilterState) => {
    // If user tries to use advanced filters without access, trigger upgrade
    if (!features.discoveryAdvancedFilters) {
      if (
        (newFilters.lifePath !== null && filters.lifePath === null) ||
        (newFilters.chineseAnimal !== null && filters.chineseAnimal === null)
      ) {
        onUpgradeRequired("discoveryAdvancedFilters");
        return;
      }
    }
    setFilters(newFilters);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <Compass size={20} className="text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{t("title")}</h2>
          <p className="text-xs text-slate-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Filters */}
      <DiscoveryFilters
        filters={filters}
        onChange={handleFilterChange}
        advancedEnabled={features.discoveryAdvancedFilters}
      />

      {/* Advanced filters upgrade hint */}
      {!features.discoveryAdvancedFilters && (
        <button
          onClick={() => onUpgradeRequired("discoveryAdvancedFilters")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-amber-400/20 hover:border-amber-400/40 transition-colors w-full"
        >
          <Lock size={12} className="text-amber-400" />
          <span className="text-xs text-amber-400 font-semibold">{t("unlockAdvancedFilters")}</span>
        </button>
      )}

      {/* Results count */}
      <p className="text-xs text-slate-500">
        {t("resultsCount", { count: filteredProfiles.length })}
      </p>

      {/* Profile grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredProfiles.map(({ profile, score }, index) => (
          <motion.button
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedProfile(profile)}
            className="glass-card rounded-2xl overflow-hidden text-left transition-all hover:border-white/20"
          >
            {/* Photo */}
            <div className="relative aspect-square">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
              {/* Score badge */}
              <div className="absolute bottom-2 right-2 glass-card-strong rounded-full px-2.5 py-1 flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400" />
                <span
                  className="text-xs font-bold"
                  style={{ color: getScoreColor(score) }}
                >
                  {score}%
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-sm font-semibold text-white truncate">
                {profile.name}, {profile.age}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-slate-400">
                  {profile.westernZodiac.symbol}
                </span>
                <span className="text-xs text-slate-400">
                  {profile.chineseZodiac.symbol}
                </span>
                <span className="text-[10px] text-slate-500 ml-auto">
                  LP {profile.lifePath}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Empty state */}
      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <Compass size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">{t("noResults")}</p>
          <p className="text-xs text-slate-500 mt-1">{t("adjustFilters")}</p>
        </div>
      )}

      {/* Profile detail sheet */}
      <DiscoveryProfileSheet
        profile={selectedProfile}
        currentUser={currentUser}
        onLike={() => setSelectedProfile(null)}
        onPass={() => setSelectedProfile(null)}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
}
