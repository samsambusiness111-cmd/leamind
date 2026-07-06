import React from "react";
import { MODULES } from "./courseData";
import ProgressBar from "./ProgressBar";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function ModuleSidebar({
  activeModuleId,
  activeLessonIndex,
  completedLessons,
  onSelectModule,
  onSelectLesson,
}) {
  const getModuleProgress = (mod) => {
    const completed = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completed / mod.lessons.length) * 100);
  };

  const totalCompleted = MODULES.reduce((sum, m) => sum + m.lessons.filter(l => completedLessons.includes(l.id)).length, 0);
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const overallPct = Math.round((totalCompleted / totalLessons) * 100);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm">Course Modules</h3>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={overallPct} size="sm" />
          <span className="text-xs text-slate-500 whitespace-nowrap">{overallPct}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {MODULES.map((mod) => {
          const isActive = activeModuleId === mod.id;
          const progress = getModuleProgress(mod);

          return (
            <div key={mod.id}>
              <button
                onClick={() => onSelectModule(mod.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-slate-50 ${
                  isActive ? "bg-indigo-50 border-r-2 border-indigo-500" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center shrink-0 text-base`}>
                  {mod.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${isActive ? "text-indigo-700" : "text-slate-700"}`}>
                    {mod.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ProgressBar value={progress} size="sm" className="flex-1" />
                    <span className="text-[10px] text-slate-400">{progress}%</span>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? "rotate-90 text-indigo-500" : "text-slate-300"}`} />
              </button>

              {isActive && (
                <div className="bg-slate-50 py-1">
                  {mod.lessons.map((lesson, idx) => {
                    const isLessonActive = activeLessonIndex === idx;
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(idx)}
                        className={`w-full text-left px-4 pl-14 py-2 text-xs flex items-center gap-2 transition-colors hover:bg-slate-100 ${
                          isLessonActive ? "text-indigo-700 font-semibold bg-indigo-50/50" : "text-slate-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${isLessonActive ? "border-indigo-400" : "border-slate-300"}`} />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}