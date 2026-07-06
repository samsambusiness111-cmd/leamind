import React, { useState } from "react";
import { CheckCircle2, Award, Zap, BookOpen, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/lib/constants";

const PRICE_LABEL = "₹500";

const FEATURES = [
  { icon: BookOpen, text: "Full access to all 10 AI courses (70+ lessons)" },
  { icon: Award, text: "10 professional downloadable certificates" },
  { icon: Zap, text: "Interactive quizzes and audio narration" },
  { icon: CheckCircle2, text: "Progress tracking & streak gamification" },
  { icon: RefreshCw, text: "Renew every 28 days to keep access" },
];



export default function SubscriptionModal({ open, onClose, hardPaywall = false, expired = false }) {
  
  const handlePay = () => {
    window.open("https://rzp.io/rzp/2BWjEFKD", "_blank");
  };

  if (hardPaywall) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F7F8FC] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden my-auto">
          <PaywallContent onPay={handlePay} hardPaywall expired={expired} />
        </div>
      </div>
    );
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <PaywallContent onPay={handlePay} />
      </div>
    </div>
  );
}

function PaywallContent({ onPay, hardPaywall, expired }) {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-8 pt-8 pb-10 relative text-center">
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <Lock className="w-4 h-4 text-white/60" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={LOGO_URL} alt="Leamind" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
          <span className="font-extrabold text-white text-xl">Leamind</span>
        </div>

        {hardPaywall && (
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Lock className="w-3 h-3" /> {expired ? "Subscription Expired" : "Subscription Required"}
          </div>
        )}

        <div className="flex items-end justify-center gap-1 mb-1">
          <span className="text-5xl font-extrabold text-white">{PRICE_LABEL}</span>
        </div>
        <p className="text-white/80 text-sm font-semibold">One-time payment · 28 days full access</p>
        <p className="text-white/60 text-xs mt-1">No auto-renewal · Renew manually each cycle</p>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        {hardPaywall && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              {expired
                ? "Your 28-day access has expired. Pay ₹500 to renew and regain full access."
                : "All courses, lessons, and certificates require an active subscription. Pay ₹500 to unlock 28 days of full access."}
            </p>
          </div>
        )}

        <p className="text-sm font-semibold text-slate-700 mb-4">Everything included:</p>
        <div className="space-y-3 mb-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <f.icon className="w-3 h-3 text-indigo-600" />
              </div>
              <span className="text-sm text-slate-600">{f.text}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={onPay}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl font-bold text-base gap-2 shadow-lg shadow-indigo-200 transition-all"
        >
          {expired ? `Renew Access — ${PRICE_LABEL}` : `Unlock Full Access — ${PRICE_LABEL}`}
        </Button>

        <p className="text-center text-xs text-slate-400 mt-3">
          Secure payment via Razorpay · India's trusted payment gateway
        </p>
      </div>
    </>
  );
}