import { useState } from "react";
import { X, ChevronDown, ChevronUp, CheckCircle, Lock, Circle } from "lucide-react";
import LessonContent from "./LessonContent";
import ExitModal from "./ExitModal";
import ProgressBar from "./ProgressBar";

const levelColors = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
  pink: "bg-pink-100 text-pink-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  cyan: "bg-cyan-100 text-cyan-700",
  emerald: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  violet: "bg-violet-100 text-violet-700",
};

export default function ModuleCard({ tool, isExpanded, onToggle, completedLessons, onLessonComplete, onClose }) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showExit, setShowExit] = useState(false);

  const completedCount = tool.lessons.filter((_, i) => completedLessons.includes(`${tool.id}-${i}`)).length;
  const isModuleComplete = completedCount === tool.lessons.length;

  const handleMoveOn = () => {
    const lessonKey = `${tool.id}-${currentLesson}`;
    onLessonComplete(lessonKey);
    if (currentLesson < tool.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  return (
    <div className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isExpanded ? "border-violet-300 shadow-xl shadow-violet-100" : "border-border hover:border-violet-200 hover:shadow-md"}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <span className="text-3xl">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-foreground text-lg">{tool.name}</h3>
            {isModuleComplete && <CheckCircle className="h-4 w-4 text-emerald-500" />}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{tool.description}</p>
          {!isExpanded && (
            <div className="mt-2">
              <ProgressBar value={completedCount} max={tool.lessons.length} showLabel={false} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[tool.levelColor] || levelColors.violet}`}>
            {tool.level}
          </span>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Module Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-muted/30">
            <div className="flex items-center gap-3">
              <ProgressBar value={completedCount} max={tool.lessons.length} className="w-40 hidden sm:block" />
              <span className="text-xs text-muted-foreground">{completedCount}/{tool.lessons.length} lessons done</span>
            </div>
            <button
              onClick={() => setShowExit(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-background"
            >
              <X className="h-3.5 w-3.5" /> Exit Module
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Lesson Sidebar */}
            <div className="md:w-56 border-b md:border-b-0 md:border-r border-border bg-muted/20 p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 px-2">Lessons</p>
              <div className="space-y-1">
                {tool.lessons.map((lesson, i) => {
                  const done = completedLessons.includes(`${tool.id}-${i}`);
                  const active = i === currentLesson;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentLesson(i)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                        active ? "bg-violet-100 text-violet-800" : done ? "text-emerald-700 hover:bg-emerald-50" : "text-muted-foreground hover:bg-background"
                      }`}
                    >
                      {done ? (
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      ) : active ? (
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-violet-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span className="leading-tight">{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lesson Main Content */}
            <div className="flex-1 p-5 min-w-0">
              <h4 className="font-bold text-lg text-foreground mb-4">
                {tool.lessons[currentLesson].title}
              </h4>
              <LessonContent
                key={`${tool.id}-${currentLesson}`}
                lesson={tool.lessons[currentLesson]}
                lessonIndex={currentLesson}
                totalLessons={tool.lessons.length}
                isLast={currentLesson === tool.lessons.length - 1}
                onMoveOn={handleMoveOn}
                completedQuizzes={completedLessons.includes(`${tool.id}-${currentLesson}`)}
              />
            </div>
          </div>
        </div>
      )}

      {showExit && (
        <ExitModal
          onClose={() => setShowExit(false)}
          onContinue={() => setShowExit(false)}
          onEnd={() => { setShowExit(false); onClose(); }}
        />
      )}
    </div>
  );
}