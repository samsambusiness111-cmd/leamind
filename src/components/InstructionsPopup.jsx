import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Preferences } from "@capacitor/preferences";

const STEPS = [
  { title: "Visit leamindai.com", desc: "Open your browser and go to leamindai.com." },
  { title: "Create your account", desc: "Sign up on the website and set up your login." },
  { title: "Unlock 28-day access", desc: "Pay ₹500 on the website to unlock all 10 AI tools." },
  { title: "Choose where to continue", desc: "After payment, choose to continue on the website or in the app." },
  { title: "Log in here", desc: "If you chose the app, come back here and log in with the same account." },
];

const SEEN_KEY = "leamind_instructions_seen";

export default function InstructionsPopup({ onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const handleClose = async () => {
    try {
      await Preferences.set({ key: SEEN_KEY, value: "true" });
    } catch (e) {
      localStorage.setItem(SEEN_KEY, "true");
    }
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 pr-8">
          <p className="text-emerald-400 text-xs font-bold tracking-[3px] uppercase mb-1">
            How it works
          </p>
          <h2 className="text-white font-black text-xl">
            Step {step + 1} of {STEPS.length}
          </h2>
        </div>

        <div className="mb-6 min-h-[120px]">
          <p className="text-white font-bold text-lg mb-2">{current.title}</p>
          <p className="text-white/50 text-sm leading-relaxed">{current.desc}</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-emerald-400" : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={() => setStep(step - 1)}
              className="h-11 px-4 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-semibold">Back</span>
            </button>
          )}
          <button
            onClick={() => (isLast ? handleClose() : setStep(step + 1))}
            className="flex-1 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-colors flex items-center justify-center gap-1"
          >
            {isLast ? "Got it" : "Next"}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export async function shouldShowInstructions() {
  try {
    const { value } = await Preferences.get({ key: SEEN_KEY });
    return value !== "true";
  } catch (e) {
    return localStorage.getItem(SEEN_KEY) !== "true";
  }
}