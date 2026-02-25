"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import CountryCodeSelect from "@/components/CountryCodeSelect";

interface PhoneSignInProps {
  onBack: () => void;
}

export default function PhoneSignIn({ onBack }: PhoneSignInProps) {
  const t = useTranslations("auth");
  const router = useRouter();

  const [view, setView] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [fullPhone, setFullPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP state
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const sendCode = useCallback(async () => {
    setError("");
    setLoading(true);

    const number = `${countryCode}${phone}`;

    try {
      const res = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: number }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("sendFailed"));
        setLoading(false);
        return;
      }

      setFullPhone(number);
      setView("otp");
      setResendCooldown(30);
      setOtpCode(["", "", "", "", "", ""]);
    } catch {
      setError(t("sendFailed"));
    } finally {
      setLoading(false);
    }
  }, [countryCode, phone, t]);

  const verifyCode = useCallback(
    async (code: string) => {
      setError("");
      setLoading(true);

      try {
        const result = await signIn("phone-otp", {
          phone: fullPhone,
          code,
          redirect: false,
        });

        if (result?.error) {
          setError(t("invalidCode"));
          setOtpCode(["", "", "", "", "", ""]);
          otpRefs.current[0]?.focus();
        } else {
          router.push("/");
        }
      } catch {
        setError(t("invalidCode"));
      } finally {
        setLoading(false);
      }
    },
    [fullPhone, router, t]
  );

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    if (value && index === 5) {
      const complete = newCode.join("");
      if (complete.length === 6) {
        verifyCode(complete);
      }
    } else if (value) {
      // Check if all filled after updating non-last digit
      const complete = newCode.join("");
      if (complete.length === 6) {
        verifyCode(complete);
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setView("phone");
    setOtpCode(["", "", "", "", "", ""]);
    setError("");
    // Resend by going back to phone view so user taps Send Code again
    // Or auto-resend:
    sendCode();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4 w-full"
    >
      {view === "phone" ? (
        <>
          {/* Phone input */}
          <div className="flex gap-3 items-center w-full">
            <CountryCodeSelect
              value={countryCode}
              onChange={setCountryCode}
            />
            <div className="flex-1 border-b border-white/15 pb-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Phone number"
                autoFocus
                className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Send Code button */}
          <button
            onClick={sendCode}
            disabled={loading || phone.length < 7}
            className="w-full py-4 rounded-full font-bold text-base text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all active:scale-[0.98] shadow-lg shadow-violet-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : t("sendCode")}
          </button>

          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors py-2"
          >
            <ArrowLeft size={14} />
            <span>{t("back")}</span>
          </button>
        </>
      ) : (
        <>
          {/* OTP sent message */}
          <p className="text-sm text-slate-400 text-center">
            {t("otpSent", { phone: fullPhone })}
          </p>

          {/* 6-digit OTP input */}
          <div className="flex justify-center gap-2.5">
            {otpCode.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  otpRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                autoFocus={i === 0}
                disabled={loading}
                className={`w-12 h-14 rounded-xl border text-center text-xl font-bold outline-none transition-all ${
                  digit
                    ? "border-violet-400/60 bg-violet-400/10 text-white"
                    : "border-white/15 bg-white/5 text-white"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors disabled:text-slate-600"
          >
            {resendCooldown > 0
              ? `${t("resendCode")} (${resendCooldown}s)`
              : t("resendCode")}
          </button>

          {/* Back to phone input */}
          <button
            onClick={() => {
              setView("phone");
              setError("");
              setOtpCode(["", "", "", "", "", ""]);
            }}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors py-2"
          >
            <ArrowLeft size={14} />
            <span>{t("back")}</span>
          </button>
        </>
      )}
    </motion.div>
  );
}
