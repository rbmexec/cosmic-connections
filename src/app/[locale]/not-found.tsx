import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl mb-4">&#x1F30C;</span>
      <h1 className="text-4xl font-extralight text-white mb-2">404</h1>
      <p className="text-sm text-white/40 mb-8 max-w-sm">
        This page has drifted beyond the stars. Let&apos;s get you back on course.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
