import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODULES } from "@/components/course/courseData";
import FAQ from "@/components/course/FAQ";
import ToolVisual, { ToolVisualSmall } from "@/components/course/ToolVisual";
import StreakModal from "@/components/StreakModal";
import { createPageUrl } from "@/utils";
import { computeStreak } from "@/hooks/useStreak";
import { getCurrentUser } from "@/lib/auth";
import { listUserProgress, createUserProgress, updateUserProgress } from "@/api/entities";
import { LOGO_URL } from "@/lib/constants";
import { ArrowRight, ChevronRight, Award, BarChart2, User, CheckCircle2, Flame, Crown } from "lucide-react";

import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import MobileHeader from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


export default function Home() {
  const [progress, setProgress] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streakModal, setStreakModal] = useState({ open: false, type: null });
  const navigate = useNavigate();

  const loadData = async () => {
    const u = await getCurrentUser();
    if (!u) {
      navigate("/");
      setLoading(false);
      return;
    }
    setUser(u);

    const records = await listUserProgress();
    let prog = null;
    const userRecord = records.find((r) => r.created_by === u.email);
    if (userRecord) {
      prog = userRecord;
      const streakResult = computeStreak(prog);
      if (streakResult.shouldUpdate) {
        const updated = {
          streak_count: streakResult.streakCount,
          longest_streak: streakResult.longestStreak,
          last_login_date: streakResult.last_login_date,
        };
        prog = await updateUserProgress(prog.id, updated);
        if (streakResult.type && streakResult.type !== "continue") {
          setStreakModal({ open: true, type: streakResult.type, streak: streakResult.streakCount });
        }
      }
      setProgress(prog);
    }

    setLoading(false);
  };

  const { touchHandlers } = usePullToRefresh(loadData);

  useEffect(() => {loadData();}, []);

  const handleStart = async () => {
    if (!progress && user) {
      const today = new Date().toISOString().slice(0, 10);
      const record = await createUserProgress({
        created_by: user.email,
        enrolled: true,
        completed_lessons: [],
        quiz_scores: {},
        current_module: "deepseek",
        current_lesson: 0,
        streak_count: 1,
        longest_streak: 1,
        last_login_date: today,
        subscription_status: "free",
      });
      setProgress(record);
    }
    navigate(createPageUrl("Course"));
  };

  const handleSubscribe = () => {
    window.open("https://rzp.io/rzp/2BWjEFKD", "_blank");
  };

  const handleCourseClick = (path) => {
    if (!isPremium) {window.open("https://rzp.io/rzp/2BWjEFKD", "_blank");return;}
    navigate(path);
  };

  const handleModuleClick = (moduleId) => {
    navigate(createPageUrl("Course") + `?module=${moduleId}`);
  };

  const completedLessons = progress?.completed_lessons || [];
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? Math.round(completedLessons.length / totalLessons * 100) : 0;
  const currentModule = MODULES.find((m) => m.id === (progress?.current_module || "deepseek")) || MODULES[0];
  const currentModuleDone = currentModule.lessons.filter((l) => completedLessons.includes(l.id)).length;
  const currentModulePct = Math.round(currentModuleDone / currentModule.lessons.length * 100);
  const streak = progress?.streak_count || 0;
  const isExpired = progress?.subscription_status === "expired" || (progress?.subscription_status === "active" && progress?.subscription_expires && new Date(progress.subscription_expires) < new Date());
  const isPremium = progress?.subscription_status === "active" && progress?.subscription_expires && new Date(progress.subscription_expires) > new Date();
  const formatExpiry = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
      <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>);


  return (
    <div className="min-h-screen bg-[#F7F8FC] font-inter pb-tab-safe md:pb-0" {...touchHandlers}>
      <MobileHeader />
      {/* ── NAV ── */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div>
              <span className="font-extrabold text-slate-900 text-lg leading-none">Leamind</span>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5 hidden sm:block">Learn AI the Right Way</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
            <button className="text-indigo-600 font-semibold">Home</button>
            <button onClick={() => handleCourseClick(createPageUrl("Course"))} className="hover:text-slate-800 transition-colors">Courses</button>
            <button onClick={() => handleCourseClick(createPageUrl("Summary"))} className="hover:text-slate-800 transition-colors">My Progress</button>
            <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-800 transition-colors">FAQ</button>
          </div>
          <div className="flex items-center gap-2">
            {/* Streak badge */}
            {streak > 0 &&
            <div className="hidden sm:flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-full px-3 py-1.5 text-xs font-bold text-orange-600">
                <Flame className="w-3.5 h-3.5" /> {streak} day streak
              </div>
            }
            {/* Premium badge */}
            {isPremium &&
            <div className="hidden sm:flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5 text-xs font-bold text-yellow-700">
                <Crown className="w-3.5 h-3.5" /> Premium
              </div>
            }
            {/* Subscribe CTA */}
            {!isPremium &&
            <Button onClick={handleSubscribe} size="sm" className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 rounded-full px-4 font-semibold text-xs">
                <Crown className="w-3.5 h-3.5" /> Subscribe — ₹500
              </Button>
            }
            {/* Profile */}
            <button onClick={() => navigate(createPageUrl("Profile"))} className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center hover:bg-indigo-100 transition-colors">
              <User className="w-4 h-4 text-indigo-500" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* PAYWALL BANNER */}
        {!isPremium &&
        <div className="bg-[#1A365D] rounded-2xl p-6 text-white text-center border-2 border-yellow-400">
            <div className="text-3xl mb-2">🔒</div>
            <h2 className="text-xl font-black mb-1">
              {isExpired ? "Your subscription has expired" : "Unlock All AI Tools"}
            </h2>
            <p className="text-white/70 text-sm mb-4">
              {isExpired ?
            "Pay ₹500 to renew and get another 30 days of full access." :
            "Pay ₹500/month to access ChatGPT, Midjourney, Copilot, Claude + 10 more tools."}
            </p>
            <button
            onClick={handleSubscribe}
            className="bg-green-500 hover:bg-green-400 text-white font-black text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-500/30">
            
              {isExpired ? "Renew – ₹500 →" : "PAY ₹500 NOW →"}
            </button>
            {isPremium && progress?.subscription_expires &&
          <p className="text-green-300 text-xs mt-3">
                ✅ Access expires: {formatExpiry(progress.subscription_expires)}
              </p>
          }
          </div>
        }
        {isPremium && progress?.subscription_expires &&
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center justify-between">
            <span className="text-sm text-green-700 font-semibold">✅ Access expires: {formatExpiry(progress.subscription_expires)}</span>
          </div>
        }

        {/* ── HERO ── */}
        <section>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-80 shrink-0 h-52 md:h-auto">
                <ToolVisual moduleId={currentModule.id} className="w-full h-full" />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center">
                <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-3">
                  {progress?.enrolled ? "Continue Learning" : "Start Your Journey"}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                  {progress?.enrolled ? currentModule.name : "Master AI Tools That Matter"}
                </h1>
                <p className="text-slate-500 text-sm mb-6 max-w-md">
                  {progress?.enrolled ?
                  `Pick up where you left off. ${currentModuleDone} of ${currentModule.lessons.length} lessons completed.` :
                  "10 industry-leading AI tools. Step-by-step lessons. Professional certificates."}
                </p>
                {streak > 0 &&
                <div className="flex items-center gap-1.5 mb-4 text-sm text-orange-600 font-semibold">
                    <Flame className="w-4 h-4" /> {streak} day streak — keep it going!
                  </div>
                }
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => isPremium ? handleStart() : handleSubscribe()} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 py-5 rounded-xl font-semibold text-sm">
                    {progress?.enrolled && isPremium ? "Continue Learning" : isPremium ? "Start Learning" : "Unlock Access — ₹500"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  {progress?.enrolled &&
                  <Button variant="outline" onClick={() => navigate(createPageUrl("Summary"))} className="gap-2 px-6 py-5 rounded-xl font-semibold text-sm border-slate-200 text-slate-600">
                      <BarChart2 className="w-4 h-4" /> View Progress
                    </Button>
                  }

                </div>
                {progress?.enrolled &&
                <div className="mt-5 flex items-center gap-3 max-w-xs">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${currentModulePct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{currentModulePct}% complete</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ROW ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
          { value: "10", label: "AI Tools Covered", icon: "🧠" },
          { value: "70+", label: "In-depth Lessons", icon: "📖" },
          { value: "10", label: "Certificates Available", icon: "🏆" },
          { value: "Self-Paced", label: "No Deadline", icon: "⏱" }].
          map((stat) =>
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          )}
        </section>

        {/* ── MASTERY PATH ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Mastery Path</h2>
              <p className="text-sm text-slate-500 mt-0.5">10 AI tools, 7 lessons each, one certificate per tool</p>
            </div>
            <button onClick={() => navigate(createPageUrl("Summary"))} className="text-sm text-indigo-600 font-semibold hover:underline hidden sm:flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
            {MODULES.map((mod, i) => {
              const done = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
              const pct = Math.round(done / mod.lessons.length * 100);
              return (
                <motion.button key={mod.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => isPremium ? handleModuleClick(mod.id) : handleSubscribe()}
                className="shrink-0 w-44 text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden">
                  
                  <div className="h-28 overflow-hidden bg-slate-50">
                    <ToolVisualSmall moduleId={mod.id} className="h-28" />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm text-slate-800 truncate">{mod.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.lessons.length} lessons</p>
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    {pct === 100 &&
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Certified
                      </div>
                    }
                  </div>
                </motion.button>);

            })}
          </div>
        </section>

        {/* ── ALL COURSES GRID ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">All AI Courses</h2>
              <p className="text-sm text-slate-500 mt-0.5">Click any course to begin or continue</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((mod, i) => {
              const done = mod.lessons.filter((l) => completedLessons.includes(l.id)).length;
              const pct = Math.round(done / mod.lessons.length * 100);
              return (
                <motion.button key={mod.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}
                onClick={() => isPremium ? handleModuleClick(mod.id) : handleSubscribe()}
                className="group text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
                  
                  <div className="h-36 overflow-hidden">
                    <ToolVisual moduleId={mod.id} className="h-36 group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{mod.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{mod.description}</p>
                      </div>
                      {pct === 100 && <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mod.tagColor}`}>{mod.level}</span>
                      <span className="text-[10px] text-slate-400">{mod.lessons.length} lessons</span>
                    </div>
                    {done > 0 ?
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">{done}/{mod.lessons.length}</span>
                      </div> :

                    <div className="mt-3">
                        <span className="text-xs text-indigo-600 font-semibold group-hover:underline">Start Course →</span>
                      </div>
                    }
                  </div>
                </motion.button>);

            })}
          </div>
        </section>

        {/* ── WHAT YOU'LL ACHIEVE ── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-1">Outcomes</p>
            <h2 className="text-2xl font-bold text-slate-900">What You'll Be Able to Do</h2>
            <p className="text-sm text-slate-500 mt-1">Practical, job-ready skills after completing Leamind.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-50">
            <div className="p-8 space-y-4">
              {["Craft effective prompts for any AI tool", "Generate professional content with AI", "Automate repetitive work using AI workflows", "Build and debug code faster with AI assistance"].map((item) =>
              <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              )}
            </div>
            <div className="p-8 space-y-4">
              {["Create professional AI images and videos", "Clone voices and produce audio at scale", "Research any topic with cited, real-time AI", "Earn 10 professional certificates for your resume"].map((item) =>
              <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-1">Learning Flow</p>
          <h2 className="text-xl font-bold text-slate-900 mb-1">How Each Course Works</h2>
          <p className="text-sm text-slate-500 mb-7">A structured, progressive experience for every AI tool.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { step: "01", icon: "📖", label: "Learn", sub: "7 focused lessons. Short, clear, no information overload." },
            { step: "02", icon: "🎧", label: "Listen", sub: "Audio narration available for every lesson." },
            { step: "03", icon: "✅", label: "Quiz", sub: "Multiple-choice quizzes with instant feedback." },
            { step: "04", icon: "🏆", label: "Get Certified", sub: "Download a professional PDF certificate with unique ID." }].
            map((step) =>
            <div key={step.step} className="text-center p-4 rounded-xl bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3 text-lg">{step.icon}</div>
                <p className="text-xs text-indigo-400 font-bold mb-1">Step {step.step}</p>
                <p className="font-bold text-slate-900 text-sm mb-1">{step.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{step.sub}</p>
              </div>
            )}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section>
          <div className="text-center mb-7">
            <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-1">Student Reviews</p>
            <h2 className="text-xl font-bold text-slate-900">What Students Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
            { name: "Rohan", role: "Engineering Student, India", text: "Finally an AI tutor I can afford. The chatbot explains things clearly." },
            { name: "Caspian Merritt", role: "Freelance Developer, USA", text: "Helped me understand AI tools faster than any course I've tried. Genuinely impressive." },
            { name: "Siti Rahayu", role: "Digital Marketing, Indonesia", text: "The lessons are short and clear. I finished 3 modules in one weekend!" },
            { name: "Zephyr Holloway", role: "Product Manager, USA", text: "Worth every penny. I now use AI tools daily at work thanks to this platform." }].
            map((t) =>
            <div key={t.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) =>
                <span key={i} className="text-yellow-400 text-base">★</span>
                )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">"{t.text}"</p>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq">
          <FAQ />
        </section>

        {/* ── FOOTER ── */}
        <footer className="text-center pb-8 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <img src={LOGO_URL} alt="Leamind" className="h-7 w-7 rounded-lg object-cover" />
            <span className="font-extrabold text-slate-700">Leamind</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-400">Learn AI the Right Way</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Leamind Academy. All rights reserved.</p>
        </footer>
      </div>

      {/* Modals */}
      <StreakModal
        open={streakModal.open}
        type={streakModal.type}
        streak={streakModal.streak}
        onClose={() => setStreakModal({ open: false, type: null })} />
      
    </div>);

}