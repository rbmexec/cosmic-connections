"use client";

import { useTranslations } from "next-intl";

interface AboutMeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AboutMeEditor({ value, onChange }: AboutMeEditorProps) {
  const t = useTranslations("editInfo");

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("aboutMe")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] p-3">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= 500) onChange(e.target.value);
          }}
          placeholder={t("aboutMePlaceholder")}
          className="w-full bg-transparent text-sm text-white placeholder-slate-600 resize-none outline-none min-h-[100px]"
          maxLength={500}
        />
        <p className="text-right text-[10px] text-slate-600 mt-1">
          {t("charCount", { count: value.length })}
        </p>
      </div>
    </div>
  );
}
