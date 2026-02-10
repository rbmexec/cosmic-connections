"use client";

import { useEffect, useRef } from "react";

export default function CosmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create stars
    for (let i = 0; i < 120; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2 + 0.5;
      const isBright = Math.random() > 0.85;
      star.className = `star${isBright ? " star-bright" : ""}`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${Math.random() * 4 + 2}s`);
      star.style.setProperty("--max-opacity", `${isBright ? 1 : Math.random() * 0.5 + 0.2}`);
      star.style.animationDelay = `${Math.random() * 6}s`;
      container.appendChild(star);
    }

    // Create nebula orbs
    const nebulas = [
      { color: "rgba(167, 139, 250, 0.15)", size: 300, x: 10, y: 15, duration: 25 },
      { color: "rgba(236, 72, 153, 0.12)", size: 250, x: 80, y: 10, duration: 30 },
      { color: "rgba(59, 130, 246, 0.1)", size: 350, x: 50, y: 80, duration: 22 },
      { color: "rgba(249, 115, 22, 0.08)", size: 200, x: 75, y: 55, duration: 28 },
      { color: "rgba(16, 185, 129, 0.06)", size: 280, x: 25, y: 65, duration: 35 },
    ];

    nebulas.forEach((n) => {
      const orb = document.createElement("div");
      orb.className = "nebula-orb";
      orb.style.width = `${n.size}px`;
      orb.style.height = `${n.size}px`;
      orb.style.left = `${n.x}%`;
      orb.style.top = `${n.y}%`;
      orb.style.background = n.color;
      orb.style.setProperty("--drift-duration", `${n.duration}s`);
      container.appendChild(orb);
    });

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 cosmic-bg overflow-hidden" />
  );
}
