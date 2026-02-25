"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  relationshipGoalOptions,
  relationshipTypeOptions,
  familyPlanOptions,
} from "@/data/edit-info-options";

interface RelationshipSectionProps {
  relationshipGoal?: string;
  relationshipType?: string;
  familyPlans?: string;
  onChangeGoal: (v: string | undefined) => void;
  onChangeType: (v: string | undefined) => void;
  onChangeFamilyPlans: (v: string | undefined) => void;
}

const goalI18n: Record<string, string> = {
  "long-term": "goal_longTerm",
  "short-term": "goal_shortTerm",
  friends: "goal_friends",
  "figuring-out": "goal_figuringOut",
};

const typeI18n: Record<string, string> = {
  monogamy: "type_monogamy",
  "non-monogamy": "type_nonMonogamy",
  "open-to-both": "type_openToBoth",
};

const familyI18n: Record<string, string> = {
  want: "family_want",
  "dont-want": "family_dontWant",
  "have-and-want-more": "family_haveAndWantMore",
  "have-and-dont-want-more": "family_haveAndDontWantMore",
  "open-to-it": "family_openToIt",
  "not-sure": "family_notSure",
};

function PickerField({
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

export default function RelationshipSection({
  relationshipGoal, relationshipType, familyPlans,
  onChangeGoal, onChangeType, onChangeFamilyPlans,
}: RelationshipSectionProps) {
  const t = useTranslations("editInfo");

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("relationship")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
        <PickerField
          label={t("relationshipGoal")}
          value={relationshipGoal}
          options={relationshipGoalOptions}
          i18nMap={goalI18n}
          onChange={onChangeGoal}
          t={t}
        />
        <PickerField
          label={t("relationshipType")}
          value={relationshipType}
          options={relationshipTypeOptions}
          i18nMap={typeI18n}
          onChange={onChangeType}
          t={t}
        />
        <PickerField
          label={t("familyPlans")}
          value={familyPlans}
          options={familyPlanOptions}
          i18nMap={familyI18n}
          onChange={onChangeFamilyPlans}
          t={t}
        />
      </div>
    </div>
  );
}
