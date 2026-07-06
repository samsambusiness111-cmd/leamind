import { useState } from "react";
import { Volume2, BookOpen, Lightbulb, Star, AlertTriangle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Quiz from "./Quiz";

function TipBox({ tip }) {
  const config = {
    pro: { icon: Star, color: "violet", label: "Pro Advice", bg: "bg-violet-50 border-violet-200", text: "text-violet-800", icon_color: "text-violet-600" },
    example: { icon: Lightbulb, color: "amber", label: "Example", bg: "bg-amber-50 border-amber-200", text: "text-amber-800", icon_color: "text-amber-600" },
    warning: { icon: AlertTriangle, color: "red", label: "Watch Out", bg: "bg-red-50 border-red-200", text: "text-red-800", icon_color: "text-red-600" },
  };
  const c = config[tip.type] || config.pro;
  const Icon = c.icon;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${c.bg} my-3`}>
      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${c.icon_color}`} />
      <div>
        <span className={`text-xs font-bold uppercase tracking-wide ${c.text}`}>{c.label}: </span>
        <span className={`text-sm ${c.text}`}>{tip.text}</span>
      </div>
    </div>
  );
}

function renderContent(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Bold + rest
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={j} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
      }
      return <span key={j}>{p}</span>;
    });
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return <li key={i} className="ml-4 list-disc text-muted-foreground text-sm leading-relaxed">{rendered}</li>;
    }
    if (/^\d+\./.test(line.trim())) {
      return <li key={i} className="ml-4 list-decimal text-muted-foreground text-sm leading-relaxed">{rendered}</li>;
    }
    return <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-1">{rendered}</p>;
  });
}

export default function LessonContent({ lesson, lessonIndex, totalLessons, isLast, onMoveOn, onQuizComplete, completedQuizzes }) {
  const [mode, setMode] = useState("read");
  const [speaking, setSpeaking] = useState(false);
  const [quizDone, setQuizDone] = useState(completedQuizzes || false);

  const handleListen = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(lesson.content.replace(/\*\*/g, ''));
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleQuizComplete = (correct) => {
    setQuizDone(true);
    onQuizComplete && onQuizComplete(correct);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          <button
            onClick={() => setMode("read")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === "read" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Read
          </button>
          <button
            onClick={handleListen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${speaking ? "bg-violet-100 text-violet-700" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Volume2 className={`h-3.5 w-3.5 ${speaking ? "animate-pulse" : ""}`} />
            {speaking ? "Stop" : "Listen"}
          </button>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">Lesson {lessonIndex + 1} of {totalLessons}</span>
      </div>

      {/* Content */}
      <div className="bg-muted/30 rounded-2xl p-5 border border-border">
        <div className="space-y-1">
          {renderContent(lesson.content)}
        </div>
      </div>

      {/* Tips */}
      {lesson.tips?.map((tip, i) => <TipBox key={i} tip={tip} />)}

      {/* Quiz */}
      {lesson.quiz && (
        <Quiz quiz={lesson.quiz} onComplete={handleQuizComplete} />
      )}

      {/* Move On Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onMoveOn}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-105 active:scale-100"
        >
          {isLast ? "Complete Module" : "Move On"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}