"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app] Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center px-6 text-center">
      <span className="text-5xl mb-4">&#x2728;</span>
      <h1 className="text-2xl font-light text-white mb-2">Something went wrong</h1>
      <p className="text-sm text-white/40 mb-8 max-w-sm">
        The cosmos experienced a brief disruption. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-full bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
