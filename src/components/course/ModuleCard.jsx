import React from "react";
import ProgressBar from "./ProgressBar";

export default function ModuleCard({ module, completedLessons, onClick }) {
  const completed = module.lessons.filter(l => completedLessons.includes(l.id)).length;
  const progress = Math.round((completed / module.lessons.length) * 100);

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shrink-0 shadow-sm text-2xl`}>
          {module.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{module.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{module.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${module.tagColor}`}>
              {module.level}
            </span>
            <span className="text-[10px] text-slate-400">{module.lessons.length} lessons</span>
          </div>
          {completed > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <ProgressBar value={progress} size="sm" className="flex-1" />
              <span className="text-[10px] text-slate-500">{progress}%</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}