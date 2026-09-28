import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/api/supabaseClient";
import { CheckCircle2, Smartphone, Globe, Award, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/lib/constants";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.base69bab6ad27684c9ef4099d25.app";
const DEEP_LINK = "leamind://open";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [state, setState] = useState("loading"); // loading | success | error | no-payment
  const [expiryDate, setExpiryDate] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    verifyAndActivate();
  }, []);

  const verifyAndActivate = async () => {
    try {
      // ── 1. Require logged-in user ──
      const user = await getCurrentUser();
      if (!user) {
        navigate(`/?redirect=payment-success`);
        return;
      }

      // ── 2. Get session token ──
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState("error");
        setErrorMsg("Your session expired. Please log in again.");
        return;
      }

      // ── 3. Call the server-side verify-payment function ──
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const res = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMsg(data?.error || "Verification failed. Please try again.");
        return;
      }

      if (data.success === true) {
        setExpiryDate(data.expiry_date || null);
        setState("success");
      } else {
        setState("no-payment");
        setErrorMsg(data?.error || "No valid payment found for your account.");
      }
    } catch (err) {
      console.error("PaymentSuccess error:", err);
      setErrorMsg(err.message || "Something went wrong.");
      setState("error");
    }
  };

  const handleContinueWithApp = () => {
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isMobile) {
      const fallbackTimer = setTimeout(() => {
        window.location.href = PLAY_STORE_URL;
      }, 1800);

      window.addEventListener("pagehide", () => clearTimeout(fallbackTimer));
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) clearTimeout(fallbackTimer);
      });

      window.location.href = DEEP_LINK;
    } else {
      window.location.href = PLAY_STORE_URL;
    }
  };

  const handleContinueOnSite = () => {
    window.location.href = "/Course";
  };

  // ── LOADING ──
  if (state === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] px-6">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-5" />
        <p className="text-slate-600 font-semibold">Verifying your payment…</p>
        <p className="text-slate-400 text-sm mt-1">Talking to Razorpay to confirm</p>
      </div>
    );
  }

  // ── ERROR ──
  if (state === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-500 max-w-sm mb-6">{errorMsg}</p>
        <Button onClick={() => (window.location.href = "/")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Back to Home
        </Button>
      </div>
    );
  }

  // ── NO PAYMENT FOUND ──
  if (state === "no-payment") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">No payment found</h1>
        <p className="text-slate-500 max-w-sm mb-2">{errorMsg}</p>
        <p className="text-slate-400 text-xs max-w-sm mb-6">
          If you just paid, wait 30 seconds and refresh this page. Otherwise, please complete your ₹500 payment on leamindai.com.
        </p>
        <Button onClick={() => (window.location.href = "/")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Back to Home
        </Button>
      </div>
    );
  }

  // ── SUCCESS ──
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-6 py-10 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={LOGO_URL} alt="Leamind" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
            <span className="font-extrabold text-white text-xl">Leamind</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-1">You're subscribed! 🎉</h1>
          <p className="text-white/85 text-sm font-medium">28-day full access unlocked</p>
        </div>

        <div className="px-6 py-6">
          {formattedExpiry && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Access expires</p>
                <p className="text-sm font-bold text-emerald-900">{formattedExpiry}</p>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-600 mb-5 leading-relaxed">
            All 10 AI courses, 70+ lessons, and certificates are now unlocked. Where do you want to continue?
          </p>

          <button
            onClick={handleContinueWithApp}
            className="w-full flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-5 rounded-xl transition-all hover:scale-[1.01] shadow-lg shadow-indigo-200 mb-3"
          >
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="font-black text-base leading-tight">Continue with the App</p>
              <p className="text-white/70 text-xs font-medium mt-0.5">
                Opens Leamind (or Play Store if not installed)
              </p>
            </div>
          </button>

          <button
            onClick={handleContinueOnSite}
            className="w-full flex items-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-4 px-5 rounded-xl transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-left flex-1">
              <p className="font-black text-base leading-tight text-slate-900">Continue on the Website</p>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                Start learning right here on leamindai.com
              </p>
            </div>
          </button>

          <p className="text-center text-xs text-slate-400 mt-5 leading-relaxed">
            Your access is already active. Log in with the same email on any device to unlock premium content.
          </p>
        </div>
      </div>
    </div>
  );
}