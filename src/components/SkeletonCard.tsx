"use client";

export function SkeletonCard() {
  return (
    <div className="relative rounded-[28px] overflow-hidden max-w-sm mx-auto aspect-[3/4.2] glass-card">
      <div className="absolute inset-0 shimmer" />
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-7 space-y-3">
        <div className="h-7 w-40 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-4 w-32 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-3 w-24 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-16 w-full rounded-2xl bg-white/5 animate-pulse mt-4" />
      </div>
    </div>
  );
}

export function SkeletonMatchItem() {
  return (
    <div className="glass-card rounded-2xl p-3 flex items-center gap-3 w-full">
      <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-40 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="h-3 w-8 rounded bg-white/5 animate-pulse flex-shrink-0" />
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="space-y-3 py-4 px-1">
      <div className="flex justify-start">
        <div className="h-10 w-48 rounded-2xl bg-white/5 animate-pulse rounded-bl-sm" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-40 rounded-2xl bg-white/5 animate-pulse rounded-br-sm" />
      </div>
      <div className="flex justify-start">
        <div className="h-10 w-56 rounded-2xl bg-white/5 animate-pulse rounded-bl-sm" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-36 rounded-2xl bg-white/5 animate-pulse rounded-br-sm" />
      </div>
    </div>
  );
}
