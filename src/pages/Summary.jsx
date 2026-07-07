import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODULES } from "@/components/course/courseData";
import ProgressBar from "@/components/course/ProgressBar";
import CertificateDownload from "@/components/course/CertificateDownload";
import { createPageUrl } from "@/utils";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/api/supabaseClient";
import { LOGO_URL } from "@/lib/constants";
import { Award, ArrowRight, RotateCcw, CheckCircle2, Download, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import MobileHeader from "@/components/MobileHeader";
import { motion } from "framer-motion";

export default function Summary() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) { navigate("/"); return; }
    // ✅ FIX: Use user.id instead of email
    const { data: userRecord, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    if (userRecord) setProgress(userRecord);
    const active = userRecord?.subscription_status === "active" && userRecord?.subscription_expires && new Date(userRecord.subscription_expires) > new Date();
    setIsPremium(currentUser.role === "admin" || active);
    setLoading(false);
  };

  const [certOpen, setCertOpen] = useState(false);
  const [certModuleName, setCertModuleName] = useState("");
  const { touchHandlers } = usePullToRefresh(loadProgress);

  const completedLessons = progress?.completed_lessons || [];
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-tab-safe md:pb-0" {...touchHandlers}>
      <MobileHeader />
      {/* Nav */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="Leamind" className="h-9 w-9 rounded-xl object-cover" />
            <div>
              <span className="font-extrabold text-slate-900 text-lg leading-none">Leamind</span>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5 hidden sm:block">Learn AI the Right Way</p>
            </div>
          </div>
          <button onClick={() => navigate(createPageUrl("Home"))} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </nav>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white text-center py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 30% 30%, white 0%, transparent 50%)"
        }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-yellow-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Course Summary</h1>
          <p className="text-white/70 mt-2">Your Leamind learning journey</p>
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>Overall Completion</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-300 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
            <p className="text-white/60 text-xs mt-2">{completedLessons.length} of {totalLessons} lessons completed</p>
          </div>
        </motion.div>
      </div>

      {/* Module Progress Cards */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Module Progress</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {MODULES.map((mod, i) => {
            const completed = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
            const pct = Math.round((completed / mod.lessons.length) * 100);
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shrink-0 text-2xl`}>
                  {mod.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-slate-800 truncate">{mod.name}</h3>
                    {pct === 100 && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <ProgressBar value={pct} size="sm" className="flex-1" />
                    <span className="text-xs text-slate-500">{completed}/{mod.lessons.length}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => isPremium ? navigate(createPageUrl("Course") + `?module=${mod.id}`) : window.open("https://rzp.io/rzp/2BWjEFKD", "_blank")}
                  >
                    {pct === 100 ? "Review" : "Continue"}
                  </Button>
                  {pct === 100 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      onClick={() => { setCertModuleName(mod.name); setCertOpen(true); }}
                    >
                      <Download className="w-3 h-3" /> Cert
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Key Takeaways */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Key Takeaways</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 md:p-8">
            <div className="space-y-3 text-sm text-slate-700">
              {[
                "AI tools are most powerful when used together in workflows",
                "The quality of your output depends on the quality of your input (prompts)",
                "Always verify AI-generated content, especially for critical decisions",
                "Start with one tool, master it, then expand your toolkit",
                "Build systems and templates for consistent, repeatable results",
                "Combine AI speed with human creativity and judgment",
                "Practice regularly with real-world tasks for fastest learning",
                "Keep a library of your best prompts and workflows",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => isPremium ? navigate(createPageUrl("Course")) : window.open("https://rzp.io/rzp/2BWjEFKD", "_blank")} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="w-4 h-4" /> Review Modules
          </Button>
          <Button onClick={() => navigate(createPageUrl("Home"))} size="lg" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-center py-8 text-xs text-slate-400 border-t border-slate-100">
        Leamind — Master AI Tools &copy; {new Date().getFullYear()}
      </div>

      <CertificateDownload
        moduleName={certModuleName}
        open={certOpen}
        onClose={() => setCertOpen(false)}
        allLessonsCompleted={true}
      />
    </div>
  );
}