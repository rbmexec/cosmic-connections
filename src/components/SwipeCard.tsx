"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useCallback, type ReactNode } from "react";

interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled?: boolean;
}

export default function SwipeCard({ children, onSwipeLeft, onSwipeRight, enabled = true }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 80, 200], [0, 0.6, 1]);
  const nopeOpacity = useTransform(x, [-200, -80, 0], [1, 0.6, 0]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 120;
      if (info.offset.x > threshold) {
        onSwipeRight();
      } else if (info.offset.x < -threshold) {
        onSwipeLeft();
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  if (!enabled) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      style={{ x, rotate, scale }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="relative cursor-grab"
    >
      {/* LIKE Stamp */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="swipe-stamp stamp-like"
      >
        LIKE
      </motion.div>

      {/* NOPE Stamp */}
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="swipe-stamp stamp-nope"
      >
        NOPE
      </motion.div>

      {children}
    </motion.div>
  );
}
