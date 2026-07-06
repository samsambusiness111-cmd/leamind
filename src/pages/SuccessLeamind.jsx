import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { getCurrentUser, redirectToLogin } from "@/lib/auth";
import {
  getUserProgress,
  createUserProgress,
  updateUserProgress,
  isPaymentIdUsedByOther,
} from "@/api/entities";
import { LOGO_URL } from "@/lib/constants";

export default function SuccessLeamind() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("activating");

  useEffect(() => {
    activateSubscription();
  }, []);

  const activateSubscription = async () => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("razorpay_payment_id");
    const source = params.get("source");

    const user = await getCurrentUser();
    if (!user) {
      setStatus("needs_login");
      return;
    }

    if (source === "razorpay" && paymentId) {
      const alreadyUsed = await isPaymentIdUsedByOther(paymentId, user.email);
      if (alreadyUsed) {
        navigate("/home");
        return;
      }
    }

    const prog = await getUserProgress(user.email);

    if (source === "razorpay" && paymentId && prog?.last_payment_id === paymentId) {
      setStatus("done");
      return;
    }

    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().slice(0, 10);

    if (prog) {
      await updateUserProgress(prog.id, {
        subscription_status: "active",
        subscription_expires: expires,
        enrolled: true,
        ...(paymentId && { last_payment_id: paymentId }),
      });
    } else {
      await createUserProgress({
        created_by: user.email,
        enrolled: true,
        completed_lessons: [],
        quiz_scores: {},
        current_module: "deepseek",
        current_lesson: 0,
        subscription_status: "active",
        subscription_expires: expires,
        streak_count: 1,
        longest_streak: 1,
        last_login_date: today,
        ...(paymentId && { last_payment_id: paymentId }),
      });
    }

    setStatus("done");
  };

  const goToDashboard = () => {
    if (status === "needs_login") {
      redirectToLogin();
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#000" }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: "#0a0a0a" }}>
        <div className="px-8 pt-10 pb-8 text-center border-b border-white/5">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <img src={LOGO_URL} alt="LeaMind" className="h-10 w-10 rounded-xl object-cover" />
            <span className="font-extrabold text-white text-xl">LeaMind</span>
          </div>

          {status === "activating" ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-14 h-14 text-emerald-400 animate-spin" />
              <p className="text-white font-semibold text-lg">Activating your access...</p>
              <p className="text-white/40 text-sm">Please wait, do not close this page</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-black text-white">Payment Successful!</h1>
              <p className="text-white/60 text-base leading-relaxed">
                {status === "needs_login"
                  ? "Sign in below to activate your full access to LeaMind."
                  : <>You now have <span className="text-emerald-400 font-bold">full access to LeaMind</span> for 28 days.</>}
              </p>
            </div>
          )}
        </div>

        {(status === "done" || status === "needs_login") && (
          <div className="px-8 py-7 space-y-4">
            {[
              "All 10 AI tool courses unlocked",
              "70+ in-depth lessons — instant access",
              "10 professional certificates",
              "Access expires in exactly 28 days",
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}

            <div className="pt-4">
              <button
                onClick={goToDashboard}
                className="flex items-center justify-center gap-2 w-full py-5 rounded-2xl font-black text-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #34d399, #10b981)", boxShadow: "0 0 40px rgba(52,211,153,0.3)" }}
              >
                {status === "needs_login" ? "Sign In to Activate →" : <>Go to Dashboard <ArrowRight className="w-5 h-5" /></>}
              </button>
              <p className="text-center text-white/20 text-xs mt-3">
                {status === "needs_login" ? "Sign in with your Google account to complete activation" : "Your 28-day access starts now"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
