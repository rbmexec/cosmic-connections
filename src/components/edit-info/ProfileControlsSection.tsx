"use client";

import { useTranslations } from "next-intl";

interface ProfileControlsSectionProps {
  hideAge: boolean;
  hideDistance: boolean;
  onChangeHideAge: (v: boolean) => void;
  onChangeHideDistance: (v: boolean) => void;
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

export default function ProfileControlsSection({
  hideAge, hideDistance, onChangeHideAge, onChangeHideDistance,
}: ProfileControlsSectionProps) {
  const t = useTranslations("editInfo");

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("profileControls")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between py-3 px-4 border-b border-white/5">
          <span className="text-sm text-slate-400">{t("hideAge")}</span>
          <Toggle on={hideAge} onToggle={() => onChangeHideAge(!hideAge)} />
        </div>
        <div className="flex items-center justify-between py-3 px-4">
          <span className="text-sm text-slate-400">{t("hideDistance")}</span>
          <Toggle on={hideDistance} onToggle={() => onChangeHideDistance(!hideDistance)} />
        </div>
      </div>
    </div>
  );
}
