"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  pronounOptions,
  genderOptions,
  orientationOptions,
} from "@/data/edit-info-options";

interface DetailsSectionProps {
  pronouns?: string;
  heightCm?: number;
  gender?: string;
  genderVisible: boolean;
  sexualOrientation?: string;
  orientationVisible: boolean;
  onChangePronouns: (v: string | undefined) => void;
  onChangeHeight: (v: number | undefined) => void;
  onChangeGender: (v: string | undefined) => void;
  onChangeGenderVisible: (v: boolean) => void;
  onChangeOrientation: (v: string | undefined) => void;
  onChangeOrientationVisible: (v: boolean) => void;
}

const i18nPronounKey: Record<string, string> = {
  "he/him": "pronouns_he",
  "she/her": "pronouns_she",
  "they/them": "pronouns_they",
};

const i18nGenderKey: Record<string, string> = {
  man: "gender_man",
  woman: "gender_woman",
  "non-binary": "gender_nonBinary",
  transgender: "gender_transgender",
  genderqueer: "gender_genderqueer",
  genderfluid: "gender_genderfluid",
};

const i18nOrientationKey: Record<string, string> = {
  straight: "orientation_straight",
  gay: "orientation_gay",
  lesbian: "orientation_lesbian",
  bisexual: "orientation_bisexual",
  pansexual: "orientation_pansexual",
  asexual: "orientation_asexual",
  queer: "orientation_queer",
  questioning: "orientation_questioning",
};

function cmToFtIn(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${ft}'${inches}"`;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-6 rounded-full transition-colors relative ${
        on ? "bg-violet-500" : "bg-white/10"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function PickerRow({
  label,
  value,
  options,
  i18nMap,
  onChange,
  t,
}: {
  label: string;
  value?: string;
  options: readonly string[];
  i18nMap: Record<string, string>;
  onChange: (v: string | undefined) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-4"
      >
        <span className="text-sm text-slate-400">{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-white">
            {value ? t(i18nMap[value] || value) : "—"}
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(value === opt ? undefined : opt);
                setOpen(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                value === opt
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "bg-white/5 text-slate-400 border border-white/[0.06]"
              }`}
            >
              {t(i18nMap[opt] || opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DetailsSection({
  pronouns, heightCm, gender, genderVisible,
  sexualOrientation, orientationVisible,
  onChangePronouns, onChangeHeight, onChangeGender, onChangeGenderVisible,
  onChangeOrientation, onChangeOrientationVisible,
}: DetailsSectionProps) {
  const t = useTranslations("editInfo");
  const [useCm, setUseCm] = useState(false);
  const [heightInput, setHeightInput] = useState(heightCm ? String(heightCm) : "");

  const handleHeightChange = (val: string) => {
    setHeightInput(val);
    const num = parseInt(val, 10);
    onChangeHeight(isNaN(num) ? undefined : num);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("details")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
        <PickerRow
          label={t("pronouns")}
          value={pronouns}
          options={pronounOptions}
          i18nMap={i18nPronounKey}
          onChange={onChangePronouns}
          t={t}
        />

        {/* Height */}
        <div className="flex items-center justify-between py-3 px-4 border-b border-white/5">
          <span className="text-sm text-slate-400">{t("height")}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={heightInput}
              onChange={(e) => handleHeightChange(e.target.value)}
              placeholder="—"
              className="w-16 text-sm text-white text-right bg-transparent outline-none"
            />
            <button
              onClick={() => setUseCm(!useCm)}
              className="text-[10px] text-violet-400 font-bold uppercase"
            >
              {useCm ? t("cm") : t("ft")}
            </button>
            {heightCm && !useCm && (
              <span className="text-xs text-slate-500">{cmToFtIn(heightCm)}</span>
            )}
          </div>
        </div>

        {/* Gender + visibility */}
        <PickerRow
          label={t("gender")}
          value={gender}
          options={genderOptions}
          i18nMap={i18nGenderKey}
          onChange={onChangeGender}
          t={t}
        />
        {gender && (
          <div className="flex items-center justify-between py-2 px-4 border-b border-white/5">
            <span className="text-xs text-slate-500">{t("visibleOnProfile")}</span>
            <Toggle on={genderVisible} onToggle={() => onChangeGenderVisible(!genderVisible)} />
          </div>
        )}

        {/* Orientation + visibility */}
        <PickerRow
          label={t("sexualOrientation")}
          value={sexualOrientation}
          options={orientationOptions}
          i18nMap={i18nOrientationKey}
          onChange={onChangeOrientation}
          t={t}
        />
        {sexualOrientation && (
          <div className="flex items-center justify-between py-2 px-4 border-b border-white/5 last:border-b-0">
            <span className="text-xs text-slate-500">{t("visibleOnProfile")}</span>
            <Toggle on={orientationVisible} onToggle={() => onChangeOrientationVisible(!orientationVisible)} />
          </div>
        )}
      </div>
    </div>
  );
}
