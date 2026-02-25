"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Mail, Loader2 } from "lucide-react";
import {
  isValidEmailFormat,
  isDisposableEmail,
  detectEmailTypo,
} from "@/lib/email-validation";

export default function SignInButtons() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const runClientChecks = (value: string) => {
    setError("");
    setSuggestion(null);

    if (!value.trim()) return;

    if (!isValidEmailFormat(value)) {
      setError("Please enter a valid email address");
      return;
    }

    if (isDisposableEmail(value)) {
      setError("Disposable email addresses are not allowed");
      return;
    }

    const typo = detectEmailTypo(value);
    if (typo) {
      setSuggestion(typo);
    }
  };

  const handleBlur = () => {
    runClientChecks(email);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Client-side checks first
    if (!isValidEmailFormat(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (isDisposableEmail(email)) {
      setError("Disposable email addresses are not allowed");
      return;
    }

    // Server-side validation (format + disposable + MX check)
    setValidating(true);
    setError("");
    try {
      const res = await fetch("/api/email/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (data.suggestion) {
        setSuggestion(data.suggestion);
      }

      if (!data.valid) {
        setError(data.error || "Invalid email address");
        setValidating(false);
        return;
      }
    } catch {
      setError("Could not validate email. Please try again.");
      setValidating(false);
      return;
    }
    setValidating(false);

    // Email passed all checks — send magic link
    setLoading(true);
    try {
      const result = await signIn("resend", { email, redirect: false });
      if (result?.error) {
        setError(result.error);
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      setEmail(suggestion);
      setSuggestion(null);
      setError("");
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/20">
          <Mail size={24} className="text-violet-400" />
        </div>
        <p className="text-white font-semibold text-sm text-center">
          {t("checkEmail")}
        </p>
        <p className="text-slate-400 text-xs text-center">
          {t("magicLinkSent", { email })}
        </p>
        <button
          onClick={() => setEmailSent(false)}
          className="text-sm text-white/50 hover:text-white transition-colors py-2"
        >
          {t("tryDifferentEmail")}
        </button>
      </div>
    );
  }

  const isSubmitting = loading || validating;

  return (
    <div className="flex flex-col gap-3 w-full">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs break-all">
          {error}
        </div>
      )}
      {suggestion && (
        <button
          type="button"
          onClick={applySuggestion}
          className="px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs text-left hover:bg-amber-500/25 transition-colors"
        >
          Did you mean <span className="font-semibold underline">{suggestion}</span>?
        </button>
      )}
      {/* Email magic link */}
      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
            if (suggestion) setSuggestion(null);
          }}
          onBlur={handleBlur}
          placeholder={t("emailPlaceholder")}
          required
          className="w-full py-4 px-5 rounded-full bg-white/5 text-white text-sm border border-white/15 placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="flex items-center justify-center gap-3 w-full py-4 px-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Mail size={20} />
          )}
          {validating ? "Validating..." : t("continueWithEmail")}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30">{t("or")}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Google */}
      <button
        onClick={() => signIn("google", { redirectTo: "/" })}
        className="flex items-center justify-center gap-3 w-full py-4 px-4 rounded-full bg-white text-slate-800 font-semibold text-sm hover:bg-slate-100 transition-colors active:scale-[0.98]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {t("signInWithGoogle")}
      </button>
    </div>
  );
}
