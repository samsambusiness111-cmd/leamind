import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODULES } from "@/components/course/courseData";
import CertificateDownload from "@/components/course/CertificateDownload";
import ProgressBar from "@/components/course/ProgressBar";
import { createPageUrl } from "@/utils";
import { getCurrentUser, signOut } from "@/lib/auth";
import { supabase } from "@/api/supabaseClient";
import { LOGO_URL } from "@/lib/constants";
import { Award, Flame, CheckCircle2, Save, ChevronRight, LogOut, BookOpen, Trophy, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


function daysRemaining(subscriptionExpires) {
  if (!subscriptionExpires) return 0;
  const expiry = new Date(subscriptionExpires);
  const now = new Date();
  const diffMs = expiry - now;
  if (diffMs <= 0) return 0;
  return Math.min(28, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [certModule, setCertModule] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = React.useRef(null);

  useEffect(() => { loadData(); }, []);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchMove = (e) => {
    if (!touchStartY.current) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 60 && !refreshing && window.scrollY === 0) {
      setRefreshing(true);
      touchStartY.current = null;
      loadData().finally(() => setRefreshing(false));
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // ✅ FIX: Delete by user_id instead of email
      if (user?.id) {
        await supabase
          .from("user_progress")
          .delete()
          .eq("user_id", user.id);
      }
      await signOut();
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  const loadData = async () => {
    const u = await getCurrentUser();
    setUser(u);
    if (!u) {
      setLoading(false);
      return;
    }
    // ✅ FIX: Use user.id instead of email
    const { data: userRecord, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", u.id)
      .maybeSingle();
    if (userRecord) {
      setProgress(userRecord);
      setDisplayName(userRecord.display_name || u.full_name || "");
    }
    setLoading(false);
  };

  const saveName = async () => {
    if (!progress || !displayName.trim()) return;
    const trimmed = displayName.trim();
    setSaving(true);
    try {
      const { data: updated, error } = await supabase
        .from("user_progress")
        .update({ display_name: trimmed })
        .eq("id", progress.id)
        .select()
        .single();
      if (!error && updated) {
        setProgress(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const completedLessons = progress?.completed_lessons || [];
  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const completedModules = MODULES.filter(m => m.lessons.every(l => completedLessons.includes(l.id)));
  const streak = progress?.streak_count || 0;
  const longestStreak = progress?.longest_streak || 0;
  const isActive = progress?.subscription_status === "active";
  const daysLeft = Math.min(28, daysRemaining(progress?.subscription_expires));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
      <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  const initials = (displayName || user?.full_name || "L").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F7F8FC] font-inter pb-24 md:pb-12" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
      {refreshing && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold text-indigo-600">
          <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          Refreshing...
        </div>
      )}
      {/* Nav */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Leamind" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-extrabold text-slate-900">Leamind</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-28" />
          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-10 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-extrabold text-white">
                {initials}
              </div>
              <div className="pb-1 flex flex-col items-end gap-1.5">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isActive ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                  {isActive ? "Active Subscription" : "No Active Subscription"}
                </span>
                {isActive && (
                  <span className="text-xs text-slate-400 font-medium">{daysLeft} of 28 days remaining</span>
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Account</p>
              <p className="text-lg font-extrabold text-slate-900 leading-tight">{displayName || user?.full_name || "Learner"}</p>
              <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
            </div>

            {/* Edit name for certificates */}
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-2">Certificate Name</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Enter name for certificates"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                />
                <Button onClick={saveName} disabled={saving || !displayName.trim()} size="sm"
                  className={`gap-1.5 px-4 rounded-xl font-semibold ${saved ? "bg-green-600 hover:bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved!" : "Save"}
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">This name appears on your downloaded certificates</p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-slate-900">Subscription</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`flex-1 rounded-xl p-4 border ${isActive ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1 ${isActive ? 'text-green-600' : 'text-red-500'}">
                Status
              </p>
              <p className={`text-xl font-extrabold ${isActive ? "text-green-700" : "text-red-600"}`}>
                {isActive ? "Active" : "Expired / None"}
              </p>
            </div>
            {isActive && (
              <>
                <div className="flex-1 rounded-xl p-4 bg-indigo-50 border border-indigo-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1">Days Left</p>
                  <p className="text-xl font-extrabold text-indigo-700">{daysLeft} / 28</p>
                </div>
                <div className="flex-1 rounded-xl p-4 bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Expires</p>
                  <p className="text-sm font-bold text-slate-700">
                    {progress?.subscription_expires ? new Date(progress.subscription_expires).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </>
            )}
          </div>
          {isActive && daysLeft <= 7 && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
              Your subscription expires soon. Renew to keep uninterrupted access.
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Flame, value: streak, label: "Day Streak", sub: `Best: ${longestStreak}d`, color: "text-orange-500", bg: "bg-orange-50" },
            { icon: BookOpen, value: completedLessons.length, label: "Lessons Done", sub: `of ${totalLessons}`, color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Trophy, value: completedModules.length, label: "Tools Mastered", sub: "of 10", color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Award, value: completedModules.length, label: "Certificates", sub: "available", color: "text-indigo-500", bg: "bg-indigo-50" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900">Overall Progress</h2>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{overallPct}%</span>
          </div>
          <ProgressBar value={overallPct} size="lg" />
          <p className="text-xs text-slate-400 mt-2">{completedLessons.length} of {totalLessons} lessons completed across all 10 AI tools</p>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50">
            <h2 className="font-bold text-slate-900">Course Progress</h2>
            <p className="text-xs text-slate-500 mt-0.5">Complete all 7 lessons in a course to earn your certificate</p>
          </div>
          <div className="divide-y divide-slate-50">
            {MODULES.map((mod) => {
              const done = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
              const pct = Math.round((done / mod.lessons.length) * 100);
              return (
                <div key={mod.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-lg shrink-0`}>
                    {mod.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-slate-800 truncate">{mod.name}</p>
                      <span className="text-xs text-slate-400 ml-2 shrink-0">{done}/{mod.lessons.length}</span>
                    </div>
                    <ProgressBar value={pct} size="sm" />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {pct === 100 && (
                      <Button size="sm" variant="outline"
                        onClick={() => { setCertModule(mod.name); setCertOpen(true); }}
                        className="text-xs gap-1 text-amber-600 border-amber-200 hover:bg-amber-50 py-1.5 px-3">
                        <Award className="w-3 h-3" /> Cert
                      </Button>
                    )}
                    <button onClick={() => navigate(createPageUrl("Course") + `?module=${mod.id}`)}
                      className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-slate-900">Learning Streak</h2>
            </div>
            <span className="text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">{streak} day{streak !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, i) => {
              const active = i < Math.min(streak, 7);
              const dayLabel = ["M", "T", "W", "T", "F", "S", "S"][i];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${active ? "bg-orange-500 text-white shadow-sm" : "bg-slate-100 text-slate-300"}`}>
                    {active ? <Flame className="w-3.5 h-3.5" /> : "–"}
                  </div>
                  <span className="text-[9px] text-slate-400">{dayLabel}</span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            {streak === 0
              ? "Start learning today to begin your streak!"
              : streak === 1
              ? "Day 1 — come back tomorrow to keep it going!"
              : `${streak} consecutive days. Best streak: ${longestStreak} days.`}
          </p>
          {longestStreak >= 7 && (
            <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Best streak: {longestStreak} days — amazing consistency!
            </div>
          )}
        </div>

        {/* Account & Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-1">Account</h2>
          <p className="text-xs text-slate-500 mb-4">Signed in as <span className="font-semibold text-slate-700">{user?.email}</span></p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleLogout} variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2 font-semibold">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
            <Button onClick={() => setDeleteConfirm(true)} variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 gap-2 font-semibold">
              <Trash2 className="w-4 h-4" /> Delete Account
            </Button>
          </div>
        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Account?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              This will permanently delete your account and all progress. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteConfirm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleDeleteAccount} disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2">
                {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <CertificateDownload
        moduleName={certModule}
        open={certOpen}
        onClose={() => setCertOpen(false)}
        prefillName={displayName || user?.full_name || ""}
        allLessonsCompleted={true}
      />
    </div>
  );
}