import React, { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizBlock({ quiz, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === quiz.correct && onComplete) onComplete();
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const isCorrect = selected === quiz.correct;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 md:p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-600 font-bold text-xs">Q</span>
        </div>
        <h4 className="font-semibold text-slate-800 text-sm">Knowledge Check</h4>
      </div>
      <p className="text-sm text-slate-700 font-medium mb-4">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          let optClass = "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer";
          if (submitted && i === quiz.correct) optClass = "border-green-400 bg-green-50 ring-1 ring-green-200";
          else if (submitted && i === selected && !isCorrect) optClass = "border-red-300 bg-red-50";
          else if (!submitted && selected === i) optClass = "border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200";

          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left rounded-xl border p-3 text-sm transition-all ${optClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-slate-700">{opt}</span>
                {submitted && i === quiz.correct && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                {submitted && i === selected && !isCorrect && i !== quiz.correct && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 rounded-xl p-4 text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <p className={`font-semibold mb-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
              {isCorrect ? "Correct! Well done!" : "Not quite — let's review!"}
            </p>
            <p className="text-slate-600">{quiz.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mt-4">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={selected === null} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            Check Answer
          </Button>
        ) : !isCorrect ? (
          <Button onClick={handleRetry} variant="outline" size="sm" className="gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </Button>
        ) : null}
      </div>
    </div>
  );
}