import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";

export default function Quiz({ quiz, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === quiz.correct) onComplete && onComplete(true);
  };

  const isCorrect = selected === quiz.correct;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-violet-100 text-violet-700">Knowledge Check</span>
      </div>
      <p className="font-semibold text-foreground mb-4 text-base leading-relaxed">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          let style = "border-border bg-muted/40 hover:border-violet-300 hover:bg-violet-50";
          if (answered) {
            if (i === quiz.correct) style = "border-emerald-500 bg-emerald-50";
            else if (i === selected && !isCorrect) style = "border-red-400 bg-red-50";
            else style = "border-border bg-muted/20 opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium flex items-center gap-3 ${style}`}
            >
              <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
              {answered && i === quiz.correct && <CheckCircle className="ml-auto h-4 w-4 text-emerald-600 flex-shrink-0" />}
              {answered && i === selected && !isCorrect && i !== quiz.correct && <XCircle className="ml-auto h-4 w-4 text-red-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-4 rounded-xl p-4 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
          <p className={`text-sm font-semibold mb-1 ${isCorrect ? "text-emerald-700" : "text-amber-700"}`}>
            {isCorrect ? "🎉 Correct! Well done!" : "💡 Not quite, but here's why:"}
          </p>
          <p className="text-sm text-muted-foreground">{quiz.explanation}</p>
          {!isCorrect && (
            <button
              onClick={() => { setSelected(null); setAnswered(false); }}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              <RotateCcw className="h-3 w-3" /> Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}