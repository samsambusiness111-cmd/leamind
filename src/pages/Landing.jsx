import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Star, Zap, Lock, Rocket, Quote, Shield, Award, TrendingUp } from "lucide-react";
import FreeLessonSection from "@/components/landing/FreeLessonSection";
import { openRazorpayCheckout } from "@/utils/razorpay";
import { getCurrentUser, redirectToLogin } from "@/lib/auth";
import { LOGO_URL } from "@/lib/constants";


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
  Beginner: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Intermediate: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Advanced: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  "All Levels": "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
};

const REVIEWS = [
  { name: "Rahul Verma", role: "Software Developer", company: "Delhi", text: "Honestly saves me 2–3 hours every day. The lessons are short, practical, and actually show you what to type. Worth every rupee.", initials: "RV", highlight: "Saves 2–3 hrs daily", avatarGrad: "from-blue-500 to-indigo-600", module: "GitHub Copilot + ChatGPT", date: "March 2026" },
  { name: "Sneha Iyer", role: "College Student", company: "Pune", text: "₹500 for an AI course? It literally costs less than a coffee + samosa combo. The Notion AI and Perplexity modules alone changed how I study.", initials: "SI", highlight: "Less than a coffee ☕", avatarGrad: "from-pink-500 to-rose-500", module: "Notion AI + Perplexity", date: "February 2026" },
  { name: "Aditya Sharma", role: "Marketing Executive", company: "Mumbai", text: "I'm consistently getting small content gigs on the side using AI. Realistic, learnable skills that actually opened a side income stream.", initials: "AS", highlight: "Side income gigs", avatarGrad: "from-amber-500 to-orange-500", module: "ChatGPT + Claude", date: "January 2026" },
  { name: "Priya Menon", role: "Freelance Designer", company: "Bangalore", text: "The Midjourney module helped me offer AI-generated mockups to clients. My existing work became faster and more impressive.", initials: "PM", highlight: "More value per project", avatarGrad: "from-purple-500 to-violet-600", module: "Midjourney / DALL-E", date: "March 2026" },
  { name: "Karan Malhotra", role: "HR Manager", company: "Hyderabad", text: "After the ChatGPT module, I now draft job descriptions and performance reviews in minutes. If you work with documents all day, this is essential.", initials: "KM", highlight: "10x faster drafting", avatarGrad: "from-teal-500 to-green-500", module: "ChatGPT", date: "April 2026" },
];

const BOTTOM_REVIEWS = REVIEWS;

const CERT_SAMPLES = [
  { name: "Rahul Verma", module: "ChatGPT", id: "LM-K9X2-R4TW-5AJP", date: "March 2026" },
  { name: "Priya Menon", module: "Midjourney", id: "LM-T7YZ-Q2NW-8BKP", date: "March 2026" },
];

const GHOST_ENROLLMENTS = [
  { city: "Mumbai" },
  { city: "Bangalore" },
  { city: "Delhi" },
  { city: "Pune" },
  { city: "Hyderabad" },
  { city: "Chennai" },
  { city: "Jaipur" },
  { city: "Kochi" },
  { city: "Ahmedabad" },
  { city: "Kolkata" },
  { city: "Lucknow" },
  { city: "Surat" },
  { city: "Bhopal" },
  { city: "Nagpur" },
  { city: "Coimbatore" },
  { city: "Chandigarh" },
  { city: "Indore" },
  { city: "Vadodara" },
  { city: "Patna" },
  { city: "Visakhapatnam" },
];

