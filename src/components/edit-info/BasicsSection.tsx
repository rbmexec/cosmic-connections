"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  educationLevelOptions,
  communicationStyleOptions,
  loveStyleOptions,
} from "@/data/edit-info-options";

interface BasicsSectionProps {
  zodiacSign?: string;
  educationLevel?: string;
  communicationStyle?: string;
  loveStyle?: string;
  onChangeEducation: (v: string | undefined) => void;
  onChangeCommunication: (v: string | undefined) => void;
  onChangeLoveStyle: (v: string | undefined) => void;
}

const eduI18n: Record<string, string> = {
  "high-school": "edu_highSchool",
  "trade-school": "edu_tradeSchool",
  "in-college": "edu_inCollege",
  bachelors: "edu_bachelors",
  masters: "edu_masters",
  phd: "edu_phd",
};

const commI18n: Record<string, string> = {
  "in-person": "comm_inPerson",
  "phone-caller": "comm_phoneCaller",
  texter: "comm_texter",
  "video-chatter": "comm_videoChatter",
};

const loveI18n: Record<string, string> = {
  touch: "love_touch",
  words: "love_words",
  "quality-time": "love_qualityTime",
  acts: "love_acts",
  gifts: "love_gifts",
};

function PickerField({
  label,
  value,
  options,
  i18nMap,
  onChange,
  t,
  readOnly,
}: {
  label: string;
  value?: string;
  options?: readonly string[];
  i18nMap?: Record<string, string>;
  onChange?: (v: string | undefined) => void;
  t: ReturnType<typeof useTranslations>;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => !readOnly && setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-4"
        disabled={readOnly}
      >
        <span className="text-sm text-slate-400">{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-white">
            {value ? (i18nMap ? t(i18nMap[value] || value) : value) : "—"}
          </span>
          {!readOnly && (
            <ChevronDown
              size={14}
              className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </button>
      {open && options && i18nMap && onChange && (
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

export default function BasicsSection({
  zodiacSign, educationLevel, communicationStyle, loveStyle,
  onChangeEducation, onChangeCommunication, onChangeLoveStyle,
}: BasicsSectionProps) {
  const t = useTranslations("editInfo");

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("basics")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
        {zodiacSign && (
          <PickerField
            label={t("zodiacSign")}
            value={zodiacSign}
            t={t}
            readOnly
          />
        )}
        <PickerField
          label={t("education")}
          value={educationLevel}
          options={educationLevelOptions}
          i18nMap={eduI18n}
          onChange={onChangeEducation}
          t={t}
        />
        <PickerField
          label={t("communicationStyle")}
          value={communicationStyle}
          options={communicationStyleOptions}
          i18nMap={commI18n}
          onChange={onChangeCommunication}
          t={t}
        />
        <PickerField
          label={t("loveStyle")}
          value={loveStyle}
          options={loveStyleOptions}
          i18nMap={loveI18n}
          onChange={onChangeLoveStyle}
          t={t}
        />
      </div>
    </div>
  );
}
