"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { promptQuestions } from "@/lib/prompt-questions";
import { useSubscription } from "@/lib/subscription-context";
import type { Prompt } from "@/types/profile";

interface PromptEditorProps {
  prompts: Prompt[];
  onChange: (prompts: Prompt[]) => void;
}

export default function PromptEditor({ prompts, onChange }: PromptEditorProps) {
  const t = useTranslations("prompts");
  const { features } = useSubscription();
  const [editing, setEditing] = useState<number | null>(null);
  const [picking, setPicking] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState("");
  const [draftAnswer, setDraftAnswer] = useState("");

  const maxPrompts = features.extendedPrompts ? 8 : 4;
  const usedQuestions = prompts.map((p) => p.question);
  const availableQuestions = promptQuestions.filter((q) => !usedQuestions.includes(q));

  const handlePickQuestion = (question: string) => {
    setDraftQuestion(question);
    setDraftAnswer("");
    setPicking(false);
    setEditing(prompts.length);
  };

  const handleSave = () => {
    if (!draftQuestion.trim() || !draftAnswer.trim()) return;
    const newPrompt = { question: draftQuestion, answer: draftAnswer };
    if (editing !== null && editing < prompts.length) {
      const updated = [...prompts];
      updated[editing] = newPrompt;
      onChange(updated);
    } else {
      onChange([...prompts, newPrompt]);
    }
    setEditing(null);
    setDraftQuestion("");
    setDraftAnswer("");
  };

  const handleEdit = (index: number) => {
    setDraftQuestion(prompts[index].question);
    setDraftAnswer(prompts[index].answer);
    setEditing(index);
  };

  const handleDelete = (index: number) => {
    onChange(prompts.filter((_, i) => i !== index));
    if (editing === index) {
      setEditing(null);
      setDraftQuestion("");
      setDraftAnswer("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-400">
          {t("myPrompts")}
        </h4>
        <span className="text-[10px] text-slate-500">{prompts.length}/{maxPrompts}</span>
      </div>

      {/* Existing prompts */}
      {prompts.map((prompt, i) => (
        <motion.div
          key={i}
          layout
          className="p-3 rounded-xl glass-card group relative"
        >
          <div className="flex items-start gap-2">
            <GripVertical size={14} className="text-slate-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-0.5">{prompt.question}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{prompt.answer}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => handleEdit(i)} className="p-1 rounded hover:bg-white/10">
                <Pencil size={12} className="text-slate-400" />
              </button>
              <button onClick={() => handleDelete(i)} className="p-1 rounded hover:bg-white/10">
                <X size={12} className="text-slate-400" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Add prompt button */}
      {prompts.length < maxPrompts && editing === null && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setPicking(true)}
          className="w-full p-3 rounded-xl border border-dashed border-teal-700/40 text-xs text-teal-400 flex items-center justify-center gap-2 hover:border-teal-500/50 transition-all"
        >
          <Plus size={14} />
          {t("addPrompt")}
        </motion.button>
      )}

      {prompts.length >= maxPrompts && !features.extendedPrompts && (
        <p className="text-[10px] text-amber-400/70 text-center">{t("maxPromptsReached")}</p>
      )}

      {/* Question picker */}
      <AnimatePresence>
        {picking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 max-h-48 overflow-y-auto"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{t("chooseQuestion")}</p>
            {availableQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handlePickQuestion(q)}
                className="w-full text-left p-2.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition-all border border-transparent hover:border-teal-700/30"
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-xl glass-card-strong border border-amber-400/20 space-y-3"
          >
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">{draftQuestion}</p>
            <textarea
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              placeholder={t("writeAnswer")}
              autoFocus
              rows={3}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(null); setDraftQuestion(""); setDraftAnswer(""); }}
                className="flex-1 py-2 rounded-xl border border-slate-600/50 text-xs text-slate-400"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!draftAnswer.trim()}
                className="flex-1 py-2 rounded-xl bg-amber-400/20 text-xs text-amber-400 font-semibold disabled:opacity-40"
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
