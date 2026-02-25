"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserProfile, LifestylePrefs, SpotifyAnthem } from "@/types/profile";
import PhotoGrid from "@/components/edit-info/PhotoGrid";
import AboutMeEditor from "@/components/edit-info/AboutMeEditor";
import BasicInfoSection from "@/components/edit-info/BasicInfoSection";
import InterestsPicker from "@/components/edit-info/InterestsPicker";
import DetailsSection from "@/components/edit-info/DetailsSection";
import RelationshipSection from "@/components/edit-info/RelationshipSection";
import BasicsSection from "@/components/edit-info/BasicsSection";
import LifestyleSection from "@/components/edit-info/LifestyleSection";
import SpotifyAnthemPicker from "@/components/edit-info/SpotifyAnthemPicker";
import ProfileControlsSection from "@/components/edit-info/ProfileControlsSection";
import EditInfoPreview from "@/components/edit-info/EditInfoPreview";

interface EditInfoPageProps {
  profile?: UserProfile;
  onClose: () => void;
  onProfileUpdate?: (updated: Partial<UserProfile>) => void;
}

type Tab = "edit" | "preview";

export default function EditInfoPage({ profile, onClose, onProfileUpdate }: EditInfoPageProps) {
  const t = useTranslations("editInfo");
  const [tab, setTab] = useState<Tab>("edit");
  const [saving, setSaving] = useState(false);

  // Draft state — clone from profile on mount
  const [draft, setDraft] = useState<Partial<UserProfile>>(() => ({
    name: profile?.name || "",
    occupation: profile?.occupation || "",
    currentWork: profile?.currentWork || "",
    school: profile?.school || "",
    location: profile?.location || "",
    photos: profile?.photos || [],
    bio: profile?.bio || "",
    interests: profile?.interests || [],
    pronouns: profile?.pronouns,
    heightCm: profile?.heightCm,
    gender: profile?.gender,
    genderVisible: profile?.genderVisible ?? true,
    sexualOrientation: profile?.sexualOrientation,
    orientationVisible: profile?.orientationVisible ?? true,
    relationshipGoal: profile?.relationshipGoal,
    relationshipType: profile?.relationshipType,
    familyPlans: profile?.familyPlans,
    educationLevel: profile?.educationLevel,
    communicationStyle: profile?.communicationStyle,
    loveStyle: profile?.loveStyle,
    lifestyle: profile?.lifestyle || {},
    spotifyAnthem: profile?.spotifyAnthem,
    hideAge: profile?.hideAge ?? false,
    hideDistance: profile?.hideDistance ?? false,
    languages: profile?.languages || [],
  }));

  const update = useCallback(<K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile) return;
    setSaving(true);
    try {
      // Merge draft into full profile for API
      const payload = { ...profile, ...draft };
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onProfileUpdate?.(draft);
        onClose();
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }, [profile, draft, onProfileUpdate, onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={22} />
          </button>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-white/5 rounded-full p-0.5">
            {(["edit", "preview"] as Tab[]).map((t_) => (
              <button
                key={t_}
                onClick={() => setTab(t_)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  tab === t_
                    ? "bg-violet-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t(t_)}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
          >
            <Check size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            {tab === "edit" ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Photos */}
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("photosSection")}</p>
                  <PhotoGrid
                    photos={(draft.photos || []) as string[]}
                    onChange={(photos) => update("photos", photos)}
                  />
                </div>

                {/* About Me */}
                <AboutMeEditor
                  value={(draft.bio || "") as string}
                  onChange={(bio) => update("bio", bio)}
                />

                {/* Basic Info */}
                <BasicInfoSection
                  name={(draft.name || "") as string}
                  occupation={(draft.occupation || "") as string}
                  currentWork={(draft.currentWork || "") as string}
                  school={(draft.school || "") as string}
                  location={(draft.location || "") as string}
                  onChangeName={(v) => update("name", v)}
                  onChangeOccupation={(v) => update("occupation", v)}
                  onChangeCurrentWork={(v) => update("currentWork", v)}
                  onChangeSchool={(v) => update("school", v)}
                  onChangeLocation={(v) => update("location", v)}
                />

                {/* Interests */}
                <InterestsPicker
                  selected={(draft.interests || []) as string[]}
                  onChange={(interests) => update("interests", interests)}
                />

                {/* Details */}
                <DetailsSection
                  pronouns={draft.pronouns}
                  heightCm={draft.heightCm}
                  gender={draft.gender}
                  genderVisible={draft.genderVisible ?? true}
                  sexualOrientation={draft.sexualOrientation}
                  orientationVisible={draft.orientationVisible ?? true}
                  onChangePronouns={(v) => update("pronouns", v as string)}
                  onChangeHeight={(v) => update("heightCm", v as number)}
                  onChangeGender={(v) => update("gender", v as string)}
                  onChangeGenderVisible={(v) => update("genderVisible", v)}
                  onChangeOrientation={(v) => update("sexualOrientation", v as string)}
                  onChangeOrientationVisible={(v) => update("orientationVisible", v)}
                />

                {/* Relationship */}
                <RelationshipSection
                  relationshipGoal={draft.relationshipGoal}
                  relationshipType={draft.relationshipType}
                  familyPlans={draft.familyPlans}
                  onChangeGoal={(v) => update("relationshipGoal", v as string)}
                  onChangeType={(v) => update("relationshipType", v as string)}
                  onChangeFamilyPlans={(v) => update("familyPlans", v as string)}
                />

                {/* More About Me (Basics) */}
                <BasicsSection
                  zodiacSign={profile?.westernZodiac?.sign}
                  educationLevel={draft.educationLevel}
                  communicationStyle={draft.communicationStyle}
                  loveStyle={draft.loveStyle}
                  onChangeEducation={(v) => update("educationLevel", v as string)}
                  onChangeCommunication={(v) => update("communicationStyle", v as string)}
                  onChangeLoveStyle={(v) => update("loveStyle", v as string)}
                />

                {/* Lifestyle */}
                <LifestyleSection
                  lifestyle={(draft.lifestyle || {}) as LifestylePrefs}
                  onChange={(lifestyle) => update("lifestyle", lifestyle)}
                />

                {/* Spotify Anthem */}
                <SpotifyAnthemPicker
                  anthem={draft.spotifyAnthem}
                  onChange={(anthem) => update("spotifyAnthem", anthem as SpotifyAnthem)}
                />

                {/* Profile Controls */}
                <ProfileControlsSection
                  hideAge={draft.hideAge ?? false}
                  hideDistance={draft.hideDistance ?? false}
                  onChangeHideAge={(v) => update("hideAge", v)}
                  onChangeHideDistance={(v) => update("hideDistance", v)}
                />

                {/* Bottom padding for scroll */}
                <div className="h-8" />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15 }}
              >
                <EditInfoPreview draft={{ ...profile, ...draft }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
