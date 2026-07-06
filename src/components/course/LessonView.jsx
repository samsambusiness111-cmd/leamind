import React, { useState } from "react";
import { ChevronDown, ChevronRight, ArrowRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import SectionBlock from "./SectionBlock";
import QuizBlock from "./QuizBlock";

export default function LessonView({ lesson, lessonIndex, totalLessons, onNext, onComplete }) {
  const [expandedSections, setExpandedSections] = useState(
    lesson.sections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [listenMode, setListenMode] = useState(false);

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    if (onComplete) onComplete(lesson.id);
  };

  const getBestVoice = () => {
    const voices = speechSynthesis.getVoices();
    const preferred = [
      "Google UK English Female",
      "Google US English",
      "Microsoft Zira - English (United States)",
      "Microsoft David - English (United States)",
      "Samantha",
      "Karen",
    ];
    for (const name of preferred) {
      const v = voices.find(v => v.name === name);
      if (v) return v;
    }
    return voices.find(v => v.lang.startsWith("en") && !v.localService) ||
           voices.find(v => v.lang.startsWith("en")) ||
           null;
  };

  const handleListen = () => {
    if (!listenMode && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const text = lesson.sections.map(s => s.title + ". " + s.content).join(". ");
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '').replace(/\n/g, ' '));
      utterance.rate = 0.88;
      utterance.pitch = 1;
      utterance.volume = 1;
      const speak = () => {
        const voice = getBestVoice();
        if (voice) utterance.voice = voice;
        utterance.onend = () => setListenMode(false);
        speechSynthesis.speak(utterance);
      };
      if (speechSynthesis.getVoices().length > 0) {
        speak();
      } else {
        speechSynthesis.onvoiceschanged = () => { speak(); speechSynthesis.onvoiceschanged = null; };
      }
      setListenMode(true);
    } else {
      speechSynthesis.cancel();
      setListenMode(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
            Lesson {lessonIndex + 1} of {totalLessons}
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">{lesson.title}</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant={listenMode ? "default" : "outline"}
            size="sm"
            onClick={handleListen}
            className={`gap-1.5 text-xs ${listenMode ? "bg-indigo-600" : ""}`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            {listenMode ? "Stop" : "Listen"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {lesson.sections.map((section, idx) => (
          <div key={idx}>
            <button
              onClick={() => toggleSection(idx)}
              className="flex items-center gap-2 w-full text-left py-2 group"
            >
              {expandedSections[idx] ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                {section.title}
              </span>
            </button>
            <AnimatePresence>
              {expandedSections[idx] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SectionBlock section={section} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {lesson.quiz && (
        <div className="mt-8">
          <QuizBlock quiz={lesson.quiz} onComplete={handleQuizComplete} />
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          {lessonIndex < totalLessons - 1 ? "Move On" : "Finish Module"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}