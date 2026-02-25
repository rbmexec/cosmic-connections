"use client";

import Image from "next/image";
import { MapPin, Briefcase, GraduationCap, Heart, Music, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserProfile, LifestylePrefs, SpotifyAnthem } from "@/types/profile";

interface EditInfoPreviewProps {
  draft: Partial<UserProfile>;
}

function cmToFtIn(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${ft}'${inches}"`;
}

export default function EditInfoPreview({ draft }: EditInfoPreviewProps) {
  const t = useTranslations("editInfo");
  const photos = (draft.photos || []) as string[];
  const mainPhoto = photos[0] || draft.photo;
  const bio = draft.bio || "";
  const interests = (draft.interests || []) as string[];
  const lifestyle = (draft.lifestyle || {}) as LifestylePrefs;
  const anthem = draft.spotifyAnthem as SpotifyAnthem | undefined;

  return (
    <div className="space-y-4 pb-8">
      {/* Main photo */}
      {mainPhoto ? (
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden">
          <Image src={mainPhoto} alt={draft.name || ""} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white">
              {draft.name}
              {!draft.hideAge && draft.age && (
                <span className="font-light text-slate-300 ml-2">{draft.age}</span>
              )}
            </h2>
            {draft.occupation && (
              <p className="text-sm text-slate-300 flex items-center gap-1 mt-0.5">
                <Briefcase size={12} />
                {draft.occupation}
              </p>
            )}
            {draft.location && !draft.hideDistance && (
              <p className="text-sm text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin size={12} />
                {draft.location}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="aspect-[3/4] w-full rounded-2xl bg-white/5 flex items-center justify-center">
          <p className="text-sm text-slate-600">{t("previewEmpty")}</p>
        </div>
      )}

      {/* Bio */}
      {bio && (
        <div className="px-1">
          <p className="text-sm text-slate-300 leading-relaxed">{bio}</p>
        </div>
      )}

      {/* Details chips */}
      <div className="flex flex-wrap gap-2 px-1">
        {draft.heightCm && (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 text-xs text-slate-300 border border-white/[0.06]">
            <Ruler size={12} /> {cmToFtIn(draft.heightCm)}
          </span>
        )}
        {draft.pronouns && (
          <span className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-slate-300 border border-white/[0.06]">
            {draft.pronouns}
          </span>
        )}
        {draft.gender && draft.genderVisible && (
          <span className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-slate-300 border border-white/[0.06]">
            {draft.gender}
          </span>
        )}
        {draft.sexualOrientation && draft.orientationVisible && (
          <span className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-slate-300 border border-white/[0.06]">
            {draft.sexualOrientation}
          </span>
        )}
        {draft.school && (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 text-xs text-slate-300 border border-white/[0.06]">
            <GraduationCap size={12} /> {draft.school}
          </span>
        )}
      </div>

      {/* Relationship goal */}
      {draft.relationshipGoal && (
        <div className="px-1 flex items-center gap-2">
          <Heart size={14} className="text-pink-400" />
          <span className="text-sm text-slate-300">{t(`goal_${camelCase(draft.relationshipGoal)}`)}</span>
        </div>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <div className="px-1">
          <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("interests")}</p>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-violet-500/10 text-xs text-violet-300 border border-violet-500/20"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Spotify Anthem */}
      {anthem && (
        <div className="px-1">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/[0.06]">
            {anthem.albumArt ? (
              <Image src={anthem.albumArt} alt={anthem.name} width={44} height={44} className="rounded-lg" />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Music size={18} className="text-green-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{anthem.name}</p>
              <p className="text-xs text-slate-400 truncate">{anthem.artist}</p>
            </div>
            <Music size={14} className="text-green-400 shrink-0" />
          </div>
        </div>
      )}

      {/* Additional photos */}
      {photos.length > 1 && (
        <div className="grid grid-cols-2 gap-2 px-1">
          {photos.slice(1).map((photo, i) => (
            <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image src={photo} alt={`Photo ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