/* ─── Ghost Activity Toast ─── */
function GhostToast() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Show first toast after 4 seconds
    const initial = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    }, 4000);

    // Then cycle every 15 seconds
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % GHOST_ENROLLMENTS.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    }, 15000);

    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  const entry = GHOST_ENROLLMENTS[current];

  return (
    <motion.div
      initial={{ opacity: 0, x: -60, y: 0 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-32 sm:bottom-24 left-3 sm:left-4 z-[60] max-w-[260px] pointer-events-none"
    >
      <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-base shrink-0">🚀</div>
        <div>
          <p className="text-white text-sm font-bold leading-tight">Someone from {entry.city}</p>
          <p className="text-white/40 text-xs mt-0.5">just enrolled in <span className="text-emerald-400">the AI Masterclass</span></p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Fade-in wrapper ─── */
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

/* ─── Countdown ─── */
function useCountdown(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  return { m, s, timeLeft };
}

/* ─── Dynamic spot counter ─── */
function useSpotCounter(start = 247) {
  const [spots, setSpots] = useState(start);
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(prev => {
        if (prev <= 9) return prev;
        return Math.random() < 0.3 ? prev - 1 : prev;
      });
    }, 18000);
    return () => clearInterval(interval);
  }, []);
  return spots;
}

/* ─── Section label ─── */
function SectionLabel({ children }) {
  return <p className="text-xs sm:text-[10px] font-bold tracking-[5px] text-yellow-600/70 uppercase mb-3 text-center">{children}</p>;
}

/* ─── Gold divider ─── */
function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-6 sm:my-10">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.25))" }} />
      <div className="w-1.5 h-1.5 bg-yellow-600/40 rotate-45" />
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(212,160,23,0.25), transparent)" }} />
    </div>
  );
}



/* ─── CertMiniPreview ─── */
function CertMiniPreview({ cert }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden border border-yellow-500/25 shadow-[0_0_30px_rgba(212,160,23,0.1)] relative cursor-pointer"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #10103a 60%, #080818 100%)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover overlay */}
      {hovered && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-xl"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}>
          <div className="w-8 h-8 rounded-full border border-yellow-500/50 flex items-center justify-center mb-1"
            style={{ background: "rgba(212,160,23,0.15)" }}>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-white font-black text-xs">✅ Verifiable on LinkedIn</p>
          <p className="text-yellow-400/80 font-mono text-[9px] tracking-wider">{cert.id}</p>
          <p className="text-white/30 text-[9px]">Issued by Leamind Academy</p>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ rotate: "-25deg" }}>
        <span className="text-white/[0.04] font-black text-3xl select-none tracking-widest uppercase">SAMPLE</span>
      </div>
      <div className="relative p-3" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-yellow-500/30" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-yellow-500/30" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-yellow-500/30" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-yellow-500/30" />
        <div className="flex items-center gap-1.5 mb-2">
          <img src={LOGO_URL} alt="LeaMind" className="h-4 w-4 rounded object-cover" />
          <p className="text-white font-black text-[9px] leading-none flex-1">LeaMind</p>
          <div className="w-6 h-6 rounded-full border border-yellow-500/40 flex flex-col items-center justify-center"
            style={{ background: "radial-gradient(circle, #1a1a4a, #080818)" }}>
            <span className="text-yellow-400 text-[4px] font-black leading-none">AI</span>
            <span className="text-white text-[3px] font-black">PRO</span>
          </div>
        </div>
        <div className="h-px w-full mb-1" style={{ background: "linear-gradient(90deg, transparent, #d4a017, transparent)" }} />
        <p className="text-center text-yellow-500/80 text-[6px] font-bold tracking-[2px] uppercase mb-0.5">Certificate of Completion</p>
        <p className="text-center text-white/30 text-[6px] mb-0.5">This is to certify that</p>
        <p className="text-center text-white font-black text-xs mb-0.5">{cert.name}</p>
        <div className="h-px w-10 mx-auto mb-0.5" style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }} />
        <p className="text-center text-indigo-400 text-[7px] font-bold tracking-wider">{cert.module} — AI Professional Cert.</p>
        <div className="h-px w-full mt-1.5 mb-1" style={{ background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.2), transparent)" }} />
        <div className="flex justify-between items-center text-[5px] text-white/25">
          <span>{cert.date}</span>
          <span className="text-yellow-500/50 font-mono">{cert.id}</span>
          <span>Leamind</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Review Card ─── */
