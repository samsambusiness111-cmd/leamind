import React from "react";
import { X, Flame, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StreakModal({ open, type, streak, onClose }) {
  if (!open) return null;

  const isReset = type === "reset";
  const isFirst = type === "first";
  const isMilestone = type === "milestone";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center">
        <div className={`px-8 pt-8 pb-6 ${isReset ? "bg-gradient-to-br from-slate-700 to-slate-900" : "bg-gradient-to-br from-orange-500 to-pink-500"}`}>
          <div className="text-6xl mb-3">
            {isReset ? "😢" : isMilestone ? "🏆" : "🔥"}
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-1">
            {isReset ? "Streak Reset" : isFirst ? "Streak Started!" : `${streak} Day Streak!`}
          </h2>
          <p className="text-white/70 text-sm">
            {isReset
              ? "Oops! Your streak was reset — but every expert started at day 1."
              : isFirst
              ? "You've started your learning streak. Come back tomorrow to keep it going!"
              : `You've been learning for ${streak} days in a row. Keep going!`}
          </p>
        </div>
        <div className="px-8 py-6">
          {isReset ? (
            <>
              <div className="bg-orange-50 rounded-xl p-4 mb-5 flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400 shrink-0" />
                <p className="text-sm text-slate-700 text-left">
                  Start today and rebuild your streak. Consistent learners achieve 10× better results.
                </p>
              </div>
              <Button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-xl font-bold">
                I'll Start Today 💪
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i < streak ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-300"}`}>
                    🔥
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {isMilestone ? "Milestone reached! You're building a real habit." : "Come back tomorrow to keep your streak alive."}
              </p>
              <Button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-xl font-bold">
                Keep Learning! 🚀
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}