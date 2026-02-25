"use client";

import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: 12, md: 16, lg: 20 };

export default function VerifiedBadge({ size = "sm" }: VerifiedBadgeProps) {
  return (
    <BadgeCheck
      size={sizes[size]}
      className="text-blue-400 inline-block shrink-0"
      fill="rgba(96, 165, 250, 0.2)"
    />
  );
}
