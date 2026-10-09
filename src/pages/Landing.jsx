import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Star, Zap, Lock, Rocket, Shield, Award, TrendingUp, Brain, Target, Users, BookOpen, Info } from "lucide-react";
import FreeLessonSection from "@/components/landing/FreeLessonSection";
import { getCurrentUser } from "@/lib/auth";
import { LOGO_URL } from "@/lib/constants";
import EmailAuthModal from "@/components/EmailAuthModal";
import InstructionsPopup from "@/components/InstructionsPopup";

const TOOLS = [
  { emoji: "🤖", name: "ChatGPT", level: "Beginner", color: "from-green-500 to-emerald-600" },
  { emoji: "🎨", name: "Midjourney / DALL-E", level: "Beginner", color: "from-purple-500 to-pink-600" },
  { emoji: "💻", name: "GitHub Copilot", level: "Intermediate", color: "from-slate-600 to-slate-800" },
  { emoji: "📝", name: "Claude", level: "Beginner", color: "from-orange-500 to-amber-600" },
  { emoji: "🔍", name: "Perplexity AI", level: "Intermediate", color: "from-teal-500 to-cyan-600" },
  { emoji: "🎵", name: "ElevenLabs", level: "Advanced", color: "from-violet-500 to-purple-600" },
  { emoji: "🎬", name: "Runway ML", level: "Advanced", color: "from-rose-500 to-orange-600" },
  { emoji: "📊", name: "Notion AI", level: "Beginner", color: "from-slate-500 to-slate-700" },
  { emoji: "🔧", name: "Make / Zapier", level: "Advanced", color: "from-blue-500 to-indigo-600" },
  { emoji: "🧠", name: "LeaMind Assistant", level: "All Levels", color: "from-indigo-500 to-purple-600" },
];

const LEVEL_COLORS = {
  Beginner: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-amber-100 text-amber-700 border border-amber-200",
  Advanced: "bg-rose-100 text-rose-700 border border-rose-200",
  "All Levels": "bg-blue-100 text-blue-700 border border-blue-200",
};

const CERT_SAMPLES = [
  { name: "Sample Certificate", module: "ChatGPT", id: "SAMPLE-0001", date: "2026" },
  { name: "Sample Certificate", module: "Midjourney", id: "SAMPLE-0002", date: "2026" },
];

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-xs sm:text-[10px] font-bold tracking-[5px] text-blue-600 uppercase mb-3 text-center">{children}</p>;
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-6 sm:my-10">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.25))" }} />
      <div className="w-1.5 h-1.5 bg-blue-600/40 rotate-45" />
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(37,99,235,0.25), transparent)" }} />
    </div>
  );
}

