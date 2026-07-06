import React from "react";

export default function ProgressBar({ value, size = "md", className = "" }) {
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };
  return (
    <div className={`w-full ${heights[size]} bg-slate-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}