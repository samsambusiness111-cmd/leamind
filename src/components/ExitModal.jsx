import { X } from "lucide-react";

export default function ExitModal({ onContinue, onEnd, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="text-4xl mb-4 text-center">⏸️</div>
        <h3 className="text-xl font-bold text-center text-foreground mb-2">Leaving so soon?</h3>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Your progress is saved. What would you like to do?
        </p>
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all"
          >
            Continue the Course
          </button>
          <button
            onClick={onEnd}
            className="w-full py-3 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-all"
          >
            End the Session
          </button>
        </div>
      </div>
    </div>
  );
}