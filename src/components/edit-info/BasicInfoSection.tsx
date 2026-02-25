"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface BasicInfoSectionProps {
  name: string;
  occupation: string;
  currentWork: string;
  school: string;
  location: string;
  onChangeName: (v: string) => void;
  onChangeOccupation: (v: string) => void;
  onChangeCurrentWork: (v: string) => void;
  onChangeSchool: (v: string) => void;
  onChangeLocation: (v: string) => void;
}

function Row({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-white/5 last:border-b-0">
      <span className="text-sm text-slate-400 shrink-0">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-white text-right bg-transparent outline-none flex-1 ml-4 min-w-0"
        placeholder="—"
      />
    </div>
  );
}

export default function BasicInfoSection({
  name, occupation, currentWork, school, location,
  onChangeName, onChangeOccupation, onChangeCurrentWork, onChangeSchool, onChangeLocation,
}: BasicInfoSectionProps) {
  const t = useTranslations("editInfo");

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("basicInfo")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
        <Row label={t("name")} value={name} onChange={onChangeName} />
        <Row label={t("jobTitle")} value={occupation} onChange={onChangeOccupation} />
        <Row label={t("company")} value={currentWork} onChange={onChangeCurrentWork} />
        <Row label={t("school")} value={school} onChange={onChangeSchool} />
        <Row label={t("location")} value={location} onChange={onChangeLocation} />
      </div>
    </div>
  );
}
