import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODULES } from "@/components/course/courseData";
import FAQ from "@/components/course/FAQ";
import ToolVisual, { ToolVisualSmall } from "@/components/course/ToolVisual";
import StreakModal from "@/components/StreakModal";
import { createPageUrl } from "@/utils";
import { computeStreak } from "@/hooks/useStreak";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/api/supabaseClient";
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
    try {
      const u = await getCurrentUser();
      if (!u) {
        navigate("/");
        setLoading(false);
        return;
      }
      setUser(u);

      // ✅ FIX: Use user_id instead of email
      const { data: prog, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", u.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading progress:", error);
        setLoading(false);
        return;
      }

      if (prog) {
        const streakResult = computeStreak(prog);
        if (streakResult.shouldUpdate) {
          const updated = {
            streak_count: streakResult.streakCount,
            longest_streak: streakResult.longestStreak,
            last_login_date: streakResult.last_login_date,
          };
          const { error: updateError } = await supabase
            .from("user_progress")
            .update(updated)
            .eq("id", prog.id);
          
          if (!updateError) {
            setProgress({ ...prog, ...updated });
          }
          
          if (streakResult.type && streakResult.type !== "continue") {
            setStreakModal({ open: true, type: streakResult.type, streak: streakResult.streakCount });
          }
        } else {
          setProgress(prog);
        }
      } else {
        // ✅ FIX: Create new record with user_id
        const { data: newProg, error: insertError } = await supabase
          .from("user_progress")
          .insert({
            user_id: u.id,
            user_email: u.email,
            enrolled: false,
            completed_lessons: [],
            quiz_scores: {},
            current_module: "deepseek",
            current_lesson: 0,
            streak_count: 0,
            longest_streak: 0,
            subscription_status: "free",
          })
          .select()
          .single();

        if (!insertError && newProg) {
          setProgress(newProg);
        }
      }
    } catch (error) {
      console.error("loadData error:", error);
    } finally {
      setLoading(false);
    }
  };

  const { touchHandlers } = usePullToRefresh(loadData);

  useEffect(() => { loadData(); }, []);

  const handleStart = async () => {
    if (!progress && user) {
      const { data: newProg, error } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          user_email: user.email,
          enrolled: true,
          completed_lessons: [],
          quiz_scores: {},
          current_module: "deepseek",
          current_lesson: 0,
          streak_count: 1,
          longest_streak: 1,
          subscription_status: "free",
        })
        .select()
        .single();
      
      if (!error && newProg) {
        setProgress(newProg);
      }
    }
    navigate(createPageUrl("Course"));
  };

  const handleSubscribe = () => {
    window.open("https://rzp.io/rzp/2BWjEFKD", "_blank");
  };

  const handleCourseClick = (path) => {
    if (!isPremium) {
      window.open("https://rzp.io/rzp/2BWjEFKD", "_blank");
      return;
    }
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
    </div>
  );

  // ... THE REST OF YOUR HOME.JSX REMAINS THE SAME (all the JSX from your original file)
  // Just make sure the `isPremium` and `isExpired` logic stays the same
  // Copy the JSX from your original Home.jsx from line 120 onwards

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
            {streak > 0 &&
            <div className="hidden sm:flex items-center gap-1 bg-orange-50 border border-orange-100 rounded-full px-3 py-1.5 text-xs font-bold text-orange-600">
                <Flame className="w-3.5 h-3.5" /> {streak} day streak
              </div>
            }
            {isPremium &&
            <div className="hidden sm:flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5 text-xs font-bold text-yellow-700">
                <Crown className="w-3.5 h-3.5" /> Premium
              </div>
            }
            {!isPremium &&
            <Button onClick={handleSubscribe} size="sm" className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 rounded-full px-4 font-semibold text-xs">
                <Crown className="w-3.5 h-3.5" /> Subscribe — ₹500
              </Button>
            }
            <button onClick={() => navigate(createPageUrl("Profile"))} className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center hover:bg-indigo-100 transition-colors">
              <User className="w-4 h-4 text-indigo-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* THE REST OF YOUR JSX... (keep everything else exactly as it was) */}
      {/* Just make sure the isPremium and isExpired checks remain the same */}
      {/* ... (copy the rest of your JSX from your original Home.jsx) */}
    </div>
  );
}