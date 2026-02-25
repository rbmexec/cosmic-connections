"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  lifePathData,
  zodiacDescriptions,
  chineseAnimalDescriptions,
} from "@/lib/cosmic-calculations";

type CosmicInfoType = "lifePath" | "westernZodiac" | "chineseZodiac";

interface CosmicInfoProps {
  type: CosmicInfoType;
  value: number | string;
  children: React.ReactNode;
  className?: string;
}

function getTooltipContent(type: CosmicInfoType, value: number | string) {
  if (type === "lifePath") {
    const data = lifePathData[value as number];
    if (!data) return null;
    return {
      title: `Life Path ${value}`,
      name: data.name,
      description: data.description,
      tags: data.traits.slice(0, 3),
    };
  }

  if (type === "westernZodiac") {
    const data = zodiacDescriptions[value as string];
    if (!data) return null;
    return {
      title: value as string,
      name: `Ruled by ${data.ruler}`,
      description: data.traits,
      tags: data.compatibleSigns.slice(0, 3),
    };
  }

  if (type === "chineseZodiac") {
    const data = chineseAnimalDescriptions[value as string];
    if (!data) return null;
    return {
      title: value as string,
      name: null,
      description: data.traits,
      tags: data.compatibleAnimals.slice(0, 3),
    };
  }

  return null;
}

export default function CosmicInfo({ type, value, children, className }: CosmicInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBelow, setShowBelow] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Click-away listener
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: PointerEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setShowBelow(rect.top < 150);
    }
    setIsOpen(true);
  }, []);

  const content = getTooltipContent(type, value);
  if (!content) return <>{children}</>;

  const tagColor =
    type === "lifePath" ? "amber" :
    type === "westernZodiac" ? "purple" : "green";

  const tagClasses: Record<string, string> = {
    amber: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    purple: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    green: "bg-green-400/10 text-green-400 border-green-400/20",
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className || ""}`}
      onMouseEnter={handleOpen}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v); }}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="cosmic-tooltip-panel"
            style={{
              [showBelow ? "top" : "bottom"]: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <p className="text-xs font-bold text-white">{content.title}</p>
            {content.name && (
              <p className="text-[10px] text-slate-400 mt-0.5">{content.name}</p>
            )}
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{content.description}</p>
            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${tagClasses[tagColor]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
