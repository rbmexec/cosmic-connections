"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface VerificationFlowProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
}

type VerificationStep = "upload" | "selfie" | "verifying" | "success" | "failed";

export default function VerificationFlow({ open, onClose, onVerified }: VerificationFlowProps) {
  const t = useTranslations("verification");
  const [step, setStep] = useState<VerificationStep>("upload");

  const handleUploadId = () => setStep("selfie");

  const handleTakeSelfie = () => {
    setStep("verifying");
    setTimeout(() => {
      if (Math.random() < 0.8) {
        setStep("success");
        onVerified();
      } else {
        setStep("failed");
      }
    }, 2000);
  };

  const handleRetry = () => setStep("upload");

  const handleClose = () => {
    setStep("upload");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-[28px] p-6 max-w-sm w-full text-center"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {step === "upload" && (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Upload size={40} className="text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{t("uploadId")}</h3>
                  <p className="text-sm text-slate-400 mb-6">Upload a photo of your government-issued ID</p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUploadId}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold"
                  >
                    {t("uploadId")}
                  </motion.button>
                </motion.div>
              )}

              {step === "selfie" && (
                <motion.div key="selfie" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Camera size={40} className="text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{t("takeSelfie")}</h3>
                  <p className="text-sm text-slate-400 mb-6">Take a selfie to match against your ID</p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleTakeSelfie}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold"
                  >
                    {t("takeSelfie")}
                  </motion.button>
                </motion.div>
              )}

              {step === "verifying" && (
                <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 size={40} className="text-blue-400 mx-auto mb-3" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">{t("verifying")}</h3>
                  <p className="text-sm text-slate-400">Checking your identity...</p>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{t("verificationSuccess")}</h3>
                  <p className="text-sm text-slate-400 mb-6">{t("verified")}</p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold"
                  >
                    Done
                  </motion.button>
                </motion.div>
              )}

              {step === "failed" && (
                <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <XCircle size={48} className="text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{t("verificationFailed")}</h3>
                  <p className="text-sm text-slate-400 mb-6">Please try again with clearer images</p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRetry}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold"
                  >
                    {t("tryAgain")}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step indicators */}
            {(step === "upload" || step === "selfie") && (
              <div className="flex justify-center gap-2 mt-5">
                {["upload", "selfie", "verifying", "result"].map((s, i) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i <= (step === "upload" ? 0 : 1) ? "bg-blue-400" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