function CertMiniPreview({ cert }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden border border-blue-200 shadow-[0_4px_20px_rgba(37,99,235,0.08)] relative cursor-pointer bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full border border-blue-500/40 flex items-center justify-center mb-1 bg-blue-50">
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-slate-900 font-black text-xs">✅ Verifiable on LinkedIn</p>
          <p className="text-blue-600 font-mono text-[9px] tracking-wider">{cert.id}</p>
          <p className="text-slate-400 text-[9px]">Issued by Leamind Academy</p>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ rotate: "-25deg" }}>
        <span className="text-slate-900/[0.04] font-black text-3xl select-none tracking-widest uppercase">SAMPLE</span>
      </div>
      <div className="relative p-3" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-blue-400/40" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-blue-400/40" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-blue-400/40" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-blue-400/40" />
        <div className="flex items-center gap-1.5 mb-2">
          <img src={LOGO_URL} alt="LeaMind" className="h-4 w-4 rounded object-cover" />
          <p className="text-slate-900 font-black text-[9px] leading-none flex-1">LeaMind</p>
          <div className="w-6 h-6 rounded-full border border-blue-400/40 flex flex-col items-center justify-center bg-blue-50">
            <span className="text-blue-600 text-[4px] font-black leading-none">AI</span>
            <span className="text-slate-700 text-[3px] font-black">PRO</span>
          </div>
        </div>
        <div className="h-px w-full mb-1" style={{ background: "linear-gradient(90deg, transparent, #2563EB, transparent)" }} />
        <p className="text-center text-blue-600 text-[6px] font-bold tracking-[2px] uppercase mb-0.5">Certificate of Completion</p>
        <p className="text-center text-slate-400 text-[6px] mb-0.5">This is to certify that</p>
        <p className="text-center text-slate-900 font-black text-xs mb-0.5">{cert.name}</p>
        <div className="h-px w-10 mx-auto mb-0.5" style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }} />
        <p className="text-center text-indigo-600 text-[7px] font-bold tracking-wider">{cert.module} — AI Professional Cert.</p>
        <div className="h-px w-full mt-1.5 mb-1" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.2), transparent)" }} />
        <div className="flex justify-between items-center text-[5px] text-slate-400">
          <span>{cert.date}</span>
          <span className="text-blue-500/60 font-mono">{cert.id}</span>
          <span>Leamind</span>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text, color }) {
  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="font-bold text-slate-900 text-base mb-1.5">{title}</p>
      <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const isApp = typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.() === true;

  const handleSignUp = async () => {
    const user = await getCurrentUser();
    if (user) {
      window.location.href = "/home";
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleLogin = handleSignUp;

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden font-sans bg-white" style={{ color: "#0f172a" }}>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden px-3"
        style={{ background: "linear-gradient(to top, rgba(255,255,255,1) 80%, rgba(255,255,255,0.95) 90%, transparent)", paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)", paddingTop: "12px" }}>
        <div className="flex gap-2 mb-2">
          <button onClick={isApp ? handleLogin : handleSignUp}
            className="flex-1 text-white font-black text-base h-14 rounded-2xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform shadow-lg shadow-blue-300/40"
            style={{ background: "linear-gradient(135deg, #2563EB, #1E40AF)" }}>
            {isApp ? "🔑 Log In" : "🚀 Sign Up Free →"}
          </button>
          {isApp && (
            <button onClick={() => setShowInstructions(true)}
              className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
              aria-label="How it works">
              <Info className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-slate-400 text-xs text-center flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          {isApp ? "Visit leamindai.com to upgrade" : "UPI · GPay · PhonePe · Cards accepted"}
        </p>
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="LeaMind" className="h-8 w-8 rounded-xl object-cover" />
            <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">LeaMind</span>
          </div>
          <div className="flex items-center gap-3">
            {isApp ? (
              <>
                <button onClick={() => setShowInstructions(true)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                  aria-label="How it works">
                  <Info className="w-5 h-5" />
                </button>
                <button onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-4 sm:px-5 py-2.5 rounded-full transition-colors shadow-lg shadow-blue-200/50">
                  Log In
                </button>
              </>
            ) : (
              <>
                <span className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  Early access open
                </span>
                <button onClick={handleSignUp}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-4 sm:px-5 py-2.5 rounded-full transition-colors shadow-lg shadow-blue-200/50">
                  Sign Up →
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-0 sm:px-4 pt-10 sm:pt-20 pb-12 sm:pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 65%)" }} />
        <div className="absolute top-32 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.04) 0%, transparent 65%)" }} />

        <div className="max-w-7xl mx-auto relative px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-6 sm:gap-10 xl:gap-14 items-start">

            <div className="hidden lg:flex flex-col gap-5 pt-16">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
                <p className="text-blue-600 font-bold text-[9px] uppercase tracking-[3px]">Why Leamind</p>
              </div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <FeatureCard icon={Brain} title="Practical Skills" text="Learn by doing real exercises, not just watching videos." color="bg-gradient-to-br from-blue-500 to-indigo-600" />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
                <FeatureCard icon={Target} title="Beginner Friendly" text="Zero coding needed. Every lesson starts from scratch." color="bg-gradient-to-br from-blue-500 to-cyan-500" />
              </motion.div>
            </div>

            <div className="text-center">
              <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6 sm:mb-8">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-blue-700 text-sm font-semibold tracking-wide">🔥 Join early learners mastering AI tools</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight mb-4 sm:mb-5 text-slate-900"
              >
                The Only AI Masterclass<br />
                <span className="text-slate-400 text-2xl sm:text-4xl lg:text-5xl font-bold">Built for the</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #2563EB, #1E40AF)" }}>
                  Indian Budget.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="text-slate-500 text-base sm:text-lg font-medium mb-6 sm:mb-10 max-w-lg mx-auto leading-relaxed"
              >
                Get the real skill employers are hiring for —{" "}
                <span className="text-blue-600 font-semibold">AI.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.55 }}
                className="mb-6 sm:mb-8 px-5 sm:px-6 py-5 rounded-2xl border border-blue-200 bg-blue-50/50"
              >
                <p className="text-slate-900 font-black text-xl sm:text-3xl leading-tight tracking-tight mb-1.5">AI won't replace you.</p>
                <p className="text-blue-600 font-black text-xl sm:text-3xl leading-tight tracking-tight">A person using AI will.</p>
                <div className="w-14 h-px mx-auto mt-3 sm:mt-4" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)" }} />
                <p className="text-slate-400 text-base mt-3">Be that person. Learn it properly. Start today — it's free to join.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="grid grid-cols-2 gap-2 mb-6 sm:mb-8 text-left"
              >
                {[
                  "🤖 10 AI Tools taught in depth",
                  "🎯 Interactive exercises & practice",
                  "🏆 10 Verified Certificates",
                  "🧠 Understand how each tool actually works",
                  "🎓 Beginner-friendly, zero coding",
                  "🇮🇳 Built for Indian learners",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <span className="text-sm leading-tight text-slate-700">{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.5 }}
                className="mb-5 rounded-2xl border border-blue-200 overflow-hidden bg-white shadow-lg shadow-blue-100/50">
                <div className="px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-widest mb-2">One-time payment · 28-day access</p>
                    <div className="flex items-baseline justify-center sm:justify-start gap-3 flex-wrap">
                      <span className="text-slate-400 text-lg line-through font-bold">₹2,000</span>
                      <span className="text-blue-600 text-4xl font-black">₹500</span>
                      <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-1 rounded-full border border-blue-200">75% OFF</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                      {isApp ? "Pay on leamindai.com to unlock" : "UPI · GPay · PhonePe · Cards — all accepted"}
                    </p>
                  </div>
                  <button
                    onClick={isApp ? handleLogin : handleSignUp}
                    className="shrink-0 w-full sm:w-auto h-12 px-7 rounded-xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-300/40"
                    style={{ background: "linear-gradient(135deg, #2563EB, #1E40AF)" }}
                  >
                    {isApp ? "Log In" : "Sign Up Free →"}
                  </button>
                </div>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
                className="text-slate-400 text-sm mb-2">
                {isApp ? "Visit leamindai.com to upgrade and unlock 28-day access." : "✅ Free to browse · Pay ₹500 on leamindai.com to unlock"}
              </motion.p>

              <div className="lg:hidden mt-8 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-blue-600" />
                  <p className="text-blue-600 font-bold text-xs uppercase tracking-[3px]">Sample Certificates</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CERT_SAMPLES.map((cert, i) => (
                    <div key={i}><CertMiniPreview cert={cert} /><p className="text-slate-400 text-xs mt-1.5 text-center">{cert.module}</p></div>
                  ))}
                </div>
              </div>

              <GoldDivider />

              <FadeIn>
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 text-center border-b border-slate-100">
                    <p className="text-blue-700 font-bold text-sm sm:text-base uppercase tracking-wider mb-1">Paisa Vasool Guarantee</p>
                    <p className="text-slate-400 text-sm">Most AI courses cost ₹15,000–₹30,000. See the difference.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-slate-100">
                    <div className="p-4 sm:p-5 border-b border-slate-100 sm:border-b-0">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 text-center">Other Courses</p>
                      <ul className="space-y-3">
                        {[
                          "₹15,000–₹30,000 cost",
                          "Lecture videos, no practice",
                          "Overwhelming to start",
                          "Requires Credit Card",
                          "Auto-renews silently",
                        ].map(item => (
                          <li key={item} className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-500 shrink-0">✕</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 sm:p-5 relative bg-blue-50/40">
                      <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-4 text-center">Leamind</p>
                      <ul className="space-y-3">
                        {[
                          "₹500 — one-time · 28-day access",
                          "Interactive exercises & real practice",
                          "Beginner-friendly",
                          "UPI, GPay, PhonePe ready",
                          "One payment. No auto-renewal.",
                        ].map(item => (
                          <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">✓</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 py-4 border-t border-slate-100 text-center bg-blue-50/30">
                    <p className="text-blue-700 text-sm italic">"Practical, affordable, built for real Indian students."</p>
                  </div>
                </div>
              </FadeIn>

              <div className="lg:hidden mt-8 text-left space-y-3">
                <SectionLabel>Why Leamind</SectionLabel>
                <FeatureCard icon={Brain} title="Practical Skills" text="Learn by doing real exercises, not just watching videos." color="bg-gradient-to-br from-blue-500 to-indigo-600" />
                <FeatureCard icon={Target} title="Beginner Friendly" text="Zero coding needed. Every lesson starts from scratch." color="bg-gradient-to-br from-blue-500 to-cyan-500" />
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-5 pt-16">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3 h-3 text-blue-600" />
                <p className="text-blue-600 font-bold text-[9px] uppercase tracking-[3px]">Sample Certificates</p>
              </div>
              {CERT_SAMPLES.map((cert, i) => (
                <motion.div key={cert.module} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}>
                  <CertMiniPreview cert={cert} />
                  <p className="text-slate-400 text-[9px] mt-1.5 text-center tracking-wide">{cert.module}</p>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
                className="border border-blue-200 rounded-xl p-4 mt-1 text-center bg-blue-50/50">
                <p className="text-blue-700 text-xs font-bold mb-1">🏆 10 Certificates Total</p>
                <p className="text-slate-500 text-[10px] leading-relaxed">One per AI tool. Download PDF. Share on LinkedIn.</p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <FreeLessonSection onSignUp={isApp ? handleLogin : handleSignUp} />

      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <SectionLabel>What's Inside</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-8 sm:mb-12 tracking-tight">Everything You Get</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: "🧠", value: "10", label: "AI tools taught in depth", sub: "With interactive exercises" },
                { icon: "📚", value: "70+", label: "Hands-on lessons", sub: "Structured, practical, clear" },
                { icon: "🎓", value: "10", label: "Verified certificates", sub: "Downloadable PDFs for your resume" },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 flex flex-row sm:flex-col items-center gap-4 sm:gap-0 bg-white">
                  <div className="text-4xl sm:mb-4">{stat.icon}</div>
                  <div className="text-left sm:text-center">
                    <p className="text-3xl sm:text-4xl font-black text-blue-600 mb-1 sm:mb-2">{stat.value}</p>
                    <p className="text-slate-700 text-base sm:text-sm font-semibold">{stat.label}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-slate-100 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>What's Inside</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 text-center mb-2 tracking-tight">10 AI Tools. Mastered Properly.</h2>
            <p className="text-center text-slate-500 text-base mb-8 sm:mb-12">Each module teaches you how a tool works, why it works, and how to use it to its full potential — with interactive exercises and a verified certificate.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TOOLS.map((tool, i) => (
                <motion.div key={tool.name}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer group bg-white">
                  <div className={`h-14 bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl group-hover:opacity-90 transition-opacity`}>{tool.emoji}</div>
                  <div className="p-3">
                    <h3 className="font-bold text-slate-800 text-sm mb-2 leading-tight">{tool.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[tool.level]}`}>{tool.level}</span>
                      <span className="text-xs text-blue-500/60">🏆</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-slate-100 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">Start in 3 Minutes. Results in 3 Days.</h2>
            <p className="text-slate-500 text-base mb-8 sm:mb-14">Each lesson teaches you how a tool works, then gives you an exercise to use it yourself — so you actually learn it, not just watch it.</p>

            <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
              <div className="flex items-center gap-0 mb-3">
                {["Sign Up", "Pick Tool", "Lesson", "Get Cert"].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 border-blue-400 flex items-center justify-center text-sm sm:text-xs font-black text-blue-600 bg-blue-50">{i + 1}</div>
                      <span className="text-xs sm:text-[9px] text-slate-400 font-medium whitespace-nowrap">{step}</span>
                    </div>
                    {i < 3 && <div className="flex-1 h-px mx-1" style={{ background: "linear-gradient(90deg, rgba(37,99,235,0.5), rgba(37,99,235,0.1))" }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {[
                { icon: <Lock className="w-6 h-6 text-indigo-500" />, step: "01", title: "Sign up", sub: "One-click. 10 seconds. No forms.", bg: "from-indigo-50 to-indigo-100/40", border: "border-indigo-200" },
                { icon: <Zap className="w-6 h-6 text-amber-500" />, step: "02", title: "Explore the platform", sub: "Browse all 10 AI tool courses and try a free lesson.", bg: "from-amber-50 to-amber-100/40", border: "border-amber-200" },
                { icon: <Rocket className="w-6 h-6 text-blue-500" />, step: "03", title: "Unlock on leamindai.com", sub: "Pay ₹500 on our website. Then come back to the app.", bg: "from-blue-50 to-blue-100/40", border: "border-blue-200" },
              ].map((s, i) => (
                <motion.div key={s.step}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.45 }}
                  className={`border ${s.border} rounded-2xl p-5 sm:p-7 flex flex-row sm:flex-col gap-4 sm:gap-0 items-center text-left sm:text-center hover:shadow-lg transition-all bg-gradient-to-br ${s.bg}`}>
                  <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-xl border border-slate-200 flex items-center justify-center shrink-0 sm:mx-auto sm:mb-5 bg-white">{s.icon}</div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold tracking-[3px] mb-1 sm:mb-2">STEP {s.step}</p>
                    <p className="font-bold text-slate-900 text-base mb-1 sm:mb-2">{s.title}</p>
                    <p className="text-sm text-slate-500">{s.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="py-8 sm:py-10 px-4 border-t border-b border-slate-100 bg-slate-50">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: <Shield className="w-5 h-5 text-blue-500" />, label: "Secure Payment", sub: "Razorpay · RBI compliant" },
              { icon: <Award className="w-5 h-5 text-amber-500" />, label: "Verified Certs", sub: "Unique ID per cert" },
              { icon: <TrendingUp className="w-5 h-5 text-indigo-500" />, label: "Practical Learning", sub: "Real exercises, real skills" },
              { icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />, label: "No Auto-Renewal", sub: "One payment. Done." },
            ].map(t => (
              <div key={t.label} className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white">
                <div className="mb-2 sm:mb-3">{t.icon}</div>
                <p className="font-bold text-slate-700 text-sm mb-0.5">{t.label}</p>
                <p className="text-slate-400 text-xs">{t.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-slate-100 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <SectionLabel>Honest Answers</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">Before You Decide</h2>
              <p className="text-slate-500 text-base">You probably have doubts. That's fair. Here's an honest answer to each one.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  concern: "\"₹500 sounds too cheap. Is this actually good quality?\"",
                  icon: "🤔",
                  response: "We kept the price low on purpose — not because the content is low quality, but because we believe AI education shouldn't cost ₹20,000. Every lesson explains how a tool works, why it works, and gives you a real exercise to practice it yourself. See the free lesson above and judge for yourself.",
                  tag: "Quality"
                },
                {
                  concern: "\"What if I'm not tech-savvy? Will I be lost?\"",
                  icon: "😟",
                  response: "All 10 modules start from zero. No coding. No technical background needed. Each lesson builds your understanding step by step, then gives you hands-on exercises to apply what you learned. Most learners had never seriously used an AI tool before joining.",
                  tag: "Beginner Friendly"
                },
                {
                  concern: "\"Is my payment safe? Will I get charged again later?\"",
                  icon: "🔒",
                  response: "Payment is processed by Razorpay on leamindai.com — India's most trusted payment gateway. This is a one-time payment. There is no subscription, no auto-renewal, and no hidden charges. You pay once, you get 28-day full access.",
                  tag: "Payment Safety"
                },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors bg-white">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-slate-800 text-base font-semibold italic leading-snug">{item.concern}</p>
                        <span className="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 tracking-wider uppercase">{item.tag}</span>
                      </div>
                    </div>
                    <div className="h-px bg-slate-100 mb-4" />
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-slate-600 text-base leading-relaxed">{item.response}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 border border-blue-200 rounded-2xl p-5 sm:p-6 text-center bg-blue-50/50">
              <p className="text-blue-700 text-base font-semibold mb-1">Still unsure? Read the free lesson above — it's the real thing.</p>
              <p className="text-slate-500 text-sm">No email required. No commitment. Just read it, use the prompt, and decide.</p>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-slate-100 relative overflow-hidden bg-slate-50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 65%)" }} />
          <div className="max-w-6xl mx-auto relative">
            <SectionLabel>Why Leamind</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 text-center mb-2 tracking-tight">Built Different. Built for You.</h2>
            <p className="text-center text-slate-500 text-base mb-8 sm:mb-14">No fluff. No fake promises. Just real skills at a real price.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard icon={BookOpen} title="70+ Hands-On Lessons" text="Not passive videos. Every lesson teaches a real skill you can use immediately." color="bg-gradient-to-br from-blue-500 to-indigo-600" />
              <FeatureCard icon={Target} title="10 AI Tools Covered" text="ChatGPT, Claude, Midjourney, Perplexity, GitHub Copilot, and 5 more." color="bg-gradient-to-br from-indigo-500 to-purple-600" />
              <FeatureCard icon={Award} title="10 Verified Certificates" text="Download PDF certificates for your resume and LinkedIn." color="bg-gradient-to-br from-amber-500 to-orange-600" />
              <FeatureCard icon={Users} title="Built for Indian Students" text="Priced for India. Paid via UPI, GPay, PhonePe. No credit card needed." color="bg-gradient-to-br from-blue-500 to-cyan-600" />
              <FeatureCard icon={Zap} title="Instant Access" text="Sign up and start learning in under 60 seconds. No waiting." color="bg-gradient-to-br from-blue-600 to-blue-800" />
              <FeatureCard icon={Shield} title="One-Time Payment" text="₹500 once. 28-day access. No subscription. No auto-renewal." color="bg-gradient-to-br from-slate-600 to-slate-800" />
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="py-16 sm:py-28 px-4 text-center relative overflow-hidden border-t border-slate-100 bg-gradient-to-b from-blue-50 to-white">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.1) 0%, transparent 55%)" }} />
          <div className="max-w-2xl mx-auto relative">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Your AI Journey<br /><span className="text-blue-600">Starts Today.</span>
            </h2>
            <p className="text-slate-500 text-base mb-6 sm:mb-8 font-medium max-w-sm mx-auto">No experience needed. Learn 10 AI tools the practical way — with hands-on exercises and certificates.</p>
            <div className="flex items-baseline justify-center gap-3 mb-5">
              <span className="text-slate-400 text-2xl line-through font-bold">₹2,000</span>
              <span className="text-blue-600 text-5xl font-black">₹500</span>
              <span className="bg-blue-100 text-blue-700 text-sm font-black px-2.5 py-1 rounded-full border border-blue-200">75% OFF</span>
            </div>
            <button
              onClick={isApp ? handleLogin : handleSignUp}
              className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto h-14 sm:h-16 px-6 sm:px-10 rounded-2xl font-black text-white text-lg sm:text-xl shadow-2xl shadow-blue-300/50 hover:scale-[1.02] transition-transform"
              style={{ background: "linear-gradient(135deg, #2563EB, #1E40AF)" }}
            >
              {isApp ? "🔑 Log In" : "🚀 Sign Up Free →"}
            </button>
            <p className="text-slate-400 text-sm mt-3">
              {isApp ? "Free to browse · Pay ₹500 on leamindai.com to unlock" : "Free to join · Pay ₹500 on leamindai.com to unlock"}
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="py-10 sm:py-16 px-4 border-t border-slate-100 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="border border-slate-200 rounded-2xl p-5 sm:p-8 relative overflow-hidden bg-slate-50">
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 70%)" }} />
              <div className="flex items-center gap-3 mb-5">
                <img src={LOGO_URL} alt="Founder" className="h-10 w-10 rounded-xl object-cover border border-slate-200" />
                <div>
                  <p className="font-black text-slate-900 text-base">A Note From the Founder</p>
                  <p className="text-slate-500 text-sm">LeaMind Academy</p>
                </div>
              </div>
              <p className="text-slate-600 text-base leading-relaxed mb-4 italic">
                "I got tired of seeing AI courses sold for ₹20,000–₹30,000 — most of it padding, theory, and recycled YouTube content.
                I built LeaMind to be the most <span className="text-slate-900 font-semibold not-italic">affordable, practical AI training in India.</span>
              </p>
              <p className="text-slate-600 text-base leading-relaxed italic">
                One payment. Instant access. No BS. Just real skills that save you real time — and maybe even open a new income stream.
                At ₹500, I'm not making money. I'm building trust.
                If you find value, tell a friend. That's all I ask."
              </p>
              <div className="mt-5 pt-4 border-t border-slate-200">
                <p className="text-slate-700 text-sm font-bold">— Founder, LeaMind Academy</p>
                <p className="text-slate-400 text-sm mt-0.5">leamindai.com · Made in India 🇮🇳</p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <footer className="border-t border-slate-100 py-8 pb-36 sm:pb-10 px-4 text-center bg-white">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={LOGO_URL} alt="LeaMind" className="h-6 w-6 rounded-lg object-cover opacity-60" />
          <span className="font-bold text-slate-500 text-base tracking-wide">LeaMind</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-4">
          {["✅ Razorpay Secured", "🔒 No Auto-Renewal", "🏆 Verified Certs", "🇮🇳 Made in India"].map(t => (
            <span key={t} className="text-slate-400 text-sm font-medium">{t}</span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 text-sm">
          <a href="mailto:arobindan@gmail.com" className="text-slate-500 hover:text-blue-600 transition-colors">arobindan@gmail.com</a>
          <a href="/privacy" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="/refund-policy" className="text-slate-500 hover:text-blue-600 transition-colors">Refund &amp; Cancellation Policy</a>
        </div>
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} LeaMind Academy. All rights reserved.</p>
      </footer>

      <EmailAuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        forceLoginOnly={isApp}
      />

      {showInstructions && <InstructionsPopup onClose={() => setShowInstructions(false)} />}

    </div>
  );
}