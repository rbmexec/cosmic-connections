"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Briefcase, FolderOpen, GraduationCap, Save } from "lucide-react";
import type { WorkExperience, Project, UserProfile } from "@/types/profile";

interface PortfolioEditorProps {
  user: UserProfile;
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    workExperience: WorkExperience[];
    projects: Project[];
    currentWork: string;
    school: string;
  }) => void;
}

export default function PortfolioEditor({ user, open, onClose, onSave }: PortfolioEditorProps) {
  const tp = useTranslations("personal");
  const tc = useTranslations("common");
  const tcompat = useTranslations("compatibility");

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(
    user.workExperience ?? []
  );
  const [projects, setProjects] = useState<Project[]>(user.projects ?? []);
  const [currentWork, setCurrentWork] = useState(user.currentWork ?? "");
  const [school, setSchool] = useState(user.school ?? "");
  const [saving, setSaving] = useState(false);

  function addWorkExperience() {
    setWorkExperience((prev) => [
      ...prev,
      { title: "", company: "", startDate: new Date().toISOString().slice(0, 7) },
    ]);
  }

  function removeWorkExperience(index: number) {
    setWorkExperience((prev) => prev.filter((_, i) => i !== index));
  }

  function updateWorkExperience(index: number, field: keyof WorkExperience, value: string | undefined) {
    setWorkExperience((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  }

  function addProject() {
    setProjects((prev) => [...prev, { title: "", description: "" }]);
  }

  function removeProject(index: number) {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  function updateProject(index: number, field: keyof Project, value: string) {
    setProjects((prev) =>
      prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj))
    );
  }

  async function handleSave() {
    setSaving(true);
    const filteredWork = workExperience.filter((e) => e.title.trim() || e.company.trim());
    const filteredProjects = projects.filter((p) => p.title.trim());
    onSave({
      workExperience: filteredWork,
      projects: filteredProjects,
      currentWork: currentWork.trim(),
      school: school.trim(),
    });
    setSaving(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px]"
            style={{
              background: "linear-gradient(180deg, #0d3d38 0%, #042f2e 100%)",
              border: "1px solid rgba(251, 191, 36, 0.15)",
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 pb-3" style={{ background: "rgba(13, 61, 56, 0.95)", backdropFilter: "blur(8px)" }}>
              <div>
                <h2 className="text-lg font-bold text-white">{tp("portfolio")}</h2>
                <p className="text-[11px] text-slate-400">{tp("portfolioDesc")}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            <div className="p-5 pt-2 space-y-6">
              {/* Current Work */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 mb-2">
                  <Briefcase size={11} />
                  {tp("currentWork")}
                </label>
                <input
                  type="text"
                  value={currentWork}
                  onChange={(e) => setCurrentWork(e.target.value)}
                  placeholder="e.g. Designer at Apple"
                  className="w-full rounded-xl p-3 bg-teal-900/30 border border-teal-700/30 text-white text-sm placeholder-teal-500/40 outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>

              {/* School */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 mb-2">
                  <GraduationCap size={11} />
                  {tp("school")}
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full rounded-xl p-3 bg-teal-900/30 border border-teal-700/30 text-white text-sm placeholder-teal-500/40 outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>

              {/* Work Experience */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400">
                    <Briefcase size={11} />
                    {tcompat("workExperience")}
                  </label>
                  <button
                    onClick={addWorkExperience}
                    className="flex items-center gap-1 text-[10px] text-teal-300 hover:text-teal-200 transition-colors"
                  >
                    <Plus size={12} />
                    {tc("add") || "Add"}
                  </button>
                </div>
                <div className="space-y-3">
                  {workExperience.map((exp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-teal-900/20 border border-teal-700/20 space-y-2">
                      <div className="flex items-start justify-between">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateWorkExperience(i, "title", e.target.value)}
                          placeholder="Role title"
                          className="flex-1 bg-transparent text-white text-sm placeholder-teal-500/40 outline-none"
                        />
                        <button onClick={() => removeWorkExperience(i)} className="text-red-400/60 hover:text-red-400 ml-2 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(i, "company", e.target.value)}
                        placeholder="Company"
                        className="w-full bg-transparent text-slate-300 text-[13px] placeholder-teal-500/40 outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateWorkExperience(i, "startDate", e.target.value)}
                          className="flex-1 bg-transparent text-slate-400 text-[11px] outline-none [color-scheme:dark]"
                        />
                        <span className="text-slate-500 text-[11px] self-center">—</span>
                        <input
                          type="month"
                          value={exp.endDate ?? ""}
                          onChange={(e) =>
                            updateWorkExperience(i, "endDate", e.target.value || undefined)
                          }
                          placeholder="Present"
                          className="flex-1 bg-transparent text-slate-400 text-[11px] outline-none [color-scheme:dark]"
                        />
                      </div>
                      <input
                        type="text"
                        value={exp.description ?? ""}
                        onChange={(e) => updateWorkExperience(i, "description", e.target.value || undefined)}
                        placeholder="Brief description (optional)"
                        className="w-full bg-transparent text-slate-400 text-[11px] placeholder-teal-500/30 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400">
                    <FolderOpen size={11} />
                    {tcompat("projects")}
                  </label>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 text-[10px] text-teal-300 hover:text-teal-200 transition-colors"
                  >
                    <Plus size={12} />
                    {tc("add") || "Add"}
                  </button>
                </div>
                <div className="space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="p-3 rounded-xl bg-teal-900/20 border border-teal-700/20 space-y-2">
                      <div className="flex items-start justify-between">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(i, "title", e.target.value)}
                          placeholder="Project name"
                          className="flex-1 bg-transparent text-white text-sm placeholder-teal-500/40 outline-none"
                        />
                        <button onClick={() => removeProject(i)} className="text-red-400/60 hover:text-red-400 ml-2 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={proj.description}
                        onChange={(e) => updateProject(i, "description", e.target.value)}
                        placeholder="Brief description"
                        className="w-full bg-transparent text-slate-400 text-[13px] placeholder-teal-500/40 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full h-12 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                  color: "#1a1a2e",
                  boxShadow: "0 4px 20px rgba(251, 191, 36, 0.3)",
                }}
              >
                <Save size={16} />
                {tc("save")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
