import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, Key } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getUserProgress,
  createUserProgress,
  updateUserProgress,
  isPaymentIdUsedByOther,
} from "@/api/entities";

export default function RestoreAccessModal({ open, onClose, onSuccess }) {
  const [paymentId, setPaymentId] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const handleRestore = async () => {
    const pid = paymentId.trim();
    if (!pid) return;

    setStatus("loading");
    const user = await getCurrentUser();
    if (!user) { setStatus("error"); setErrorMsg("You must be logged in."); return; }

    const usedByOther = await isPaymentIdUsedByOther(pid, user.email);
    if (usedByOther) {
      setStatus("already_used");
      return;
    }

    const prog = await getUserProgress(user.email);

    if (prog?.last_payment_id === pid && prog?.subscription_status === "active") {
      const stillActive = prog.subscription_expires && new Date(prog.subscription_expires) > new Date();
      if (stillActive) { setStatus("success"); onSuccess?.(); return; }
    }

    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().slice(0, 10);

    if (prog) {
      await updateUserProgress(prog.id, {
        subscription_status: "active",
        subscription_expires: expires,
        enrolled: true,
        last_payment_id: pid,
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
        last_payment_id: pid,
        streak_count: 1,
        longest_streak: 1,
        last_login_date: today,
      });
    }

    setStatus("success");
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Key className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Restore Access</h2>
        </div>

        {status === "success" ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">Access Restored!</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">Your 28-day access is now active.</p>
            <Button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
              Start Learning
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Already paid but lost access? Enter your Razorpay Payment ID (starts with <span className="font-mono text-slate-700">pay_</span>) to restore your subscription.
            </p>

            <input
              type="text"
              value={paymentId}
              onChange={e => { setPaymentId(e.target.value); setStatus("idle"); }}
              placeholder="pay_XXXXXXXXXXXXXXXX"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
            />

            {status === "already_used" && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">This Payment ID has already been used by another account. Please contact support.</p>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{errorMsg}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl border-slate-200 text-slate-600">
                Cancel
              </Button>
              <Button
                onClick={handleRestore}
                disabled={status === "loading" || !paymentId.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2"
              >
                {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Restore Access"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
