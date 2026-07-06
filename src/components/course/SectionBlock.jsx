import React from "react";
import { Lightbulb, BookOpen, Code2 } from "lucide-react";

const sectionStyles = {
  info: { border: "border-l-4 border-l-slate-300", bg: "bg-white", icon: BookOpen, iconColor: "text-slate-500" },
  tip: { border: "border-l-4 border-l-amber-400", bg: "bg-amber-50/60", icon: Lightbulb, iconColor: "text-amber-500" },
  example: { border: "border-l-4 border-l-indigo-400", bg: "bg-indigo-50/60", icon: Code2, iconColor: "text-indigo-500" },
};

export default function SectionBlock({ section }) {
  const style = sectionStyles[section.type] || sectionStyles.info;
  const Icon = style.icon;

  return (
    <div className={`${style.border} ${style.bg} rounded-r-xl p-5 md:p-6`}>
      <div className="flex items-start gap-3 mb-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.iconColor}`} />
        <h3 className="font-semibold text-base text-slate-800">{section.title}</h3>
      </div>
      <div className="pl-8 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
        {section.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="text-slate-800 font-semibold">{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    </div>
  );
}