function ReviewCard({ r }) {
  return (
    <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-4 overflow-hidden hover:border-white/14 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]">
      <Quote className="absolute top-3 right-3 w-5 h-5 text-white/5" />
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.avatarGrad} flex items-center justify-center text-white font-black text-sm shrink-0`}>{r.initials}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm leading-tight">{r.name}</p>
          <p className="text-white/40 text-sm mt-0.5">{r.role} · {r.company}</p>
          <div className="flex items-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            <span className="text-xs text-white/20 ml-1">{r.date}</span>
          </div>
        </div>
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-3 italic">"{r.text}"</p>
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5">
        <span className="text-xs text-indigo-300/80 bg-indigo-500/10 px-2.5 py-1 rounded-full">{r.module}</span>
        <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">{r.highlight}</span>
      </div>
    </div>
  );
}



export default function Landing() {
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const spots = useSpotCounter(247);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (user) {
        window.location.href = "/home";
      } else {
        await redirectToLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPayLoading(true);
    const user = await getCurrentUser();
    if (!user) {
      await redirectToLogin();
      setPayLoading(false);
      return;
    }
    openRazorpayCheckout({
      onSuccess: (paymentId) => {
        window.location.href = `/payment-success?razorpay_payment_id=${paymentId}`;
      },
      onFailure: () => setPayLoading(false),
      onDismiss: () => setPayLoading(false),
    });
  };

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden font-sans" style={{ background: "#000000", color: "#ffffff" }}>

      {/* ── GHOST ACTIVITY TOAST ── */}
      <GhostToast />

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden px-3 pb-safe"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0.95) 90%, transparent)", paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)", paddingTop: "12px" }}>
        <div className="flex gap-2 mb-2">
          <button onClick={handleSignUp} disabled={loading}
            className="flex-1 text-black font-black text-base h-14 rounded-2xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #34d399, #10b981)", boxShadow: "0 0 40px rgba(52,211,153,0.5)" }}>
            {loading ? "..." : "🚀 Sign Up Free →"}
          </button>
        </div>
        <p className="text-white/30 text-xs text-center flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> UPI · GPay · PhonePe · Cards accepted
        </p>
      </div>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5" style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(24px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="LeaMind" className="h-8 w-8 rounded-xl object-cover" />
            <span className="font-bold text-white text-base sm:text-lg tracking-tight">LeaMind</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-white/25 text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              {spots} spots left
            </span>
            <button onClick={handleSignUp} disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-black px-4 sm:px-5 py-2.5 rounded-full transition-colors shadow-[0_0_20px_rgba(52,211,153,0.25)] disabled:opacity-70">
              {loading ? "..." : "Sign Up →"}
            </button>

          </div>
        </div>
      </nav>



      {/* ═══════════════════════════════════════
          HERO — 3 COLUMN
      ═══════════════════════════════════════ */}
      <section className="px-0 sm:px-4 pt-10 sm:pt-20 pb-12 sm:pb-24 relative overflow-hidden" style={{ background: "#000000" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 65%)" }} />
        <div className="absolute top-32 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(212,160,23,0.06) 0%, transparent 65%)" }} />

        <div className="max-w-7xl mx-auto relative px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-6 sm:gap-10 xl:gap-14 items-start">

            {/* ── LEFT: 2 Reviews ── */}
            <div className="hidden lg:flex flex-col gap-5 pt-16">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <p className="text-yellow-600/60 font-bold text-[9px] uppercase tracking-[3px]">Student Reviews</p>
              </div>
              {REVIEWS.slice(0, 2).map((r, i) => (
                <motion.div key={r.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}>
                  <ReviewCard r={r} />
                </motion.div>
              ))}
            </div>

            {/* ── CENTER ── */}
            <div className="text-center">

              {/* Eyebrow pill */}
              <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6 sm:mb-8">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300/80 text-sm font-semibold tracking-wide">🔥 500+ Students Already Mastering AI Tools</span>
              </motion.div>

              {/* HEADLINE — Big & Bold */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight mb-4 sm:mb-5"
              >
                The Only AI Masterclass<br />
                <span className="text-white/30 text-2xl sm:text-4xl lg:text-5xl font-bold">Built for the</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #34d399, #10b981)" }}>
                  Indian Budget.
                </span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="text-white/50 text-base sm:text-lg font-medium mb-6 sm:mb-10 max-w-lg mx-auto leading-relaxed"
              >
                Get the real skill employers are hiring for —{" "}
                <span className="text-emerald-400 font-semibold">AI.</span>
              </motion.p>

              {/* Hook statement — MOVED UP before price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.55 }}
                className="mb-6 sm:mb-8 px-5 sm:px-6 py-5 rounded-2xl border border-emerald-500/15"
                style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.04), rgba(0,0,0,0))" }}
              >
                <p className="text-white font-black text-xl sm:text-3xl leading-tight tracking-tight mb-1.5">AI won't replace you.</p>
                <p className="text-emerald-400 font-black text-xl sm:text-3xl leading-tight tracking-tight">A person using AI will.</p>
                <div className="w-14 h-px mx-auto mt-3 sm:mt-4" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />
                <p className="text-white/30 text-base mt-3">Be that person. Learn it properly. Start today — it's free to join.</p>
              </motion.div>

              {/* Value bullets — what you GET */}
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
                  <div key={item} className="flex items-center gap-2 bg-white/[0.03] border border-white/6 rounded-xl px-3 py-2.5">
                    <span className="text-sm leading-tight text-white/70">{item}</span>
                  </div>
                ))}
              </motion.div>

              {/* PRICE BLOCK */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.5 }}
                className="mb-5 rounded-2xl border border-emerald-500/25 overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(0,0,0,0))" }}>
                <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">One-time payment · 28-day access</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-white/25 text-xl line-through font-bold">₹2,000</span>
                      <span className="text-emerald-400 text-4xl font-black">₹500</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-2 py-0.5 rounded-full border border-emerald-500/30">75% OFF</span>
                    </div>
                    <p className="text-white/25 text-xs mt-1">UPI · GPay · PhonePe · Cards — all accepted</p>
                  </div>
                  <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="shrink-0 h-12 px-7 rounded-xl font-black text-black text-base disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #34d399, #10b981)", boxShadow: "0 0 30px rgba(52,211,153,0.3)" }}
                  >
                    {loading ? "Loading..." : "Sign Up Free →"}
                  </button>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto h-12 px-6 rounded-2xl font-bold text-white/70 text-base border border-white/10 hover:border-white/20 transition-colors disabled:opacity-70"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {loading ? "Loading..." : "🚀 Sign Up →"}
                </button>
                <p className="text-white/30 text-sm mt-3">✅ Free to browse · Pay ₹500 to unlock all courses</p>
              </motion.div>



              {/* Mobile: certs */}
              <div className="lg:hidden mt-8 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <p className="text-yellow-500/80 font-bold text-xs uppercase tracking-[3px]">Sample Certificates</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CERT_SAMPLES.map((cert, i) => (
                    <div key={i}><CertMiniPreview cert={cert} /><p className="text-white/25 text-xs mt-1.5 text-center">{cert.name} · {cert.module}</p></div>
                  ))}
                </div>
              </div>

              <GoldDivider />

              {/* ── COMPARISON (Moved to hero area) ── */}
              <FadeIn>
                <div className="border border-white/7 rounded-2xl sm:rounded-2xl overflow-hidden">
                  <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 text-center border-b border-white/5">
                    <p className="text-yellow-600/80 font-bold text-sm sm:text-base uppercase tracking-wider mb-1">Paisa Vasool Guarantee</p>
                    <p className="text-white/30 text-sm">Most AI courses cost ₹15,000–₹30,000. See the difference.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-white/5">
                    <div className="p-4 sm:p-5 border-b border-white/5 sm:border-b-0">
                      <p className="text-white/30 text-xs font-bold uppercase tracking-wider mb-4 text-center">Other Courses</p>
                      <ul className="space-y-3">
                        {[
                          "₹15,000–₹30,000 cost",
                          "Lecture videos, no practice",
                          "Overwhelming to start",
                          "Requires Credit Card",
                          "Auto-renews silently",
                        ].map(item => (
                          <li key={item} className="flex items-center gap-3 text-sm text-white/30">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 shrink-0">✕</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 sm:p-5 relative" style={{ background: "rgba(52,211,153,0.03)" }}>
                      <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4 text-center">Leamind</p>
                      <ul className="space-y-3">
                        {[
                          "₹500 — one-time, forever",
                          "Interactive exercises & real practice",
                          "Beginner-friendly",
                          "UPI, GPay, PhonePe ready",
                          "One payment. Lifetime access.",
                        ].map(item => (
                          <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">✓</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 py-4 border-t border-white/5 text-center" style={{ background: "rgba(212,160,23,0.02)" }}>
                    <p className="text-yellow-600/60 text-sm italic">"Practical, affordable, built for real Indian students."</p>
                  </div>
                </div>
              </FadeIn>

              {/* Mobile: reviews */}
              <div className="lg:hidden mt-8 text-left space-y-3">
                <SectionLabel>Real Results From Students</SectionLabel>
                {REVIEWS.slice(0, 3).map(r => <ReviewCard key={r.name} r={r} />)}
              </div>
            </div>

            {/* ── RIGHT: 2 Certificates ── */}
            <div className="hidden lg:flex flex-col gap-5 pt-16">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3 h-3 text-yellow-500" />
                <p className="text-yellow-600/60 font-bold text-[9px] uppercase tracking-[3px]">Sample Certificates</p>
              </div>
              {CERT_SAMPLES.map((cert, i) => (
                <motion.div key={cert.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}>
                  <CertMiniPreview cert={cert} />
                  <p className="text-white/18 text-[9px] mt-1.5 text-center tracking-wide">{cert.name} · {cert.module}</p>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
                className="border border-white/5 rounded-xl p-4 mt-1 text-center" style={{ background: "rgba(212,160,23,0.025)" }}>
                <p className="text-yellow-500/70 text-xs font-bold mb-1">🏆 10 Certificates Total</p>
                <p className="text-white/20 text-[10px] leading-relaxed">One per AI tool. Download PDF. Share on LinkedIn.</p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FREE LESSON — Try Before You Buy
      ═══════════════════════════════════════ */}
      <FreeLessonSection onSignUp={handleSignUp} />



      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-white/5" style={{ background: "#000000" }}>
          <div className="max-w-4xl mx-auto text-center">
            <SectionLabel>Results</SectionLabel>

            <h2 className="text-2xl sm:text-4xl font-black text-white mb-8 sm:mb-12 tracking-tight">What Our Students Achieve</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: "🧠", value: "10+", label: "AI tools taught in depth", sub: "With interactive exercises" },
                { icon: "📈", value: "500+", label: "Students enrolled", sub: "Growing every week" },
                { icon: "🎓", value: "95%", label: "Report real skill improvement", sub: "Within first 2 weeks" },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="border border-white/6 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/20 transition-colors duration-300 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-0"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-4xl sm:mb-4">{stat.icon}</div>
                  <div className="text-left sm:text-center">
                    <p className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1 sm:mb-2">{stat.value}</p>
                    <p className="text-white/60 text-base sm:text-sm font-semibold">{stat.label}</p>
                    <p className="text-white/30 text-sm mt-0.5">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════
          TOOLS / CERTIFICATES (replaces quiz)
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-white/5" style={{ background: "#050505" }}>
          <div className="max-w-5xl mx-auto">
            <SectionLabel>What's Inside</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black text-white text-center mb-2 tracking-tight">10 AI Tools. Mastered Properly.</h2>
            <p className="text-center text-white/40 text-base mb-8 sm:mb-12">Each module teaches you how a tool works, why it works, and how to use it to its full potential — with interactive exercises and a verified certificate.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TOOLS.map((tool, i) => (
                <motion.div key={tool.name}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="border border-white/5 rounded-2xl overflow-hidden hover:border-white/14 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className={`h-14 bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl group-hover:opacity-90 transition-opacity`}>{tool.emoji}</div>
                  <div className="p-3">
                    <h3 className="font-bold text-white/80 text-sm mb-2 leading-tight">{tool.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[tool.level]}`}>{tool.level}</span>
                      <span className="text-xs text-yellow-500/60">🏆</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Zeigarnik Steps
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-white/5" style={{ background: "#000000" }}>
          <div className="max-w-4xl mx-auto text-center">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 tracking-tight">Start in 3 Minutes. Results in 3 Days.</h2>
            <p className="text-white/40 text-base mb-8 sm:mb-14">Each lesson teaches you how a tool works, then gives you an exercise to use it yourself — so you actually learn it, not just watch it.</p>

            {/* Progress bar visual */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
              <div className="flex items-center gap-0 mb-3">
                {["Sign Up", "Pick Tool", "Lesson", "Get Cert"].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border-2 border-emerald-400/60 flex items-center justify-center text-sm sm:text-xs font-black text-emerald-400" style={{ background: "rgba(52,211,153,0.15)" }}>{i + 1}</div>
                      <span className="text-xs sm:text-[9px] text-white/40 font-medium whitespace-nowrap">{step}</span>
                    </div>
                    {i < 3 && <div className="flex-1 h-px mx-1" style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.5), rgba(52,211,153,0.1))" }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {[
                { icon: <Lock className="w-6 h-6 text-indigo-400" />, step: "01", title: "Sign up with Google", sub: "One-click. 10 seconds. No forms.", bg: "from-indigo-500/10 to-indigo-600/5", border: "border-indigo-500/20" },
                { icon: <Zap className="w-6 h-6 text-yellow-400" />, step: "02", title: "Explore the platform", sub: "Browse all 10 AI tool courses and try a free lesson.", bg: "from-yellow-500/10 to-yellow-600/5", border: "border-yellow-500/20" },
                { icon: <Rocket className="w-6 h-6 text-emerald-400" />, step: "03", title: "Start your first lesson", sub: "Instant access. First certificate in hours.", bg: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/20" },
              ].map((s, i) => (
                <motion.div key={s.step}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.45 }}
                  className={`border ${s.border} rounded-2xl p-5 sm:p-7 flex flex-row sm:flex-col gap-4 sm:gap-0 items-center sm:items-center text-left sm:text-center hover:border-white/15 transition-colors bg-gradient-to-br ${s.bg}`}>
                  <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-xl border border-white/7 flex items-center justify-center shrink-0 sm:mx-auto sm:mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>{s.icon}</div>
                  <div>
                    <p className="text-xs text-white/20 font-bold tracking-[3px] mb-1 sm:mb-2">STEP {s.step}</p>
                    <p className="font-bold text-white text-base mb-1 sm:mb-2">{s.title}</p>
                    <p className="text-sm text-white/40">{s.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════
          TRUST STRIP
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-8 sm:py-10 px-4 border-t border-b border-white/4" style={{ background: "#030303" }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: <Shield className="w-5 h-5 text-emerald-500" />, label: "Secure Payment", sub: "Razorpay · RBI compliant" },
              { icon: <Award className="w-5 h-5 text-yellow-500" />, label: "Verified Certs", sub: "Unique ID per cert" },
              { icon: <TrendingUp className="w-5 h-5 text-indigo-400" />, label: "Results in Week 1", sub: "500+ students agree" },
              { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, label: "No Auto-Renewal", sub: "One payment. Done." },
            ].map(t => (
              <div key={t.label} className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border border-white/6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="mb-2 sm:mb-3">{t.icon}</div>
                <p className="font-bold text-white/70 text-sm mb-0.5">{t.label}</p>
                <p className="text-white/30 text-xs">{t.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>



      {/* ═══════════════════════════════════════
          BEFORE YOU DECIDE
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-white/5" style={{ background: "#040408" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <SectionLabel>Honest Answers</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">Before You Decide</h2>
              <p className="text-white/40 text-base">You probably have doubts. That's fair. Here's an honest answer to each one.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  concern: "\"₹500 sounds too cheap. Is this actually good quality?\"",
                  icon: "🤔",
                  response: "We kept the price low on purpose — not because the content is low quality, but because we believe AI education shouldn't cost ₹20,000. Every lesson explains how a tool works, why it works, and gives you a real exercise to practice it yourself. 500+ students have gone through it. See the free lesson above and judge for yourself.",
                  tag: "Quality"
                },
                {
                  concern: "\"What if I'm not tech-savvy? Will I be lost?\"",
                  icon: "😟",
                  response: "All 10 modules start from zero. No coding. No technical background needed. Each lesson builds your understanding step by step, then gives you hands-on exercises to apply what you learned. Most of our students had never seriously used an AI tool before joining.",
                  tag: "Beginner Friendly"
                },
                {
                  concern: "\"Is my payment safe? Will I get charged again later?\"",
                  icon: "🔒",
                  response: "Payment is processed by Razorpay — India's most trusted payment gateway, used by Swiggy, Zepto, and thousands of businesses. This is a one-time payment. There is no subscription, no auto-renewal, and no hidden charges. You pay once, you get 30-day full access. That's it.",
                  tag: "Payment Safety"
                },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="border border-white/6 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-white/80 text-base font-semibold italic leading-snug">{item.concern}</p>
                        <span className="inline-block mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-white/35 border border-white/10 tracking-wider uppercase">{item.tag}</span>
                      </div>
                    </div>
                    <div className="h-px bg-white/5 mb-4" />
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-white/60 text-base leading-relaxed">{item.response}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom reassurance */}
            <div className="mt-6 sm:mt-8 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 text-center"
              style={{ background: "rgba(52,211,153,0.04)" }}>
              <p className="text-emerald-400/90 text-base font-semibold mb-1">Still unsure? Read the free lesson above — it's the real thing.</p>
              <p className="text-white/30 text-sm">No email required. No commitment. Just read it, use the prompt, and decide.</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════
          5 REVIEWS
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-12 sm:py-20 px-4 border-t border-white/5 relative overflow-hidden" style={{ background: "#050505" }}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 65%)" }} />
          <div className="max-w-6xl mx-auto relative">
            <SectionLabel>Student Stories</SectionLabel>
            <h2 className="text-2xl sm:text-4xl font-black text-white text-center mb-2 tracking-tight">Real People. Real Results.</h2>
            <p className="text-center text-white/40 text-base mb-8 sm:mb-14">Not motivational fluff. Actual outcomes from people like you.</p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="lg:col-span-2">
                <ReviewCard r={BOTTOM_REVIEWS[0]} />
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {BOTTOM_REVIEWS.slice(1, 4).map(r => (
                  <ReviewCard key={r.name} r={r} />
                ))}
              </div>
            </div>

            <div className="border border-white/8 rounded-2xl p-5 sm:p-6 hover:border-white/13 transition-colors" style={{ background: "rgba(255,255,255,0.03)" }}>
              <ReviewCard r={BOTTOM_REVIEWS[4]} />
            </div>
            <p className="text-center text-white/20 text-xs mt-6 sm:mt-8 tracking-wide">Results may vary. Real student experiences shared with permission.</p>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-16 sm:py-28 px-4 text-center relative overflow-hidden border-t border-white/5" style={{ background: "#000000" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.1) 0%, transparent 55%)" }} />
          <div className="max-w-2xl mx-auto relative">
            <div className="text-5xl mb-5">🚀</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              Your AI Journey<br /><span className="text-emerald-400">Starts Today.</span>
            </h2>
            <p className="text-white/40 text-base mb-6 sm:mb-8 font-medium max-w-sm mx-auto">No experience needed. Join 500+ students who are genuinely learning to master AI — not just dabble with it.</p>
            <div className="flex items-baseline justify-center gap-3 mb-5">
              <span className="text-white/25 text-2xl line-through font-bold">₹2,000</span>
              <span className="text-emerald-400 text-5xl font-black">₹500</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-sm font-black px-2.5 py-1 rounded-full border border-emerald-500/30">75% OFF</span>
            </div>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto h-14 sm:h-16 px-6 sm:px-10 rounded-2xl font-black text-black text-lg sm:text-xl disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #34d399, #10b981)", boxShadow: "0 0 50px rgba(52,211,153,0.35), 0 4px 24px rgba(0,0,0,0.5)" }}
            >
              {loading ? "Loading..." : "🚀 Sign Up Free →"}
            </button>
            <p className="text-white/25 text-sm mt-3">Free to join · Unlock full access after sign up</p>
          </div>
        </section>
      </FadeIn>

      {/* ═══════════════════════════════════════
          FOUNDER'S NOTE
      ═══════════════════════════════════════ */}
      <FadeIn>
        <section className="py-10 sm:py-16 px-4 border-t border-white/5" style={{ background: "#040404" }}>
          <div className="max-w-2xl mx-auto">
            <div className="border border-white/8 rounded-2xl p-5 sm:p-8 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.025)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(212,160,23,0.05) 0%, transparent 70%)" }} />
              <div className="flex items-center gap-3 mb-5">
                <img src={LOGO_URL} alt="Founder" className="h-10 w-10 rounded-xl object-cover border border-white/10" />
                <div>
                  <p className="font-black text-white text-base">A Note From the Founder</p>
                  <p className="text-white/35 text-sm">LeaMind Academy</p>
                </div>
              </div>
              <p className="text-white/55 text-base leading-relaxed mb-4 italic">
                "I got tired of seeing AI courses sold for ₹20,000–₹30,000 — most of it padding, theory, and recycled YouTube content.
                I built LeaMind to be the most <span className="text-white/85 font-semibold not-italic">affordable, practical AI training in India.</span>
              </p>
              <p className="text-white/55 text-base leading-relaxed italic">
                One payment. Instant access. No BS. Just real skills that save you real time — and maybe even open a new income stream.
                At ₹500, I'm not making money. I'm building trust.
                If you find value, tell a friend. That's all I ask."
              </p>
              <div className="mt-5 pt-4 border-t border-white/5">
                <p className="text-white/45 text-sm font-bold">— Founder, LeaMind Academy</p>
                <p className="text-white/20 text-sm mt-0.5">leamindai.com · Made in India 🇮🇳</p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/4 py-8 pb-36 sm:pb-10 px-4 text-center" style={{ background: "#000000" }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={LOGO_URL} alt="LeaMind" className="h-6 w-6 rounded-lg object-cover opacity-40" />
          <span className="font-bold text-white/40 text-base tracking-wide">LeaMind</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-4">
          {["✅ Razorpay Secured", "🔒 No Auto-Renewal", "🏆 Verified Certs", "🇮🇳 Made in India"].map(t => (
            <span key={t} className="text-white/25 text-sm font-medium">{t}</span>
          ))}
        </div>
        <p className="text-white/15 text-sm">© {new Date().getFullYear()} LeaMind Academy. All rights reserved.</p>
      </footer>

    </div>
  );
}