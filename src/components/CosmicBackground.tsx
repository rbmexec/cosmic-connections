"use client";

import { useEffect, useRef } from "react";

export default function CosmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 2.5 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${Math.random() * 4 + 2}s`);
      star.style.setProperty("--max-opacity", `${Math.random() * 0.6 + 0.2}`);
      star.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(star);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 cosmic-bg" />
  );
}
